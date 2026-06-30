"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { GeminiVerificationResult } from "@/types/problem-go"

const API_KEY = process.env.GEMINI_API_KEY || ""
const genAI = new GoogleGenerativeAI(API_KEY)

const PROMPT = `
You are an expert civic maintenance auditor.
I am providing two images.
Image 1 (first): The originally reported civic issue.
Image 2 (second): A fresh photo taken by a citizen just now to verify the current state of that exact same location.

Compare the two images and determine the current state of the issue.
Return ONLY a valid JSON object matching exactly this structure, with no markdown formatting or backticks:
{
  "state": "String (Must be exactly one of: 'Still Exists', 'Partially Resolved', 'Fully Resolved', 'Fake Report')",
  "confidence": Number (Integer between 0 and 100),
  "reasoning": "String (Brief 1-2 sentence explanation of your decision)"
}

Notes on state:
- 'Still Exists': The issue looks largely the same as the original report.
- 'Partially Resolved': Work has begun (e.g., cones placed, partial patching) but it's not finished.
- 'Fully Resolved': The issue is completely fixed (e.g., pothole filled, graffiti removed, trash cleared).
- 'Fake Report': The new image is completely unrelated, impossible to verify, or clearly fraudulent.
`

export async function verifyIssueWithGemini(
  originalImageUrl: string, 
  newImageFormData: FormData
): Promise<GeminiVerificationResult> {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is missing.")
  }

  try {
    // 1. Get the new image from FormData
    const newFile = newImageFormData.get("image") as File
    if (!newFile) throw new Error("No new verification image provided.")
    const newArrayBuffer = await newFile.arrayBuffer()
    const newBase64 = Buffer.from(newArrayBuffer).toString("base64")

    // 2. Fetch the original image from the URL and convert to base64
    // Note: In a real app, this should handle CORS or use admin storage SDK if needed.
    // For this prototype, we'll try a standard fetch.
    const originalRes = await fetch(originalImageUrl)
    if (!originalRes.ok) throw new Error("Failed to fetch original image for comparison.")
    const originalArrayBuffer = await originalRes.arrayBuffer()
    const originalBase64 = Buffer.from(originalArrayBuffer).toString("base64")
    const originalMimeType = originalRes.headers.get("content-type") || "image/jpeg"

    // 3. Prompt Gemini 1.5 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const imageParts = [
      {
        inlineData: {
          data: originalBase64,
          mimeType: originalMimeType,
        },
      },
      {
        inlineData: {
          data: newBase64,
          mimeType: newFile.type,
        },
      }
    ]

    const result = await model.generateContent([PROMPT, ...imageParts])
    const response = await result.response
    const text = response.text()
    
    // Clean up potential markdown formatting
    const cleanedText = text.replace(/```json\n?|```\n?/g, "").trim()
    
    return JSON.parse(cleanedText) as GeminiVerificationResult

  } catch (error: any) {
    console.error("Gemini Verification Error:", error)
    throw new Error("Failed to verify image using Gemini AI: " + (error?.message || ""))
  }
}
