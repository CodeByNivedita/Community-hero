"use server"

import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, addDoc, Timestamp, doc, getDoc, updateDoc, increment } from "firebase/firestore"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { IssueReport } from "@/types/issue"
import { GeminiVerificationResult, VerificationRecord, VerificationStatus } from "@/types/problem-go"

const API_KEY = process.env.GEMINI_API_KEY || ""
const genAI = new GoogleGenerativeAI(API_KEY)

export async function fetchUnresolvedIssues(): Promise<IssueReport[]> {
  try {
    const q = query(collection(db, "reports"), where("status", "==", "pending"));
    const snapshot = await getDocs(q);
    const issues: IssueReport[] = [];
    
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      issues.push({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
      } as IssueReport);
    });
    
    return issues;
  } catch (error) {
    console.error("Error fetching unresolved issues:", error);
    return [];
  }
}

export async function getIssueById(id: string): Promise<IssueReport | null> {
  try {
    const docRef = doc(db, "reports", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
      } as IssueReport;
    }
    return null;
  } catch (error) {
    console.error("Error fetching issue by ID:", error);
    return null;
  }
}

const PROMPT = `
You are an expert civic maintenance auditor.
I am providing two images.
Image 1 (first): The originally reported civic issue.
Image 2 (second): A fresh photo taken by a citizen just now to verify the current state of that exact same location.

Compare the two images and determine the current state of the issue.
Return ONLY a valid JSON object matching exactly this structure, with no markdown formatting or backticks:
{
  "status": "String (Must be exactly one of: 'Still Exists', 'Partially Resolved', 'Fully Resolved', 'Fake Report')",
  "confidence": Number (Integer between 0 and 100),
  "explanation": "String (Brief 1-2 sentence explanation of your decision)"
}

Notes on status:
- 'Still Exists': The issue looks largely the same as the original report.
- 'Partially Resolved': Work has begun (e.g., cones placed, partial patching) but it's not finished.
- 'Fully Resolved': The issue is completely fixed (e.g., pothole filled, graffiti removed, trash cleared).
- 'Fake Report': The new image is completely unrelated, impossible to verify, or clearly fraudulent.
`

export async function verifyIssue(
  issueId: string,
  userId: string,
  originalImageUrl: string,
  newBase64Image: string
): Promise<{ result: GeminiVerificationResult, xpEarned: number }> {
  
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }

  if (!newBase64Image) throw new Error("No verification image provided.");

  console.log("Original image loaded");
  console.log("Verification image converted");

  // 1. Process original image (might be legacy URL or base64 data URI)
  let originalBase64 = "";
  let originalMimeType = "image/jpeg";
  
  if (originalImageUrl.startsWith("data:")) {
    const parts = originalImageUrl.split(",");
    originalMimeType = parts[0].split(":")[1].split(";")[0];
    originalBase64 = parts[1];
  } else {
    // Legacy support for older reports that used Firebase Storage
    const originalRes = await fetch(originalImageUrl);
    if (!originalRes.ok) throw new Error("Failed to fetch original image for comparison.");
    const originalArrayBuffer = await originalRes.arrayBuffer();
    originalBase64 = Buffer.from(originalArrayBuffer).toString("base64");
    originalMimeType = originalRes.headers.get("content-type") || "image/jpeg";
  }

  // 2. Process new image
  const parts = newBase64Image.split(",");
  const newMimeType = parts[0].split(":")[1].split(";")[0];
  const newBase64 = parts[1];

  // 3. Call Gemini API for Verification
  const modelName = "gemini-2.5-flash";
  console.log("Starting verification");
  console.log("Original image size:", originalBase64.length);
  console.log("Verification image size:", newBase64.length);
  console.log("Using model:", modelName);

  const model = genAI.getGenerativeModel({ model: modelName });

  const imageParts = [
    { inlineData: { data: originalBase64, mimeType: originalMimeType } },
    { inlineData: { data: newBase64, mimeType: newMimeType } }
  ];

  let geminiResult: GeminiVerificationResult;
  try {
    const result = await model.generateContent([PROMPT, ...imageParts]);
    const responseText = (await result.response).text();
    console.log("Gemini raw response:", responseText);
    
    const cleanedText = responseText.replace(/```json\n?|```\n?/g, "").trim();
    try {
      geminiResult = JSON.parse(cleanedText) as GeminiVerificationResult;
    } catch (parseError) {
      geminiResult = {
        status: "Fake Report",
        confidence: 0,
        explanation: "Gemini returned an invalid response."
      };
    }
  } catch (error) {
    console.error("Gemini Verification Error:", error);
    console.error("Model:", modelName);
    console.error("API Key Exists:", !!process.env.GEMINI_API_KEY);
    throw error;
  }

  // 4. Save Verification to Firestore
  const verificationRecord: VerificationRecord = {
    issueId,
    userId,
    image: newBase64Image, // Store Base64 directly
    status: geminiResult.status,
    confidence: geminiResult.confidence,
    createdAt: Timestamp.now()
  };

  await addDoc(collection(db, "verifications"), verificationRecord);

  // 4. Calculate XP
  let xpAwarded = 25; // Base for Verification
  
  const verificationsQuery = query(collection(db, "verifications"), where("issueId", "==", issueId));
  const verificationsSnap = await getDocs(verificationsQuery);
  if (verificationsSnap.size <= 1) { 
    xpAwarded += 10;
  }

  if (geminiResult.confidence >= 90) {
    xpAwarded += 5;
  }

  if (geminiResult.status === "Fully Resolved") {
    xpAwarded += 50;
  }

  // 5. Update User XP
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    await updateDoc(userRef, {
      xp: increment(xpAwarded),
      reportsVerified: increment(1)
    });
  }

  return { result: geminiResult, xpEarned: xpAwarded };
}
