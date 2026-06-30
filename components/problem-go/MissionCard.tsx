"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { IssueReport } from "@/types/issue"
import { MapPin, Navigation, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface MissionCardProps {
 mission: IssueReport
 distance: number
}

const VERIFICATION_RADIUS = 1000; // meters

export function MissionCard({ mission, distance }: MissionCardProps) {
 const router = useRouter()
 const isOutOfRange = distance > VERIFICATION_RADIUS
 const isHigh = mission.severity === "High" || mission.severity === "Critical"

 return (
 <motion.div
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 onClick={() => router.push(`/problem-go/${mission.id}`)}
 className={`bg-white p-4 rounded-[1.5rem] cursor-pointer border transition-all ${
 isHigh ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]" : "border-gray-200 shadow-md hover:shadow-lg"
 }`}
 >
 <div className="flex gap-4">
 <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-gray-50 border border-gray-200">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src={mission.imageUrl} alt={mission.title} className="w-full h-full object-cover" />
 {isHigh && (
 <div className="absolute top-1 right-1">
 <Badge variant="destructive" className="scale-75 origin-top-right px-1">URGENT</Badge>
 </div>
 )}
 </div>
 
 <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
 <div>
 <h4 className="font-bold text-gray-800 truncate">{mission.title}</h4>
 <div className="flex items-center text-xs text-gray-600 mt-1 space-x-3">
 <span className="flex items-center"><MapPin className="h-3 w-3 mr-1 text-gray-400" /> {mission.category}</span>
 <span className="flex items-center"><Clock className="h-3 w-3 mr-1 text-gray-400" /> {mission.createdAt ? new Date(mission.createdAt as any).toLocaleDateString() : 'Just now'}</span>
 </div>
 </div>
 
 <div className="flex items-center justify-between mt-2">
 <span className={`text-sm font-bold flex items-center ${isOutOfRange ? "text-red-600" : "text-green-600"}`}>
 <Navigation className="h-3 w-3 mr-1" />
 {distance < 1000 ? `${Math.round(distance)}m away` : `${(distance/1000).toFixed(1)}km away`}
 </span>
 <div className="flex items-center gap-1">
 <Badge variant="success" className="px-2 text-[10px]">+50 XP</Badge>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 )
}
