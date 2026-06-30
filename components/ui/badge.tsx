import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow-sm hover:bg-primary/80",
        secondary: "bg-surface-secondary text-text-primary hover:bg-surface-secondary/80",
        destructive: "bg-danger text-white shadow-sm hover:bg-danger/80",
        success: "bg-success text-white shadow-sm hover:bg-success/80",
        warning: "bg-warning text-white shadow-sm hover:bg-warning/80",
        outline: "border border-border text-text-primary",
        glass: "glass text-text-primary",
        xp: "bg-warning text-white shadow-sm hover:bg-warning/80",
        trust: "bg-success text-white shadow-sm hover:bg-success/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
