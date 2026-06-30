"use client"

import * as React from "react"
import { motion } from "framer-motion"

interface ConfidenceIndicatorProps {
 score: number // 0 to 100
}

export function ConfidenceIndicator({ score }: ConfidenceIndicatorProps) {
 // Determine color based on score
 const getColor = (s: number) => {
 if (s >= 90) return "text-emerald-400"
 if (s >= 70) return "text-yellow-400"
 return "text-accent"
 }
 
 const colorClass = getColor(score)

 return (
 <div className="flex flex-col items-center justify-center p-4 glass-dark rounded-2xl border border-white/10 relative overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-t from-foreground to-transparent pointer-events-none" />
 
 <div className="relative w-16 h-16 flex items-center justify-center mb-2">
 <svg className="w-full h-full transform -rotate-90">
 <circle
 cx="32"
 cy="32"
 r="28"
 className="stroke-white/10 fill-none"
 strokeWidth="6"
 />
 <motion.circle
 cx="32"
 cy="32"
 r="28"
 className={`${colorClass.replace('text-', 'stroke-')} fill-none`}
 strokeWidth="6"
 strokeDasharray={175.93} // 2 * pi * 28
 initial={{ strokeDashoffset: 175.93 }}
 animate={{ strokeDashoffset: 175.93 - (175.93 * score) / 100 }}
 transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
 strokeLinecap="round"
 />
 </svg>
 <div className="absolute inset-0 flex items-center justify-center">
 <span className={`text-lg font-black ${colorClass}`}>{score}%</span>
 </div>
 </div>
 <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Confidence</span>
 </div>
 )
}
