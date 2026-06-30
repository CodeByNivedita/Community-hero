"use client"

import * as React from "react"
import { syncUserBadges, EvaluatedBadge } from "@/services/award.service"
import { useAuthContext } from "@/contexts/AuthContext"
import { BadgeCard } from "./BadgeCard"
import { Award, Lock } from "lucide-react"

export function AwardsDashboard() {
  const { user } = useAuthContext()
  const [badges, setBadges] = React.useState<EvaluatedBadge[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchBadges() {
      if (user) {
        setLoading(true)
        try {
          const evaluated = await syncUserBadges(user.uid)
          setBadges(evaluated)
        } catch (error) {
          console.error("Failed to fetch badges:", error)
        }
        setLoading(false)
      }
    }
    fetchBadges()
  }, [user])

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const unlockedBadges = badges.filter(b => b.isUnlocked)
  const lockedBadges = badges.filter(b => !b.isUnlocked)

  return (
    <div className="space-y-12">
      
      {/* Unlocked Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Award className="w-6 h-6 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Unlocked Achievements</h2>
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full ml-auto">
            {unlockedBadges.length} Earned
          </span>
        </div>
        
        {unlockedBadges.length === 0 ? (
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-8 text-center text-muted-foreground border border-dashed border-zinc-300 dark:border-zinc-800">
            You haven&apos;t unlocked any badges yet. Keep reporting and verifying issues!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {unlockedBadges.map((badge, idx) => (
              <BadgeCard key={badge.id} badge={badge} delay={idx * 0.1} />
            ))}
          </div>
        )}
      </div>

      <hr className="border-border" />

      {/* Locked Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-zinc-500/10 rounded-lg">
            <Lock className="w-6 h-6 text-zinc-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Locked Achievements</h2>
          <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-500 text-xs font-bold px-3 py-1 rounded-full ml-auto">
            {lockedBadges.length} To Go
          </span>
        </div>

        {lockedBadges.length === 0 ? (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-8 text-center text-emerald-600 border border-emerald-200 dark:border-emerald-800">
            🎉 Amazing! You have unlocked every single badge available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lockedBadges.map((badge, idx) => (
              <BadgeCard key={badge.id} badge={badge} delay={idx * 0.1} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
