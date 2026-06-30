"use client"

import * as React from "react"
import { AwardsDashboard } from "@/components/awards/AwardsDashboard"
import { useAuthContext } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function AwardsPage() {
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
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 mb-2">
            Awards & Badges
          </h1>
          <p className="text-muted-foreground text-lg">Your civic contributions officially recognized.</p>
        </div>

        <AwardsDashboard />

      </div>
    </main>
  )
}
