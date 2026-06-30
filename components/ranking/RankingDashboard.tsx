"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { StatCard } from "./StatCard"
import { LevelProgressCard } from "./LevelProgressCard"
import { AccuracyCard } from "./AccuracyCard"
import { FileText, CheckCircle, Trophy, Activity, Calendar, Zap } from "lucide-react"
import { useAuthContext } from "@/contexts/AuthContext"
import { getUserRankingStats, RankingStats } from "@/services/ranking.service"

export function RankingDashboard() {
  const { profile, user } = useAuthContext()
  const [stats, setStats] = React.useState<RankingStats | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadStats() {
      if (user && profile) {
        setLoading(true)
        const rankingData = await getUserRankingStats(user.uid, profile.xp)
        setStats(rankingData)
        setLoading(false)
      }
    }
    loadStats()
  }, [user, profile])

  if (!profile || loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Row 1: Level Progress spanning 2 cols, Accuracy taking 1 col */}
        <LevelProgressCard 
          level={profile.level} 
          currentXp={profile.xp} 
          delay={0.1}
        />
        <AccuracyCard 
          reportsVerified={profile.reportsVerified} 
          fakeReports={profile.fakeReports}
          delay={0.2}
        />

        {/* Row 2: Stats */}
        <StatCard 
          title="Global Rank"
          value={`#${stats.currentRank}`}
          icon={Trophy}
          description="Your position in the city"
          trend="Top Tier"
          trendUp={stats.currentRank < 100}
          delay={0.3}
        />
        <StatCard 
          title="Reports Submitted"
          value={profile.reportsSubmitted}
          icon={FileText}
          description="Total civic issues reported"
          delay={0.4}
        />
        <StatCard 
          title="Successful Verifications"
          value={profile.reportsVerified}
          icon={CheckCircle}
          description="Issues you helped verify"
          delay={0.5}
        />

        {/* Row 3: XP Breakdown */}
        <StatCard 
          title="Total XP"
          value={profile.xp.toLocaleString()}
          icon={Zap}
          description="Lifetime experience points"
          delay={0.6}
        />
        <StatCard 
          title="Weekly XP"
          value={`+${stats.weeklyXp.toLocaleString()}`}
          icon={Activity}
          description="XP earned this week"
          trendUp={true}
          delay={0.7}
        />
        <StatCard 
          title="Monthly XP"
          value={`+${stats.monthlyXp.toLocaleString()}`}
          icon={Calendar}
          description="XP earned this month"
          trendUp={true}
          delay={0.8}
        />
      </div>
    </div>
  )
}
