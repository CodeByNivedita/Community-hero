"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, X } from "lucide-react"
import { CATEGORY_ICONS } from "./IssueMarker"

export function MapLegend() {
 const [isOpen, setIsOpen] = React.useState(false)

 return (
 <div className="absolute bottom-6 right-6 z-10">
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 20 }}
 className="mb-4 glass-dark p-4 rounded-2xl border border-white/20 shadow-2xl w-48"
 >
 <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
 <span className="font-bold text-sm text-foreground">Map Legend</span>
 <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
 <X className="h-4 w-4" />
 </button>
 </div>
 <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide pr-1">
 {Object.entries(CATEGORY_ICONS).map(([category, config]) => (
 <div key={category} className="flex items-center gap-3 text-sm text-muted-foreground">
 <div 
 className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20" 
 style={{ backgroundColor: config.color }} 
 />
 <span className="truncate">{category}</span>
 </div>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {!isOpen && (
 <motion.button
 whileHover={{ scale: 1.1 }}
 whileTap={{ scale: 0.9 }}
 onClick={() => setIsOpen(true)}
 className="w-12 h-12 rounded-full glass bg-black/50 border border-white/20 flex items-center justify-center text-foreground shadow-xl hover:bg-black/70 transition-colors ml-auto"
 >
 <HelpCircle className="h-6 w-6" />
 </motion.button>
 )}
 </div>
 )
}
