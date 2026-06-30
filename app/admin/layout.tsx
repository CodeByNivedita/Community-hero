"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { toast } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("[AdminLayout] useEffect running. loading:", loading, "user:", user?.uid, "profile:", profile?.role, "pathname:", pathname);
    if (!loading) {
      if (!user) {
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      } else if (!profile || profile.role !== "authority") {
        toast.error("Access Denied: You do not have authority privileges.");
        router.push("/dashboard");
      }
    }
  }, [user, profile, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // If on login page, don't show sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If authenticated but not authority, don't render content (redirect is handling it)
  if (!profile || profile.role !== "authority") {
    console.log("[AdminLayout] Returning Access Denied instead of null because !profile or role is not authority. profile:", profile);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600 font-bold">
        Access Denied or Profile Loading...
      </div>
    );
  }

  console.log("[AdminLayout] Rendering Admin Sidebar and children");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar profile={profile} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
