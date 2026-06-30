"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, X } from "lucide-react"
import { IssueFilters } from "@/hooks/useIssues"
import { Button } from "@/components/ui/button"

interface FilterSidebarProps {
 filters: IssueFilters
 onFilterChange: (filters: IssueFilters) => void
}

const CATEGORIES = ["All", "Pothole", "Garbage", "Water Leakage", "Broken Streetlight", "Sewage", "Fallen Tree", "Traffic Signal", "Vandalism"]
const SEVERITIES = ["All", "Critical", "High", "Medium", "Low"]
const STATUSES = ["All", "pending", "verified", "in_progress", "resolved"]

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
 const [isOpen, setIsOpen] = React.useState(false)

 return (
 <>
 {/* Floating Toggle Button */}
 <motion.button
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => setIsOpen(true)}
 className="absolute top-6 left-6 z-10 h-12 px-4 rounded-full glass bg-black/50 border border-white/20 flex items-center gap-2 text-foreground shadow-xl hover:bg-black/70 transition-colors"
 >
 <Filter className="h-5 w-5" /> 
 <span className="font-semibold text-sm">Filters</span>
 </motion.button>

 {/* Sidebar Overlay */}
 <AnimatePresence>
 {isOpen && (
 <>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setIsOpen(false)}
 className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
 />
 
 <motion.div
 initial={{ x: "-100%" }}
 animate={{ x: 0 }}
 exit={{ x: "-100%" }}
 transition={{ type: "spring", damping: 25, stiffness: 200 }}
 className="fixed top-0 left-0 bottom-0 w-80 glass-dark border-r border-white/10 z-50 p-6 flex flex-col"
 >
 <div className="flex items-center justify-between mb-8">
 <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
 <Filter className="h-5 w-5 text-primary" /> Map Filters
 </h2>
 <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
 <X className="h-5 w-5" />
 </button>
 </div>

 <div className="space-y-6 flex-1 overflow-y-auto scrollbar-hide pr-2">
 {/* Category Filter */}
 <div>
 <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Category</h3>
 <div className="flex flex-wrap gap-2">
 {CATEGORIES.map(c => (
 <BadgeToggle 
 key={c} 
 label={c} 
 isActive={(filters.category || "All") === c} 
 onClick={() => onFilterChange({ ...filters, category: c })}
 />
 ))}
 </div>
 </div>

 {/* Severity Filter */}
 <div>
 <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Severity</h3>
 <div className="flex flex-wrap gap-2">
 {SEVERITIES.map(s => (
 <BadgeToggle 
 key={s} 
 label={s} 
 isActive={(filters.severity || "All") === s} 
 onClick={() => onFilterChange({ ...filters, severity: s })}
 />
 ))}
 </div>
 </div>

 {/* Status Filter */}
 <div>
 <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Status</h3>
 <div className="flex flex-wrap gap-2">
 {STATUSES.map(s => (
 <BadgeToggle 
 key={s} 
 label={s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')} 
 isActive={(filters.status || "All") === s} 
 onClick={() => onFilterChange({ ...filters, status: s })}
 />
 ))}
 </div>
 </div>
 </div>

 <div className="pt-6 border-t border-white/10 mt-auto">
 <Button 
 onClick={() => {
 onFilterChange({ category: "All", severity: "All", status: "All" })
 }}
 variant="secondary"
 className="w-full rounded-full"
 >
 Reset All Filters
 </Button>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </>
 )
}

function BadgeToggle({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
 return (
 <button
 onClick={onClick}
 className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
 isActive 
 ? 'bg-primary border-primary text-foreground shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
 : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
 }`}
 >
 {label}
 </button>
 )
}
