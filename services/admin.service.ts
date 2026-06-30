import { db } from "@/lib/firebase/config";
import { collection, doc, getDocs, query, where, updateDoc, addDoc, Timestamp, orderBy, deleteDoc } from "firebase/firestore";
import { IssueReport } from "@/types/issue";
import { AuditLog, AdminAction } from "@/types/audit";

/**
 * Fetch reports for an admin, optionally filtered by area and status
 */
export async function getAdminReports(adminArea?: string, statusFilter?: string): Promise<IssueReport[]> {
  const reportsRef = collection(db, "reports");
  
  let q = query(reportsRef, orderBy("createdAt", "desc"));

  // If admin is assigned an area, filter by it (or just return all if not specified for a super admin)
  if (adminArea) {
    q = query(q, where("adminArea", "==", adminArea));
  }

  if (statusFilter && statusFilter !== "all") {
    q = query(q, where("status", "==", statusFilter));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IssueReport));
}

/**
 * Log an action to the auditLogs collection
 */
export async function logAdminAction(log: Omit<AuditLog, "id" | "timestamp">) {
  const auditLogsRef = collection(db, "auditLogs");
  await addDoc(auditLogsRef, {
    ...log,
    timestamp: Timestamp.now()
  });
}

/**
 * Update the status of a report and log the action
 */
export async function updateReportStatus(
  reportId: string,
  previousStatus: string,
  newStatus: "pending" | "verified" | "in_progress" | "resolved" | "rejected",
  adminInfo: { adminId: string; adminName: string; adminEmail: string },
  additionalUpdates: Partial<IssueReport> = {},
  actionName: AdminAction,
  notes?: string
): Promise<void> {
  const reportRef = doc(db, "reports", reportId);

  // 1. Update report
  await updateDoc(reportRef, {
    status: newStatus,
    updatedAt: Timestamp.now(),
    ...additionalUpdates
  });

  // 2. Log action
  await logAdminAction({
    reportId,
    adminId: adminInfo.adminId,
    adminName: adminInfo.adminName,
    adminEmail: adminInfo.adminEmail,
    action: actionName,
    previousStatus,
    newStatus,
    notes
  });
}

/**
 * Permanently delete a fake/spam report
 */
export async function deleteReport(reportId: string, adminInfo: { adminId: string; adminName: string; adminEmail: string }): Promise<void> {
  const reportRef = doc(db, "reports", reportId);
  await deleteDoc(reportRef);

  await logAdminAction({
    reportId,
    adminId: adminInfo.adminId,
    adminName: adminInfo.adminName,
    adminEmail: adminInfo.adminEmail,
    action: "delete",
    previousStatus: "any",
    newStatus: "deleted",
    notes: "Permanently deleted report."
  });
}
