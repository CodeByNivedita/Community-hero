"use server"

import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, getCountFromServer, orderBy } from "firebase/firestore"

export interface RankingStats {
  weeklyXp: number;
  monthlyXp: number;
  currentRank: number;
}

export async function getUserRankingStats(userId: string, currentXp: number): Promise<RankingStats> {
  let weeklyXp = 0;
  let monthlyXp = 0;
  let currentRank = 1;

  try {
    // Calculate Rank
    // How many users have strictly more XP than current user?
    const usersRef = collection(db, "users");
    const higherXpQuery = query(usersRef, where("xp", ">", currentXp));
    const higherXpSnap = await getCountFromServer(higherXpQuery);
    currentRank = higherXpSnap.data().count + 1; // +1 because if 0 people have more XP, you are rank 1

    // Calculate Weekly & Monthly XP
    // We will query verifications and reports for this user in the last 7 and 30 days
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const verificationsRef = collection(db, "verifications");
    const userVerificationsQuery = query(
      verificationsRef, 
      where("userId", "==", userId)
    );
    
    // Note: Due to composite index requirements, we might just fetch all for the user and filter locally 
    // if the user doesn't have thousands of records. It's safer for a hackathon without pre-building indexes.
    const verifSnap = await getDocs(userVerificationsQuery);
    
    verifSnap.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      
      // We estimate 25 XP per verification if it's not strictly stored per document in a ledger
      const xpEarned = 25; 

      if (createdAt >= thirtyDaysAgo) {
        monthlyXp += xpEarned;
        if (createdAt >= sevenDaysAgo) {
          weeklyXp += xpEarned;
        }
      }
    });

    // Also check Reports
    const reportsRef = collection(db, "reports");
    const userReportsQuery = query(
      reportsRef,
      where("userId", "==", userId)
    );
    
    const reportsSnap = await getDocs(userReportsQuery);
    reportsSnap.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      
      // Estimate 10 XP per report
      const xpEarned = 10; 

      if (createdAt >= thirtyDaysAgo) {
        monthlyXp += xpEarned;
        if (createdAt >= sevenDaysAgo) {
          weeklyXp += xpEarned;
        }
      }
    });

  } catch (error) {
    console.error("Error fetching ranking stats:", error);
  }

  return {
    weeklyXp,
    monthlyXp,
    currentRank
  };
}
