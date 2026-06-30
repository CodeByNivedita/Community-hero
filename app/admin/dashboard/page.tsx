"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getAdminReports } from "@/services/admin.service";
import { IssueReport } from "@/types/issue";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Building2,
  ChevronRight,
  ShieldCheck,
  Search,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminDashboardPage() {
  const { profile } = useAuthContext();
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  console.log("[AdminDashboardPage] Component rendered. Profile present:", !!profile);

  useEffect(() => {
    async function loadReports() {
      if (!profile) {
        console.log("[AdminDashboardPage] Effect skipped: No profile");
        return;
      }
      try {
        console.log(`[AdminDashboardPage] Fetching reports for area: ${profile.adminArea}`);
        const data = await getAdminReports(profile.adminArea);
        console.log(`[AdminDashboardPage] Successfully loaded ${data.length} reports`);
        setReports(data);
      } catch (error) {
        console.error("[AdminDashboardPage] Failed to load admin reports:", error);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [profile]);

  if (!profile) {
    console.log("[AdminDashboardPage] Profile is null, rendering loading indicator");
    return (
      <div className="flex items-center justify-center p-12 text-gray-500">
        Loading dashboard profile...
      </div>
    );
  }

  console.log("[AdminDashboardPage] Rendering dashboard grid");

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.adminArea || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "pending").length,
    verified: reports.filter(r => r.status === "verified").length,
    assigned: reports.filter(r => !!r.assignedDepartment && r.status !== "resolved").length,
    inProgress: reports.filter(r => r.status === "in_progress").length,
    resolved: reports.filter(r => r.status === "resolved").length,
    rejected: reports.filter(r => r.status === "rejected").length,
    highSeverity: reports.filter(r => r.severity === "High" || r.severity === "Critical").length,
  };

  const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${bgColorClass}`}>
        <Icon className={`h-6 w-6 ${colorClass}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Manage issues for {profile.adminArea || "all regions"}.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Reports" value={stats.total} icon={ClipboardList} colorClass="text-blue-600" bgColorClass="bg-blue-50" />
        <StatCard title="Pending Review" value={stats.pending} icon={Clock} colorClass="text-amber-600" bgColorClass="bg-amber-50" />
        <StatCard title="High Severity" value={stats.highSeverity} icon={AlertTriangle} colorClass="text-red-600" bgColorClass="bg-red-50" />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle2} colorClass="text-green-600" bgColorClass="bg-green-50" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <ShieldCheck className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Verified</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <Building2 className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stats.assigned}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Assigned</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <Clock className="h-5 w-5 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">In Progress</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <XCircle className="h-5 w-5 text-slate-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Rejected</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Reports</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search reports..." 
              className="pl-9 h-10 border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Issue</th>
                <th className="px-6 py-4">Area</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading reports...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No reports found.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-gray-100 shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={report.imageUrl.startsWith("blob:") ? "/pothole.jpg" : report.imageUrl} alt="" className="h-full w-full object-cover" onError={e => e.currentTarget.src = "/pothole.jpg"} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 truncate max-w-[200px]">{report.title}</p>
                          <p className="text-xs text-gray-500">{report.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {report.adminArea || "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        report.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                        report.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                        report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        report.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                        report.status === 'rejected' ? 'bg-gray-100 text-gray-700' :
                        report.status === 'in_progress' ? 'bg-primary text-primary' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {report.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.createdAt ? formatDistanceToNow((report.createdAt as any).toDate ? (report.createdAt as any).toDate() : new Date(report.createdAt as any), { addSuffix: true }) : "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/reports/${report.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Review <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
