import { Timestamp } from "firebase/firestore"

export type VerificationStatus = "Still Exists" | "Partially Resolved" | "Fully Resolved" | "Fake Report"

export interface GeminiVerificationResult {
  status: VerificationStatus
  confidence: number
  explanation: string
}

export interface VerificationRecord {
  id?: string
  issueId: string
  userId: string
  image: string
  status: VerificationStatus
  confidence: number
  createdAt: Date | Timestamp
}

export interface MissionLog {
  id?: string
  userId: string
  type: "VERIFICATION" | "REPORT"
  xpEarned: number
  timestamp: Date | Timestamp
}
