"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MapLegend() {
 return (
 <Card className="absolute bottom-6 right-6 w-48 shadow-2xl glass z-10 hidden sm:block">
 <CardHeader className="p-4 pb-2">
 <CardTitle className="text-sm font-semibold">Legend</CardTitle>
 </CardHeader>
 <CardContent className="p-4 pt-0 space-y-2">
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 rounded-full bg-accent shadow border border-white"></div>
 <span className="text-xs text-muted-foreground">High Severity</span>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 rounded-full bg-amber-500 shadow border border-white"></div>
 <span className="text-xs text-muted-foreground">Medium Severity</span>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 rounded-full bg-blue-500 shadow border border-white"></div>
 <span className="text-xs text-muted-foreground">Low Severity</span>
 </div>
 </CardContent>
 </Card>
 )
}
