"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Map, MapPinned, Trophy, BarChart3, Medal, User, Settings, PlusCircle } from "lucide-react"

interface NavItem {
 name: string
 href: string
 icon: React.ReactNode
}

const navItems: NavItem[] = [
 { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
 { name: "Report Issue", href: "/report", icon: <PlusCircle className="h-5 w-5" /> },
 { name: "Map", href: "/map", icon: <Map className="h-5 w-5" /> },
 { name: "Problem GO", href: "/problem-go", icon: <MapPinned className="h-5 w-5" /> },
 { name: "Leaderboard", href: "/leaderboard", icon: <Trophy className="h-5 w-5" /> },
 { name: "Ranking", href: "/ranking", icon: <BarChart3 className="h-5 w-5" /> },
 { name: "Awards", href: "/awards", icon: <Medal className="h-5 w-5" /> },
 { name: "Profile", href: "/profile", icon: <User className="h-5 w-5" /> },
]

export function Sidebar({ className }: { className?: string }) {
 const pathname = usePathname()

 return (
 <div className={cn("hidden md:flex flex-col w-64 h-screen border-r border-white/20 dark:border-white/10 glass-dark fixed left-0 top-0 pt-20 pb-4 px-4", className)}>
 <div className="flex flex-col gap-2 flex-1 mt-4">
 {navItems.map((item) => {
 const isActive = pathname.startsWith(item.href)
 return (
 <Link
 key={item.href}
 href={item.href}
 className={cn(
 "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
 isActive 
 ? "bg-white/20 dark:bg-white/10 shadow-lg text-primary font-medium" 
 : "hover:bg-white/10 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground"
 )}
 >
 {item.icon}
 {item.name}
 </Link>
 )
 })}
 </div>
 
 <div className="mt-auto">
 <Link
 href="/settings"
 className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
 >
 <Settings className="h-5 w-5" />
 Settings
 </Link>
 </div>
 </div>
 )
}
