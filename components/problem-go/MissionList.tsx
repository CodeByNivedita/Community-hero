"use client"

import * as React from "react"
import { IssueReport } from "@/types/issue"
import { MissionCard } from "./MissionCard"
import { Search, Map } from "lucide-react"
import { motion } from "framer-motion"

interface MissionListProps {
 missions: IssueReport[]
 userLocation: google.maps.LatLngLiteral | null
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
 const R = 6371e3 // metres
 const φ1 = lat1 * Math.PI/180
 const φ2 = lat2 * Math.PI/180
 const Δφ = (lat2-lat1) * Math.PI/180
 const Δλ = (lon2-lon1) * Math.PI/180

 const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
 Math.cos(φ1) * Math.cos(φ2) *
 Math.sin(Δλ/2) * Math.sin(Δλ/2)
 const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

 return R * c
}

const MAX_DISCOVERY_RADIUS = 1000; // meters

export function MissionList({ missions, userLocation }: MissionListProps) {
 // Sort missions by distance if user location is known
 const sortedMissions = React.useMemo(() => {
 if (!userLocation) return missions
 
 return [...missions].map(m => ({
 ...m,
 _distance: calculateDistance(userLocation.lat, userLocation.lng, m.location.lat, m.location.lng)
 })).filter(m => m._distance <= MAX_DISCOVERY_RADIUS).sort((a, b) => a._distance - b._distance)
 }, [missions, userLocation])

 if (!userLocation) {
 return (
 <div className="flex flex-col items-center justify-center p-8 text-center bg-white shadow-md border border-gray-200 rounded-3xl">
 <Map className="h-12 w-12 text-primary mb-4 animate-pulse" />
 <h3 className="text-xl font-bold text-gray-900 mb-2">Locating you...</h3>
 <p className="text-gray-700 text-sm">We need your GPS location to find nearby missions.</p>
 </div>
 )
 }

 if (sortedMissions.length === 0) {
 return (
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="flex flex-col items-center justify-center p-12 text-center bg-white shadow-md border border-gray-200 rounded-3xl"
 >
 <Search className="h-12 w-12 text-gray-500 mb-4" />
 <h3 className="text-xl font-bold text-gray-900 mb-2">No nearby missions available</h3>
 <p className="text-gray-700 text-sm max-w-[250px]">Your area is looking great! Check back later for new civic verification missions.</p>
 </motion.div>
 )
 }

 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between px-2">
 <h2 className="text-lg font-bold text-gray-900">Nearby Missions ({sortedMissions.length})</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {sortedMissions.map((mission: any) => (
 <MissionCard 
 key={mission.id} 
 mission={mission} 
 distance={mission._distance || 0}
 />
 ))}
 </div>
 </div>
 )
}
