"use client"

import * as React from "react"
import { getLeaderboard, LeaderboardEntry, Timeframe } from "@/services/leaderboard.service"
import { useAuthContext } from "@/contexts/AuthContext"
import { Podium } from "./Podium"
import { LeaderboardList } from "./LeaderboardList"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function LeaderboardDashboard() {
  const { user } = useAuthContext()
  const [timeframe, setTimeframe] = React.useState<Timeframe>("all-time")
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await getLeaderboard(timeframe)
      setLeaderboard(data)
      setLoading(false)
    }
    loadData()
  }, [timeframe])

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="flex flex-col space-y-8">
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-2 md:p-4 rounded-2xl md:rounded-full border shadow-sm z-20 relative">
        <div className="flex gap-2 w-full md:w-auto p-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
          {(['weekly', 'monthly', 'all-time'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                timeframe === tf 
                  ? "bg-white dark:bg-zinc-700 shadow-md text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf.replace("-", " ")}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input 
            type="text" 
            placeholder="Search heroes..." 
            className="pl-10 rounded-full bg-zinc-50 dark:bg-zinc-800 border-none focus-visible:ring-primary shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Podium (only show if not searching or if search matches top 3) */}
          {(!searchQuery || top3.some(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))) && top3.length > 0 && (
            <Podium topUsers={top3} currentUserId={user?.uid} />
          )}

          {/* List */}
          <div className="max-w-3xl mx-auto w-full">
            <LeaderboardList 
              users={rest} 
              currentUserId={user?.uid} 
              searchQuery={searchQuery}
            />
          </div>
        </>
      )}

    </div>
  )
}
