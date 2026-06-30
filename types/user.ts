import { Timestamp } from "firebase/firestore";

export type UserRole = "citizen" | "authority";

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  earnedAt: Timestamp;
  iconUrl?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  
  // Authority Specific Fields
  department?: string;
  city?: string;
  verified?: boolean;
  
  adminArea?: string; // e.g. "Jammu", "Delhi"
  xp: number;
  level: number;
  trustScore: number;
  reportsSubmitted: number;
  reportsVerified: number;
  fakeReports: number;
  badges: UserBadge[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
