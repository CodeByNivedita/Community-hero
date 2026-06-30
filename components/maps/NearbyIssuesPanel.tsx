"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IssueReport } from "@/types/issue"
import { ChevronUp, ChevronDown, MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NearbyIssuesPanelProps {
 issues: IssueReport[]
 onIssueClick: (issue: IssueReport) => void
}

export function NearbyIssuesPanel({ issues, onIssueClick }: NearbyIssuesPanelProps) {
 const [isExpanded, setIsExpanded] = React.useState(true)

 return (
 <div className="absolute bottom-6 left-6 z-10 w-80 flex flex-col items-start hidden md:flex">
 <AnimatePresence>
 {isExpanded && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="w-full glass-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden mb-4 max-h-[60vh] flex flex-col"
 >
 <div className="p-4 border-b border-white/5 bg-black/20">
 <h3 className="font-bold text-foreground flex items-center gap-2">
 <MapPin className="h-4 w-4 text-primary" /> Nearby Issues ({issues.length})
 </h3>
 </div>
 
 <div className="overflow-y-auto scrollbar-hide flex-1 p-2 space-y-2">
 {issues.length === 0 ? (
 <div className="p-4 text-center text-muted-foreground text-sm">
 No issues found matching current filters in this area.
 </div>
 ) : (
 issues.map(issue => (
 <div 
 key={issue.id}
 onClick={() => onIssueClick(issue)}
 className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors"
 >
 <div className="flex justify-between items-start mb-1">
 <h4 className="font-semibold text-sm text-foreground truncate pr-2">{issue.title}</h4>
 <Badge variant={issue.severity === "Critical" ? "destructive" : "secondary"} className="text-[10px] shrink-0 h-4 px-1">
 {issue.severity.toUpperCase()}
 </Badge>
 </div>
 <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
 <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {issue.category}</span>
 <span className="flex items-center capitalize"><Clock className="h-3 w-3 mr-1" /> {issue.status.replace('_', ' ')}</span>
 </div>
 </div>
 ))
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 
 <button
 onClick={() => setIsExpanded(!isExpanded)}
 className="glass px-4 py-2 rounded-full border border-white/20 text-sm font-semibold text-foreground shadow-xl hover:bg-white/10 transition-colors flex items-center gap-2"
 >
 {isExpanded ? (
 <><ChevronDown className="h-4 w-4" /> Hide Nearby List</>
 ) : (
 <><ChevronUp className="h-4 w-4" /> Show Nearby ({issues.length})</>
 )}
 </button>
 </div>
 )
}
