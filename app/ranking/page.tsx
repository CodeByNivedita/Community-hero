"use client"

import * as React from "react"
import { RankingDashboard } from "@/components/ranking/RankingDashboard"
import { useAuthContext } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function RankingPage() {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-2">
            Your Ranking
          </h1>
          <p className="text-muted-foreground text-lg">Track your civic impact and rise through the ranks.</p>
        </div>

        <RankingDashboard />

      </div>
    </main>
  )
}
