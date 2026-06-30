"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Target } from "lucide-react"

interface AccuracyCardProps {
  reportsVerified: number
  fakeReports: number
  delay?: number
}

export function AccuracyCard({ reportsVerified, fakeReports, delay = 0 }: AccuracyCardProps) {
  const total = reportsVerified + fakeReports
  const accuracy = total > 0 ? Math.round((reportsVerified / total) * 100) : 100
  
  const circumference = 2 * Math.PI * 45 // r=45
  const strokeDashoffset = circumference - (accuracy / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
    >
      <Card className="h-full border-none shadow-lg bg-white/80 backdrop-blur-xl dark:bg-zinc-900/80 overflow-hidden">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full relative">
          
          <div className="absolute top-6 left-6 p-3 bg-primary/10 rounded-2xl">
            <Target className="w-6 h-6 text-primary" />
          </div>
          
          <h3 className="text-sm font-medium text-muted-foreground w-full text-right mb-4">Verification Accuracy</h3>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200 dark:text-gray-800"
              />
              {/* Progress Circle */}
              <motion.circle
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ delay: delay + 0.4, duration: 1.5, ease: "easeOut" }}
                cx="64"
                cy="64"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-foreground">{accuracy}%</span>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-6 w-full">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Valid</p>
              <p className="font-bold text-emerald-500">{reportsVerified}</p>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Fake</p>
              <p className="font-bold text-red-500">{fakeReports}</p>
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  )
}
