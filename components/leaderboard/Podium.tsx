"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { LeaderboardEntry } from "@/services/leaderboard.service"
import { Trophy, Medal, Award } from "lucide-react"

interface PodiumProps {
  topUsers: LeaderboardEntry[]
  currentUserId?: string
}

export function Podium({ topUsers, currentUserId }: PodiumProps) {
  // Ensure we have exactly 3 spots, even if empty
  const first = topUsers[0]
  const second = topUsers[1]
  const third = topUsers[2]

  const PodiumStep = ({ 
    user, 
    position, 
    heightClass, 
    colorClass, 
    Icon,
    delay
  }: { 
    user?: LeaderboardEntry, 
    position: number, 
    heightClass: string, 
    colorClass: string,
    Icon: any,
    delay: number
  }) => {
    const isCurrentUser = user?.uid === currentUserId

    return (
      <div className="flex flex-col items-center justify-end w-28 md:w-36 h-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay, duration: 0.6, type: "spring", bounce: 0.4 }}
          className="flex flex-col items-center w-full"
        >
          {user ? (
            <div className="flex flex-col items-center mb-4 text-center">
              <div className={`relative mb-3 ${isCurrentUser ? "ring-4 ring-primary ring-offset-4 ring-offset-background rounded-full" : ""}`}>
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 overflow-hidden bg-zinc-100 ${colorClass} shadow-lg`}>
                  <img 
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute -bottom-3 -right-2 w-8 h-8 rounded-full border-2 border-background flex items-center justify-center bg-white ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-bold text-sm md:text-base text-foreground truncate w-full px-2" title={user.name}>
                {user.name}
              </h3>
              <p className="text-xs md:text-sm font-black text-primary">{user.xp.toLocaleString()} XP</p>
            </div>
          ) : (
            <div className="flex flex-col items-center mb-4 text-center opacity-50">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-dashed border-zinc-300 bg-zinc-100 flex items-center justify-center mb-3">
                <span className="text-zinc-400 font-bold">?</span>
              </div>
              <h3 className="font-bold text-sm text-zinc-400">Unclaimed</h3>
            </div>
          )}

          <div className={`w-full ${heightClass} rounded-t-xl bg-gradient-to-t shadow-inner flex justify-center pt-4 relative overflow-hidden`}>
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-50 pointer-events-none" />
            <span className="text-3xl font-black text-white/90 drop-shadow-md relative z-10">{position}</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative flex justify-center items-end h-[350px] md:h-[400px] w-full max-w-3xl mx-auto px-4 mt-8 mb-16">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/10 blur-3xl rounded-full" />
      
      <div className="flex justify-center items-end gap-2 md:gap-4 w-full h-full">
        <PodiumStep 
          user={second} 
          position={2} 
          heightClass="h-32 md:h-40 from-zinc-300 to-zinc-400" 
          colorClass="border-zinc-300 text-zinc-600"
          Icon={Medal}
          delay={0.2}
        />
        <PodiumStep 
          user={first} 
          position={1} 
          heightClass="h-48 md:h-56 from-yellow-300 to-amber-500" 
          colorClass="border-amber-400 text-amber-600"
          Icon={Trophy}
          delay={0.4}
        />
        <PodiumStep 
          user={third} 
          position={3} 
          heightClass="h-24 md:h-32 from-orange-300 to-orange-400" 
          colorClass="border-orange-400 text-orange-700"
          Icon={Award}
          delay={0.1}
        />
      </div>
    </div>
  )
}
