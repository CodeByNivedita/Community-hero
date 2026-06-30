import { useState, useEffect } from "react"
import { IssueReport } from "@/types/issue"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase/config"

export interface IssueFilters {
  category?: string
  severity?: string
  status?: string
  userId?: string // useful for dashboard fetching
}

export function useIssues(filters?: IssueFilters) {
  const [issues, setIssues] = useState<IssueReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!db) {
      setLoading(false)
      return
    }

    setLoading(true)
    
    // Start with base collection
    let q = query(collection(db, "reports"))

    if (filters?.userId) {
      q = query(collection(db, "reports"), where("userId", "==", filters.userId))
    }

    // Set up the real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let liveIssues: IssueReport[] = []
      
      snapshot.forEach(doc => {
        const data = doc.data()
        
        // Convert Firestore Timestamps to JS Dates to prevent rendering crashes
        const issue = { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
        } as IssueReport

        liveIssues.push(issue)
      })

      // Client-side filtering (so we don't have to build complex composite indexes in Firestore immediately for every combination)
      if (filters) {
        if (filters.category && filters.category !== "All") {
          liveIssues = liveIssues.filter(i => i.category === filters.category)
        }
        if (filters.severity && filters.severity !== "All") {
          liveIssues = liveIssues.filter(i => i.severity === filters.severity)
        }
        if (filters.status && filters.status !== "All") {
          liveIssues = liveIssues.filter(i => i.status === filters.status)
        }
        if (filters.userId) {
          liveIssues = liveIssues.filter(i => i.userId === filters.userId)
        }
      }

      // Sort by newest first
      liveIssues.sort((a, b) => {
        const timeA = a.createdAt?.getTime() || 0;
        const timeB = b.createdAt?.getTime() || 0;
        return timeB - timeA;
      });

      setIssues(liveIssues)
      setLoading(false)
    }, (error) => {
      console.error("Firestore onSnapshot error:", error)
      setLoading(false)
      setIssues([])
    })

    return () => unsubscribe()
  }, [filters?.category, filters?.severity, filters?.status, filters?.userId])

  return { issues, loading }
}
