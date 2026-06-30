import * as React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
 children: React.ReactNode
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
 return (
 <main 
 className={cn(
 "flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 md:mt-0", 
 className
 )} 
 {...props}
 >
 {children}
 </main>
 )
}
