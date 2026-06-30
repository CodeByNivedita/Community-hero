"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Star, Shield, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RewardPayload } from "@/services/rewards.service"

interface RewardPopupProps {
 reward: RewardPayload
 onClose: () => void
}

export function RewardPopup({ reward, onClose }: RewardPopupProps) {
 // Simulate a delay before showing badges for dramatic effect
 const [showBadges, setShowBadges] = React.useState(false)

 React.useEffect(() => {
 if (reward.badgesUnlocked.length > 0) {
 const timer = setTimeout(() => setShowBadges(true), 1500)
 return () => clearTimeout(timer)
 }
 }, [reward])

 return (
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.9 }}
 className="glass-dark p-10 rounded-[3rem] border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)] text-center relative overflow-hidden"
 >
 {/* Confetti simulation using CSS gradients */}
 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />
 
 <div className="relative z-10">
 <motion.div
 initial={{ y: 50, scale: 0 }}
 animate={{ y: 0, scale: 1 }}
 transition={{ type: "spring", bounce: 0.5 }}
 className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 mb-6"
 >
 <PartyPopper className="h-12 w-12 text-foreground" />
 </motion.div>

 <h2 className="text-4xl font-black text-foreground mb-2">Mission Accomplished!</h2>
 <p className="text-emerald-400 font-semibold text-lg mb-8">Civic duty fulfilled.</p>

 <div className="grid grid-cols-2 gap-4 mb-8">
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.5 }}
 className="glass p-4 rounded-2xl border border-white/10 flex flex-col items-center"
 >
 <Star className="h-8 w-8 text-yellow-400 mb-2" />
 <span className="text-3xl font-black text-foreground">+{reward.xpAwarded}</span>
 <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">XP Earned</span>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.7 }}
 className="glass p-4 rounded-2xl border border-white/10 flex flex-col items-center"
 >
 <Shield className="h-8 w-8 text-blue-400 mb-2" />
 <span className="text-3xl font-black text-foreground">+{reward.trustScoreDelta}</span>
 <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Trust Score</span>
 </motion.div>
 </div>

 <AnimatePresence>
 {showBadges && reward.badgesUnlocked.map((badge, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 20, scale: 0.8 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 className="bg-gradient-to-r from-orange-500/20 to-accent/20 border border-orange-500/30 p-4 rounded-2xl flex items-center gap-4 mb-8"
 >
 <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-400/50">
 <Trophy className="h-6 w-6 text-orange-400" />
 </div>
 <div className="text-left">
 <p className="text-xs text-orange-400/80 font-bold uppercase tracking-wider mb-1">New Badge Unlocked!</p>
 <p className="text-lg font-bold text-foreground">{badge}</p>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>

 <Button 
 size="lg"
 onClick={onClose}
 className="w-full rounded-full h-14 bg-white/10 hover:bg-white/20 text-foreground border border-white/20"
 >
 Return to Map
 </Button>
 </div>
 </motion.div>
 )
}
