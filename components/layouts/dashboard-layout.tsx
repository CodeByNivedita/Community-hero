"use client"

import * as React from "react"
import { Sidebar } from "@/components/navigation/sidebar"
import { Navbar } from "@/components/navigation/navbar"
import { MobileNav } from "@/components/navigation/mobile-nav"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
 return (
 <div className="relative min-h-screen">
 <Navbar />
 <Sidebar />
 <div className="md:pl-64 flex flex-col min-h-screen pb-20 md:pb-0 pt-16">
 {children}
 </div>
 <MobileNav />
 </div>
 )
}
