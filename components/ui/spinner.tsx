import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
 size?: "sm" | "default" | "lg"
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
 ({ className, size = "default", ...props }, ref) => {
 const sizeClasses = {
 sm: "h-4 w-4",
 default: "h-6 w-6",
 lg: "h-10 w-10",
 }
 
 return (
 <Loader2
 ref={ref}
 className={cn("animate-spin text-primary", sizeClasses[size], className)}
 {...props}
 />
 )
 }
)
Spinner.displayName = "Spinner"

export { Spinner }
