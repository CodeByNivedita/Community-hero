import * as React from "react"
import { Building2 } from "lucide-react"
import { motion } from "framer-motion"

interface DepartmentCardProps {
 department: string
}

export function DepartmentCard({ department }: DepartmentCardProps) {
 return (
 <motion.div 
 initial={{ y: 10, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 className="glass p-4 rounded-2xl flex items-center gap-4 border-l-4 border-l-blue-500"
 >
 <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
 <Building2 className="h-5 w-5 text-blue-400" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Routed To</p>
 <p className="text-sm font-bold text-foreground">{department}</p>
 </div>
 </motion.div>
 )
}
