"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LeaderboardEntry } from "@/services/leaderboard.service"
import { FileText, CheckCircle, Award } from "lucide-react"

interface LeaderboardListProps {
  users: LeaderboardEntry[]
  currentUserId?: string
  searchQuery: string
}

export function LeaderboardList({ users, currentUserId, searchQuery }: LeaderboardListProps) {
  
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return users;
    const lowerQuery = searchQuery.toLowerCase();
    return users.filter(u => u.name.toLowerCase().includes(lowerQuery));
  }, [users, searchQuery]);

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-2xl">
        No users found matching "{searchQuery}"
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence>
        {filteredUsers.map((user, index) => {
          const isCurrentUser = user.uid === currentUserId
          
          return (
            <motion.div
              key={user.uid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                isCurrentUser 
                  ? "bg-primary/5 border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.15)]" 
                  : "bg-card border-border hover:border-primary/30 hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-center w-10 text-xl font-black text-muted-foreground">
                #{user.rank}
              </div>
              
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-200 bg-zinc-100 flex-shrink-0">
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`font-bold truncate ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                    {user.name}
                  </h4>
                  {isCurrentUser && (
                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      You
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1" title="Reports Submitted">
                    <FileText className="w-3 h-3" /> {user.reportsSubmitted}
                  </span>
                  <span className="flex items-center gap-1" title="Successful Verifications">
                    <CheckCircle className="w-3 h-3" /> {user.reportsVerified}
                  </span>
                  <span className="flex items-center gap-1" title="Badges Earned">
                    <Award className="w-3 h-3" /> {user.badgesCount}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0 pl-2">
                <span className="text-lg font-black text-foreground">{user.xp.toLocaleString()}</span>
                <span className="text-xs text-primary font-bold ml-1">XP</span>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
