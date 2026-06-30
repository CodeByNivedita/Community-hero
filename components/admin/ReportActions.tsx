"use client";

import { useState } from "react";
import { IssueReport } from "@/types/issue";
import { UserProfile } from "@/types/user";
import { updateReportStatus, deleteReport } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  Trash2,
  Loader2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ReportActionsProps {
  report: IssueReport;
  adminProfile: UserProfile;
  onStatusChange: (newReport: IssueReport) => void;
}

export function ReportActions({ report, adminProfile, onStatusChange }: ReportActionsProps) {
  const [loading, setLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  
  // Reject form state
  const [rejectionReason, setRejectionReason] = useState("");

  // Resolve form state
  const [resolutionNote, setResolutionNote] = useState("");
  // In a real app we'd also have file upload here for resolutionPhotoUrl

  const adminInfo = {
    adminId: adminProfile.uid,
    adminName: adminProfile.name,
    adminEmail: adminProfile.email
  };

  const handleStatusUpdate = async (newStatus: any, action: any, additionalUpdates: any = {}, successMsg: string) => {
    setLoading(true);
    try {
      await updateReportStatus(report.id!, report.status, newStatus, adminInfo, additionalUpdates, action);
      onStatusChange({ ...report, status: newStatus, ...additionalUpdates });
      toast.success(successMsg);
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => handleStatusUpdate("verified", "approve", {}, "Report approved and verified.");
  
  const handleAssign = () => {
    // For demo purposes, we automatically assign to the AI suggested department
    const dept = report.aiAnalysis?.department || "General Services";
    handleStatusUpdate("in_progress", "assign", { assignedDepartment: dept }, `Assigned to ${dept}.`);
  };

  const handleMarkInProgress = () => handleStatusUpdate("in_progress", "mark_in_progress", {}, "Report marked as in progress.");

  const submitReject = async () => {
    if (!rejectionReason) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    setRejectDialogOpen(false);
    handleStatusUpdate("rejected", "reject", { rejectionReason }, "Report rejected.");
  };

  const submitResolve = async () => {
    if (!resolutionNote) {
      toast.error("Please provide a resolution note.");
      return;
    }
    setResolveDialogOpen(false);
    handleStatusUpdate("resolved", "resolve", { 
      resolutionNote,
      resolvedAt: new Date()
    }, "Report marked as resolved.");
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this report?")) return;
    setLoading(true);
    try {
      await deleteReport(report.id!, adminInfo);
      toast.success("Report deleted");
      // Go back since it's deleted
      window.history.back();
    } catch (error) {
      toast.error("Failed to delete report");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Authority Actions</h3>
        
        <div className="space-y-3">
          {report.status === "pending" && (
            <>
              <Button onClick={handleApprove} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve & Verify
              </Button>
              <Button onClick={() => setRejectDialogOpen(true)} disabled={loading} variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                <XCircle className="mr-2 h-4 w-4" /> Reject Report
              </Button>
            </>
          )}

          {report.status === "verified" && (
            <Button onClick={handleAssign} disabled={loading} className="w-full bg-primary hover:bg-primary text-white">
              <Building2 className="mr-2 h-4 w-4" /> Assign Department
            </Button>
          )}

          {report.status === "in_progress" && (
            <Button onClick={() => setResolveDialogOpen(true)} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Resolved
            </Button>
          )}

          {(report.status === "rejected" || report.status === "resolved") && (
            <div className="text-center p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
              No further actions available for this status.
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100">
          <Button onClick={handleDelete} disabled={loading} variant="ghost" className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 text-xs">
            <Trash2 className="mr-2 h-4 w-4" /> Delete Spam/Fake Report
          </Button>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Report</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this report. The citizen will be notified.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Reason</label>
            <Input 
              value={rejectionReason} 
              onChange={(e) => setRejectionReason(e.target.value)} 
              placeholder="e.g., Duplicate, Not a civic issue, Unclear image" 
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={submitReject}>Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Issue</DialogTitle>
            <DialogDescription>Provide details on how the issue was resolved.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Resolution Note</label>
              <Textarea 
                value={resolutionNote} 
                onChange={(e) => setResolutionNote(e.target.value)} 
                placeholder="Describe the work done to resolve the issue..." 
                className="min-h-[100px]"
              />
            </div>
            {/* For demo, omit the file upload logic to keep it simple, but in reality we'd upload an image and pass the URL */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={submitResolve}>Mark as Resolved</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
