import { Timestamp } from "firebase/firestore";

export type AdminAction = 
  | "approve"
  | "reject"
  | "assign"
  | "mark_in_progress"
  | "resolve"
  | "request_info"
  | "delete";

export interface AuditLog {
  id?: string;
  reportId: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  action: AdminAction;
  previousStatus: string;
  newStatus: string;
  notes?: string;
  timestamp: Timestamp | Date;
}
