"use client"

import * as React from "react"
import { Sidebar } from "@/components/navigation/sidebar"
import { Navbar } from "@/components/navigation/navbar"

export function AdminLayout({ children }: { children: React.ReactNode }) {
 return (
 <div className="relative min-h-screen bg-black/5 dark:bg-white/5">
 <Navbar />
 <Sidebar className="border-destructive/30" />
 <div className="md:pl-64 flex flex-col min-h-screen pt-16">
 <div className="w-full bg-destructive/10 text-destructive px-4 py-2 text-center text-sm font-semibold">
 Admin Mode Active
 </div>
 {children}
 </div>
 </div>
 )
}
