"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { AIAnalysisResult } from "@/types/issue"

const API_KEY = process.env.GEMINI_API_KEY || ""
const genAI = new GoogleGenerativeAI(API_KEY)

const PROMPT = `
Analyze this image of a civic issue (e.g., pothole, graffiti, broken streetlight, trash). 
Act as an expert city planner and maintenance dispatcher.

Return ONLY a valid JSON object matching exactly this structure, with no markdown formatting or backticks:
{
  "category": "String (e.g., Pothole, Graffiti, Lighting, Sanitation, Infrastructure, Safety)",
  "title": "String (A concise, descriptive title)",
  "description": "String (A detailed description of the issue shown in the image)",
  "severity": "String (Must be exactly one of: Low, Medium, High, Critical)",
  "confidence": Number (An integer between 0 and 100 representing your confidence in this analysis),
  "department": "String (The specific local government department that should handle this)",
  "repairTime": "String (Estimated time to repair, e.g., '3 Days', '24 Hours')",
  "duplicateReportPossibility": Boolean (true if this looks like a very common issue that is frequently reported multiple times in the same area, false otherwise)
}
`

function getErrorCode(error: any, errorMessage: string): string {
  const msgLower = errorMessage.toLowerCase();
  
  if (msgLower.includes("429") || msgLower.includes("quota") || msgLower.includes("limit") || msgLower.includes("exhausted")) return "ERROR_429";
  if (msgLower.includes("503") || msgLower.includes("overloaded") || msgLower.includes("busy") || msgLower.includes("unavailable")) return "ERROR_503";
  if (msgLower.includes("500") || msgLower.includes("internal server error")) return "ERROR_500";
  if (msgLower.includes("api key not valid") || msgLower.includes("api_key_invalid") || msgLower.includes("unauthorized")) return "ERROR_AUTH";
  if (msgLower.includes("fetch failed") || msgLower.includes("network") || msgLower.includes("econnrefused")) return "ERROR_NETWORK";
  if (msgLower.includes("timeout") || msgLower.includes("aborted")) return "ERROR_TIMEOUT";
  
  if (error?.status === 503) return "ERROR_503";
  if (error?.status === 429) return "ERROR_429";
  if (error?.status === 500) return "ERROR_500";
  
  return "ERROR_UNKNOWN";
}

function createFallback(errorMessage: string, errorCode: string = "ERROR_UNKNOWN"): AIAnalysisResult {
  return {
    title: "Unidentified Issue",
    category: "Other",
    description: "Could not automatically analyze the image. Please provide details manually.",
    severity: "Medium",
    confidence: 0,
    department: "General Services",
    repairTime: "Unknown",
    duplicateReportPossibility: false,
    error: errorMessage,
    errorCode: errorCode
  };
}

export async function analyzeIssueImage(formData: FormData): Promise<AIAnalysisResult> {
  console.log("--- DEBUGGING GEMINI API ---");
  
  if (!API_KEY) {
    console.error("GEMINI_API_KEY environment variable is missing.");
    return createFallback("GEMINI_API_KEY environment variable is missing.", "ERROR_AUTH");
  }

  try {
    const file = formData.get("image") as File
    if (!file) {
      console.error("No image file provided in FormData");
      return createFallback("No image file provided in FormData", "ERROR_VALIDATION");
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = buffer.toString("base64")
    
    const mimeType = file.type || "image/jpeg";
    const modelName = "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName })

    const imageParts = [
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
    ]

    console.log(`Requesting Gemini API with model: ${modelName}`);
    const result = await model.generateContent([PROMPT, ...imageParts])
    
    const response = await result.response
    const text = response.text()
    
    const cleanedText = text.replace(/```json\n?|```\n?/g, "").trim()
    const parsedData = JSON.parse(cleanedText) as AIAnalysisResult
    
    return parsedData
  } catch (error: any) {
    console.error("Full Error Object from Gemini:", error);
    
    const errorMessage = error?.message || String(error) || "Unknown Error";
    const errorCode = getErrorCode(error, errorMessage);
    
    // We strictly log the error here in the console, but the UI will only see the errorCode
    console.error(`AI Service failed with ${errorCode}:`, errorMessage)
    
    return createFallback(errorMessage, errorCode);
  }
}
