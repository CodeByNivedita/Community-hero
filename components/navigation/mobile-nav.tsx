"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Map, PlusCircle, Trophy, User, MapPinned, BarChart3, Medal, Settings } from "lucide-react"

const mobileItems = [
 { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
 { name: "Map", href: "/map", icon: <Map className="h-5 w-5" /> },
 { name: "Problem GO", href: "/problem-go", icon: <MapPinned className="h-5 w-5" /> },
 { name: "Report", href: "/report", icon: <PlusCircle className="h-8 w-8" />, primary: true },
 { name: "Leaderboard", href: "/leaderboard", icon: <Trophy className="h-5 w-5" /> },
 { name: "Ranking", href: "/ranking", icon: <BarChart3 className="h-5 w-5" /> },
 { name: "Awards", href: "/awards", icon: <Medal className="h-5 w-5" /> },
 { name: "Profile", href: "/profile", icon: <User className="h-5 w-5" /> },
]

export function MobileNav({ className }: { className?: string }) {
 const pathname = usePathname()

 return (
 <div className={cn("md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/20 pb-safe", className)}>
 <div className="flex items-center justify-start overflow-x-auto gap-2 h-16 px-2 scrollbar-hide">
 {mobileItems.map((item) => {
 const isActive = pathname.startsWith(item.href)
 
 if (item.primary) {
 return (
 <Link
 key={item.href}
 href={item.href}
 className="relative -top-5 flex flex-col items-center justify-center h-14 w-14 rounded-full bg-primary text-foreground shadow-xl shadow-primary/30 border-4 border-white dark:border-black transform transition-transform active:scale-95"
 >
 {item.icon}
 </Link>
 )
 }

 return (
 <Link
 key={item.href}
 href={item.href}
 className={cn(
 "flex flex-col items-center justify-center min-w-[4.5rem] shrink-0 h-full space-y-1 transition-colors",
 isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
 )}
 >
 {item.icon}
 <span className="text-[10px] font-medium">{item.name}</span>
 </Link>
 )
 })}
 </div>
 </div>
 )
}
