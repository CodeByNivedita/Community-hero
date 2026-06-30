"use client"

import * as React from "react"
import { Locate, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MapControls() {
 return (
 <div className="absolute right-6 top-6 flex flex-col gap-2 z-10">
 <div className="glass rounded-xl overflow-hidden flex flex-col shadow-xl">
 <Button variant="ghost" size="icon" className="rounded-none border-b border-white/10 h-10 w-10">
 <Plus className="h-4 w-4" />
 </Button>
 <Button variant="ghost" size="icon" className="rounded-none h-10 w-10">
 <Minus className="h-4 w-4" />
 </Button>
 </div>
 <Button variant="icon" className="shadow-xl bg-white/50 dark:bg-black/50 backdrop-blur-xl mt-2 h-10 w-10">
 <Locate className="h-4 w-4 text-primary" />
 </Button>
 </div>
 )
}
