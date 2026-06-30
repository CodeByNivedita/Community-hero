"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Star } from "lucide-react"

interface LevelProgressCardProps {
  level: number
  currentXp: number
  delay?: number
}

export function LevelProgressCard({ level, currentXp, delay = 0 }: LevelProgressCardProps) {
  // Simple progression logic: Next level needs (level * 1000) XP. 
  // Adjust this formula to match your actual game logic if different.
  const nextLevelXp = level * 1000
  const progressPercent = Math.min((currentXp / nextLevelXp) * 100, 100)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="col-span-full lg:col-span-2"
    >
      <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary via-secondary to-accent text-white">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-20">
          <Trophy className="w-64 h-64" />
        </div>
        
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                  <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80 uppercase tracking-wider">Current Level</p>
                  <h2 className="text-4xl font-black text-white">Level {level}</h2>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-white/90">{currentXp.toLocaleString()} XP</span>
                  <span className="text-white/60">{nextLevelXp.toLocaleString()} XP to Level {level + 1}</span>
                </div>
                
                <div className="h-4 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ delay: delay + 0.3, duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full shadow-[0_0_10px_rgba(253,224,71,0.5)]"
                  />
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
