"use server"

import { db } from "@/lib/firebase/config"
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from "firebase/firestore"
import { UserProfile } from "@/types/user"

export type Timeframe = 'all-time' | 'monthly' | 'weekly'

export interface LeaderboardEntry {
  rank: number
  uid: string
  name: string
  avatar?: string
  xp: number
  reportsSubmitted: number
  reportsVerified: number
  badgesCount: number
}

export async function getLeaderboard(timeframe: Timeframe, maxLimit: number = 100): Promise<LeaderboardEntry[]> {
  try {
    if (timeframe === 'all-time') {
      const usersRef = collection(db, "users")
      const q = query(usersRef, orderBy("xp", "desc"), limit(maxLimit))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map((doc, index) => {
        const data = doc.data() as UserProfile
        return {
          rank: index + 1,
          uid: data.uid,
          name: data.name || "Anonymous Hero",
          avatar: data.avatar,
          xp: data.xp || 0,
          reportsSubmitted: data.reportsSubmitted || 0,
          reportsVerified: data.reportsVerified || 0,
          badgesCount: data.badges?.length || 0
        }
      })
    } else {
      // Weekly or Monthly
      const now = new Date()
      const cutoffDate = new Date()
      if (timeframe === 'weekly') {
        cutoffDate.setDate(now.getDate() - 7)
      } else {
        cutoffDate.setDate(now.getDate() - 30)
      }

      const usersRef = collection(db, "users")
      const allUsersSnap = await getDocs(usersRef)
      const userMap = new Map<string, UserProfile>()
      allUsersSnap.forEach(doc => {
        userMap.set(doc.id, doc.data() as UserProfile)
      })

      const verificationsRef = collection(db, "verifications")
      const reportsRef = collection(db, "reports")

      const verifSnap = await getDocs(verificationsRef)
      const reportsSnap = await getDocs(reportsRef)

      const xpMap = new Map<string, number>()
      const reportsMap = new Map<string, number>()
      const verifiedMap = new Map<string, number>()

      verifSnap.forEach(doc => {
        const data = doc.data()
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        if (createdAt >= cutoffDate) {
          const uid = data.userId
          xpMap.set(uid, (xpMap.get(uid) || 0) + 25)
          verifiedMap.set(uid, (verifiedMap.get(uid) || 0) + 1)
        }
      })

      reportsSnap.forEach(doc => {
        const data = doc.data()
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        if (createdAt >= cutoffDate) {
          const uid = data.userId
          xpMap.set(uid, (xpMap.get(uid) || 0) + 10)
          reportsMap.set(uid, (reportsMap.get(uid) || 0) + 1)
        }
      })

      const entries: LeaderboardEntry[] = []
      
      xpMap.forEach((xp, uid) => {
        const user = userMap.get(uid)
        if (user) {
          entries.push({
            rank: 0,
            uid: uid,
            name: user.name || "Anonymous Hero",
            avatar: user.avatar,
            xp: xp,
            reportsSubmitted: reportsMap.get(uid) || 0,
            reportsVerified: verifiedMap.get(uid) || 0,
            badgesCount: user.badges?.length || 0
          })
        }
      })

      // Sort and assign ranks
      entries.sort((a, b) => b.xp - a.xp)
      
      const finalEntries = entries.slice(0, maxLimit).map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))

      return finalEntries
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return []
  }
}
