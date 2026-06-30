"use server"

// Mock Firebase Gamification Service
// In a full production build, this would use 'firebase-admin' to securely run transactions.
// For the scope of this hackathon, we will mock the server-side updates and return the awarded amounts.

export interface RewardPayload {
  xpAwarded: number
  trustScoreDelta: number
  badgesUnlocked: string[]
}

export async function processGamificationRewards(
  userId: string, 
  verificationState: string,
  confidence: number
): Promise<RewardPayload> {
  // Simulate DB latency
  await new Promise(resolve => setTimeout(resolve, 800))

  let xpAwarded = 0
  let trustScoreDelta = 0
  const badgesUnlocked: string[] = []

  if (verificationState === "Fake Report") {
    // We log it but do not penalize heavily yet per PRD constraints.
    // A manual review queue would handle trust score deduction later.
    trustScoreDelta = -1 
  } else if (confidence > 80) {
    // Valid verification
    xpAwarded = 50
    trustScoreDelta = 5
    
    // Randomly award a badge for demo purposes
    if (Math.random() > 0.7) {
      badgesUnlocked.push("First Verification 🕵️")
    }
  } else {
    // Low confidence, still award some participation XP but no trust score
    xpAwarded = 10
  }

  // NOTE: Here you would normally run a Firestore transaction:
  // const userRef = admin.firestore().collection('users').doc(userId)
  // await userRef.update({ xp: admin.firestore.FieldValue.increment(xpAwarded) })

  return { xpAwarded, trustScoreDelta, badgesUnlocked }
}
