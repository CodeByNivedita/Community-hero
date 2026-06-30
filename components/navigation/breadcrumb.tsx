import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BreadcrumbProps {
 items: {
 label: string
 href?: string
 }[]
 className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
 return (
 <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-muted-foreground", className)}>
 <ol className="flex items-center space-x-2">
 <li>
 <Link href="/dashboard" className="hover:text-foreground transition-colors">
 <Home className="h-4 w-4" />
 <span className="sr-only">Home</span>
 </Link>
 </li>
 
 {items.map((item, index) => {
 const isLast = index === items.length - 1
 
 return (
 <li key={item.label} className="flex items-center space-x-2">
 <ChevronRight className="h-4 w-4" />
 {isLast || !item.href ? (
 <span className="text-foreground font-medium">{item.label}</span>
 ) : (
 <Link href={item.href} className="hover:text-foreground transition-colors">
 {item.label}
 </Link>
 )}
 </li>
 )
 })}
 </ol>
 </nav>
 )
}
