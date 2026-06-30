import * as React from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
 title?: string
 message?: string
 retry?: () => void
}

export function ErrorState({ 
 title = "Something went wrong", 
 message = "An error occurred while loading this content.", 
 retry 
}: ErrorStateProps) {
 return (
 <div className="flex flex-col items-center justify-center p-8 text-center glass rounded-2xl w-full h-full min-h-[300px]">
 <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
 <AlertCircle className="h-8 w-8 text-destructive" />
 </div>
 <h3 className="text-xl font-semibold mb-2">{title}</h3>
 <p className="text-muted-foreground mb-6 max-w-sm">{message}</p>
 
 {retry && (
 <Button variant="default" onClick={retry}>
 Try Again
 </Button>
 )}
 </div>
 )
}
