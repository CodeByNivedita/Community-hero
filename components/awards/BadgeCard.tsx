"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { EvaluatedBadge } from "@/services/award.service"
import { Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BadgeCardProps {
  badge: EvaluatedBadge
  delay?: number
}

export function BadgeCard({ badge, delay = 0 }: BadgeCardProps) {
  const isUnlocked = badge.isUnlocked
  const progressPercent = Math.min((badge.progress / badge.target) * 100, 100)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="h-full"
    >
      <Card className={`h-full overflow-hidden border-none transition-all duration-300 ${
        isUnlocked 
          ? "bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-zinc-900 shadow-[0_4px_20px_rgba(251,191,36,0.15)] hover:shadow-[0_8px_30px_rgba(251,191,36,0.25)]" 
          : "bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md opacity-80 hover:opacity-100"
      }`}>
        <CardContent className="p-6 flex flex-col h-full items-center text-center relative">
          
          {/* Top Status Badge */}
          <div className="absolute top-4 right-4">
            {isUnlocked ? (
              <Badge variant="success" className="bg-amber-500 hover:bg-amber-600 border-none shadow-sm">Unlocked</Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-200/50 text-gray-500 backdrop-blur-sm"><Lock className="w-3 h-3 mr-1"/> Locked</Badge>
            )}
          </div>

          {/* Icon Area */}
          <div className="relative mt-4 mb-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-inner ${
              isUnlocked ? "bg-gradient-to-tr from-amber-300 to-yellow-100 dark:from-amber-700 dark:to-yellow-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" : "bg-gray-100 dark:bg-zinc-800 grayscale"
            }`}>
              <span className={isUnlocked ? "" : "opacity-40"}>{badge.iconUrl}</span>
            </div>
            
            {/* Sparkles if unlocked */}
            {isUnlocked && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/50"
              />
            )}
          </div>

          {/* Details */}
          <h3 className={`text-lg font-bold mb-2 ${isUnlocked ? "text-amber-900 dark:text-amber-400" : "text-muted-foreground"}`}>
            {badge.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 flex-grow">{badge.description}</p>

          {/* Bottom Area: Progress or Date */}
          <div className="w-full mt-auto">
            {isUnlocked ? (
              <div className="text-xs font-semibold text-amber-700/80 dark:text-amber-500/80 uppercase tracking-wider bg-amber-200/30 dark:bg-amber-900/30 py-2 rounded-lg">
                Earned {badge.earnedAt ? new Date((badge.earnedAt as any).toDate ? (badge.earnedAt as any).toDate() : ((badge.earnedAt as any).seconds ? (badge.earnedAt as any).seconds * 1000 : badge.earnedAt as any)).toLocaleDateString() : 'Recently'}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.floor(badge.progress)} / {badge.target}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ delay: delay + 0.2, duration: 1 }}
                    className="h-full bg-gray-400 dark:bg-gray-600 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
          
        </CardContent>
      </Card>
    </motion.div>
  )
}
