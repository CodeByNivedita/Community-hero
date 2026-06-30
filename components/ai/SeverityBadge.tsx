import * as React from "react"
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from "lucide-react"
import { motion } from "framer-motion"

interface SeverityBadgeProps {
 severity: "Low" | "Medium" | "High" | "Critical"
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
 const config = {
 Low: { 
 colors: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
 icon: <Info className="h-4 w-4 mr-1" />
 },
 Medium: { 
 colors: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
 icon: <AlertCircle className="h-4 w-4 mr-1" />
 },
 High: { 
 colors: "bg-orange-500/20 text-orange-400 border-orange-500/50",
 icon: <AlertTriangle className="h-4 w-4 mr-1" />
 },
 Critical: { 
 colors: "bg-accent/20 text-accent border-accent/50 shadow-[0_0_15px_rgba(236,72,153,0.5)]",
 icon: <ShieldAlert className="h-4 w-4 mr-1" />
 }
 }

 const { colors, icon } = config[severity] || config.Medium

 return (
 <motion.div 
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-bold ${colors} ${severity === "Critical" ? "animate-pulse" : ""}`}
 >
 {icon}
 {severity.toUpperCase()}
 </motion.div>
 )
}
