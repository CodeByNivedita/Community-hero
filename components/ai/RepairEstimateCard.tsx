import * as React from "react"
import { Clock } from "lucide-react"
import { motion } from "framer-motion"

interface RepairEstimateCardProps {
 repairTime: string
}

export function RepairEstimateCard({ repairTime }: RepairEstimateCardProps) {
 return (
 <motion.div 
 initial={{ y: 10, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 0.1 }}
 className="glass p-4 rounded-2xl flex items-center gap-4 border-l-4 border-l-purple-500"
 >
 <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
 <Clock className="h-5 w-5 text-primary" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Est. Repair</p>
 <p className="text-sm font-bold text-foreground">{repairTime}</p>
 </div>
 </motion.div>
 )
}
