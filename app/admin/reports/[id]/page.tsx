"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { IssueReport } from "@/types/issue";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, User, Loader2, AlertTriangle } from "lucide-react";
import { ReportActions } from "@/components/admin/ReportActions";

export default function AdminReportDetailsPage() {
  const { id } = useParams();
  const { profile } = useAuthContext();
  const router = useRouter();
  const [report, setReport] = useState<IssueReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      if (!id || typeof id !== "string") return;
      try {
        const docRef = doc(db, "reports", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setReport({ id: docSnap.id, ...docSnap.data() } as IssueReport);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Report Not Found</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin")}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full shadow-sm">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Report</h1>
          <p className="text-sm text-gray-500">ID: {report.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-64 sm:h-96 w-full bg-gray-100 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={report.imageUrl.startsWith("blob:") ? "/pothole.jpg" : report.imageUrl} 
                alt="Reported Issue" 
                className="w-full h-full object-cover"
                onError={(e) => e.currentTarget.src = "/pothole.jpg"}
              />
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                  report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                  report.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                  report.status === 'rejected' ? 'bg-gray-100 text-gray-700' :
                  report.status === 'in_progress' ? 'bg-primary text-primary' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {report.status.replace("_", " ")}
                </span>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                  report.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                  report.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                  report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {report.severity} Priority
                </span>
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-gray-100 text-gray-700">
                  {report.category}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">{report.title}</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{report.description}</p>
              
              {/* Location */}
              <div className="mt-6 flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <MapPin className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Location Details</p>
                  <p className="text-gray-600 text-sm mt-1">{report.location.address || "No address provided"}</p>
                  <p className="text-gray-500 text-xs mt-1 font-mono">
                    {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution Note if resolved */}
          {report.status === "resolved" && report.resolutionNote && (
            <div className="bg-green-50 rounded-2xl shadow-sm border border-green-200 p-6">
              <h3 className="font-bold text-green-800 mb-2">Resolution Details</h3>
              <p className="text-green-700 text-sm whitespace-pre-wrap">{report.resolutionNote}</p>
              {report.resolutionPhotoUrl && (
                <div className="mt-4 h-48 w-full md:w-64 rounded-lg overflow-hidden border border-green-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={report.resolutionPhotoUrl} alt="Resolution" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}

          {/* Rejection Note if rejected */}
          {report.status === "rejected" && report.rejectionReason && (
            <div className="bg-red-50 rounded-2xl shadow-sm border border-red-200 p-6">
              <h3 className="font-bold text-red-800 mb-2">Rejection Reason</h3>
              <p className="text-red-700 text-sm">{report.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Right Column - AI & Actions */}
        <div className="space-y-6">
          {/* Admin Actions Component */}
          {profile && (
            <ReportActions 
              report={report} 
              adminProfile={profile} 
              onStatusChange={(newReport) => setReport(newReport)} 
            />
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Reporter Info</h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                {report.reporterPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={report.reporterPhoto} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-gray-900 truncate">{report.reporterName || "Anonymous"}</p>
                <p className="text-xs text-gray-500 truncate">{report.reporterEmail || "No email"}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Reported</p>
              <p className="text-sm font-semibold text-gray-800">
                {report.createdAt ? formatDistanceToNow((report.createdAt as any).toDate ? (report.createdAt as any).toDate() : new Date(report.createdAt as any), { addSuffix: true }) : "Unknown"}
              </p>
            </div>
          </div>

          {report.aiAnalysis && (
            <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-6 text-white">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
                <h3 className="font-bold text-slate-100">AI Analysis</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  report.aiAnalysis.confidence > 80 ? "bg-green-500/20 text-green-400" :
                  report.aiAnalysis.confidence > 50 ? "bg-amber-500/20 text-amber-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {report.aiAnalysis.confidence}% Match
                </span>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-400 text-xs">Suggested Department</p>
                  <p className="font-semibold text-blue-400">{report.aiAnalysis.department}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Estimated Repair Time</p>
                  <p className="font-medium text-slate-200">{report.aiAnalysis.repairTime}</p>
                </div>
                {report.aiAnalysis.duplicateReportPossibility && (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-amber-200/90 text-xs mt-4">
                    <AlertTriangle className="h-4 w-4 inline mr-1 mb-0.5" />
                    High probability of duplicate report in this area.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
