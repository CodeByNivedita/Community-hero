"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserProfile } from "@/types/user";
import { logoutUser } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  Map, 
  FileCheck, 
  LogOut, 
  ShieldAlert,
  Settings
} from "lucide-react";

interface AdminSidebarProps {
  profile: UserProfile;
}

export function AdminSidebar({ profile }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      // Redirect is handled by layout/middleware
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Reports Map", href: "/admin/map", icon: Map },
    { name: "Audit Logs", href: "/admin/audit", icon: FileCheck },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 shrink-0 shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <ShieldAlert className="h-8 w-8 text-blue-500" />
        <div>
          <h2 className="font-bold text-lg leading-tight">Authority Portal</h2>
          <p className="text-xs text-blue-400">{profile.adminArea || "Global"} Region</p>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Navigation</p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-900/20" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{profile.name}</p>
            <p className="text-xs text-slate-400 truncate">{profile.email}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
