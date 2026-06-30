"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Trophy } from "lucide-react"

interface BadgeGridProps {
 badges: string[]
}

const ALL_BADGES = [
 "First Verification 🕵️",
 "Pothole Patrol 🕳️",
 "Graffiti Guru 🎨",
 "Night Owl 🦉",
 "Neighborhood Watch 👁️",
 "Eco Warrior 🌳",
 "Speed Demon ⚡",
 "Trusted Citizen 🤝"
]

export function BadgeGrid({ badges }: BadgeGridProps) {
 return (
 <div className="glass p-6 rounded-3xl border border-white/10">
 <div className="flex items-center gap-2 mb-6">
 <Trophy className="h-5 w-5 text-orange-400" />
 <h3 className="font-bold text-foreground text-lg">Hero Badges</h3>
 </div>
 
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {ALL_BADGES.map((badgeName, idx) => {
 const isUnlocked = badges.includes(badgeName)
 
 return (
 <motion.div
 key={idx}
 whileHover={isUnlocked ? { scale: 1.05 } : {}}
 className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center h-32 transition-all ${
 isUnlocked 
 ? "bg-gradient-to-b from-orange-500/10 to-transparent border-orange-500/30" 
 : "bg-black/20 border-white/5 opacity-50 grayscale"
 }`}
 >
 <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${
 isUnlocked ? "bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "bg-white/5"
 }`}>
 <Trophy className={`h-6 w-6 ${isUnlocked ? "text-orange-400" : "text-muted-foreground"}`} />
 </div>
 <span className={`text-xs font-bold leading-tight ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
 {badgeName.replace(/[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')}
 </span>
 </motion.div>
 )
 })}
 </div>
 </div>
 )
}
