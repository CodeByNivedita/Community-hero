"use client"

import * as React from "react"
import { LocateFixed } from "lucide-react"
import { motion } from "framer-motion"

interface UserLocationButtonProps {
 onLocate: () => void
 isDetecting: boolean
}

export function UserLocationButton({ onLocate, isDetecting }: UserLocationButtonProps) {
 return (
 <motion.button
 whileHover={{ scale: 1.1 }}
 whileTap={{ scale: 0.9 }}
 onClick={onLocate}
 disabled={isDetecting}
 className="absolute bottom-24 right-6 z-10 w-12 h-12 rounded-full glass bg-black/50 border border-white/20 flex items-center justify-center text-foreground shadow-xl hover:bg-black/70 transition-colors"
 title="My Location"
 >
 <LocateFixed className={`h-6 w-6 ${isDetecting ? "animate-spin text-primary" : ""}`} />
 </motion.button>
 )
}
