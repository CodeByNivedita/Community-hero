"use server"

import { db } from "@/lib/firebase/config"
import { doc, getDoc, updateDoc, collection, query, where, getDocs, Timestamp, arrayUnion } from "firebase/firestore"
import { UserProfile, UserBadge } from "@/types/user"

export interface EvaluatedBadge {
  id: string
  name: string
  description: string
  iconUrl: string
  isUnlocked: boolean
  progress: number
  target: number
  earnedAt: Timestamp | null
}

const BADGE_DEFINITIONS = [
  {
    id: "first_report",
    name: "First Report",
    description: "Submit your first civic issue report.",
    iconUrl: "🌟",
    target: 1,
    calculateProgress: (user: UserProfile) => user.reportsSubmitted || 0
  },
  {
    id: "elite_reporter",
    name: "Elite Reporter",
    description: "Submit 50 civic issue reports.",
    iconUrl: "👑",
    target: 50,
    calculateProgress: (user: UserProfile) => user.reportsSubmitted || 0
  },
  {
    id: "top_verifier",
    name: "Top Verifier",
    description: "Successfully verify 10 issues.",
    iconUrl: "🔍",
    target: 10,
    calculateProgress: (user: UserProfile) => user.reportsVerified || 0
  },
  {
    id: "city_guardian",
    name: "City Guardian",
    description: "Reach level 10 to guard your city.",
    iconUrl: "🛡️",
    target: 10,
    calculateProgress: (user: UserProfile) => user.level || 1
  },
  {
    id: "community_hero",
    name: "Community Hero",
    description: "Reach level 5 and show your dedication.",
    iconUrl: "🦸",
    target: 5,
    calculateProgress: (user: UserProfile) => user.level || 1
  },
  {
    id: "xp_100",
    name: "100 XP",
    description: "Earn your first 100 XP.",
    iconUrl: "✨",
    target: 100,
    calculateProgress: (user: UserProfile) => user.xp || 0
  },
  {
    id: "xp_500",
    name: "500 XP",
    description: "Earn 500 XP.",
    iconUrl: "🔥",
    target: 500,
    calculateProgress: (user: UserProfile) => user.xp || 0
  },
  {
    id: "xp_1000",
    name: "1000 XP",
    description: "Earn 1000 XP. You are unstoppable!",
    iconUrl: "⚡",
    target: 1000,
    calculateProgress: (user: UserProfile) => user.xp || 0
  },
  {
    id: "streak_7",
    name: "7 Day Streak",
    description: "Be active for 7 consecutive days.",
    iconUrl: "📅",
    target: 7,
    calculateProgress: (user: UserProfile, streak: number) => streak
  },
  {
    id: "streak_30",
    name: "30 Day Streak",
    description: "Be active for 30 consecutive days.",
    iconUrl: "🗓️",
    target: 30,
    calculateProgress: (user: UserProfile, streak: number) => streak
  }
]

async function calculateMaxStreak(userId: string): Promise<number> {
  const reportsQ = query(collection(db, "reports"), where("userId", "==", userId))
  const verificationsQ = query(collection(db, "verifications"), where("userId", "==", userId))

  const [reportsSnap, verificationsSnap] = await Promise.all([
    getDocs(reportsQ),
    getDocs(verificationsQ)
  ])

  const activityDates = new Set<string>()

  reportsSnap.forEach(doc => {
    const data = doc.data()
    const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
    activityDates.add(date.toISOString().split('T')[0])
  })

  verificationsSnap.forEach(doc => {
    const data = doc.data()
    const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
    activityDates.add(date.toISOString().split('T')[0])
  })

  const sortedDates = Array.from(activityDates).sort()
  
  if (sortedDates.length === 0) return 0

  let maxStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1])
    const currDate = new Date(sortedDates[i])
    const diffTime = Math.abs(currDate.getTime() - prevDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      currentStreak++
      if (currentStreak > maxStreak) maxStreak = currentStreak
    } else if (diffDays > 1) {
      currentStreak = 1
    }
  }

  return maxStreak
}

export async function syncUserBadges(userId: string): Promise<EvaluatedBadge[]> {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    throw new Error("User not found")
  }

  const userData = userSnap.data() as UserProfile
  const userBadges = userData.badges || []
  const streak = await calculateMaxStreak(userId)

  const newlyUnlocked: UserBadge[] = []
  const evaluatedBadges: EvaluatedBadge[] = []

  for (const def of BADGE_DEFINITIONS) {
    const progressVal = def.calculateProgress(userData, streak)
    const existingBadge = userBadges.find(b => b.id === def.id)
    
    if (existingBadge) {
      evaluatedBadges.push({
        ...def,
        isUnlocked: true,
        progress: def.target,
        earnedAt: existingBadge.earnedAt
      })
    } else {
      if (progressVal >= def.target) {
        // Unlock new badge
        const newBadge: UserBadge = {
          id: def.id,
          name: def.name,
          description: def.description,
          iconUrl: def.iconUrl,
          earnedAt: Timestamp.now()
        }
        newlyUnlocked.push(newBadge)
        evaluatedBadges.push({
          ...def,
          isUnlocked: true,
          progress: def.target,
          earnedAt: newBadge.earnedAt
        })
      } else {
        // Locked
        evaluatedBadges.push({
          ...def,
          isUnlocked: false,
          progress: progressVal,
          earnedAt: null
        })
      }
    }
  }

  if (newlyUnlocked.length > 0) {
    await updateDoc(userRef, {
      badges: arrayUnion(...newlyUnlocked)
    })
  }

  return evaluatedBadges
}
