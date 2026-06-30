"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IssueReport } from "@/types/issue"
import { MissionList } from "@/components/problem-go/MissionList"
import { fetchUnresolvedIssues } from "@/services/problemGo.service"

export default function ProblemGoPage() {
 const [issues, setIssues] = React.useState<IssueReport[]>([])
 const [userLocation, setUserLocation] = React.useState<google.maps.LatLngLiteral | null>(null)
 const [loading, setLoading] = React.useState(true)

 // 1. Get Live GPS Location
 React.useEffect(() => {
   if (navigator.geolocation) {
     const watchId = navigator.geolocation.watchPosition(
       (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
       (err) => console.error("GPS error:", err),
       { enableHighAccuracy: true }
     )
     return () => navigator.geolocation.clearWatch(watchId)
   }
 }, [])

 // 2. Fetch Live Firebase Issues
 React.useEffect(() => {
   const loadIssues = async () => {
     setLoading(true);
     const data = await fetchUnresolvedIssues();
     setIssues(data);
     setLoading(false);
   };
   loadIssues();
 }, [])

 return (
   <main className="min-h-screen bg-background pb-24 pt-8">
     <div className="max-w-7xl mx-auto px-4 md:px-8">
       <div className="mb-12">
         <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-accent mb-2">
           Problem GO
         </h1>
         <p className="text-muted-foreground text-lg">Verify nearby issues. Earn XP. Become a hero.</p>
       </div>

       <div className="relative min-h-[500px]">
         <AnimatePresence mode="wait">
           {loading ? (
             <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center items-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
             </motion.div>
           ) : (
             <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <MissionList 
                 missions={issues} 
                 userLocation={userLocation} 
               />
             </motion.div>
           )}
         </AnimatePresence>
       </div>
     </div>
   </main>
 )
}
