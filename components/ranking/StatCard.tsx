"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: string
  trendUp?: boolean
  delay?: number
}

export function StatCard({ title, value, icon: Icon, description, trend, trendUp, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <Card className="overflow-hidden border-none shadow-lg bg-white/80 backdrop-blur-xl dark:bg-zinc-900/80">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            {trend && (
              <span className={`text-sm font-bold ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                {trend}
              </span>
            )}
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-3xl font-black mt-1 text-foreground">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
