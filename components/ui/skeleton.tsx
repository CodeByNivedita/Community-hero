import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({
 className,
 ...props
}: React.HTMLAttributes<HTMLDivElement>) {
 return (
 <div
 className={cn("animate-pulse rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur-md", className)}
 {...props}
 />
 )
}

export { Skeleton }
