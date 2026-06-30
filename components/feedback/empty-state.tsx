import * as React from "react"
import { SearchX } from "lucide-react"

interface EmptyStateProps {
 title?: string
 description?: string
 icon?: React.ReactNode
 action?: React.ReactNode
}

export function EmptyState({ 
 title = "No results found", 
 description = "We couldn't find anything matching your criteria.", 
 icon = <SearchX className="h-10 w-10 text-muted-foreground/50" />,
 action
}: EmptyStateProps) {
 return (
 <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/20 dark:border-white/10 rounded-3xl bg-white/5 dark:bg-black/5 min-h-[300px]">
 <div className="mb-4 p-4 rounded-full glass">
 {icon}
 </div>
 <h3 className="text-xl font-semibold mb-2">{title}</h3>
 <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
 {action && <div>{action}</div>}
 </div>
 )
}
