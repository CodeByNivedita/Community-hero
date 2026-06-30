"use client"

import * as React from "react"
import { AIAnalysisResult } from "@/types/issue"
import { ConfidenceIndicator } from "./ConfidenceIndicator"
import { SeverityBadge } from "./SeverityBadge"
import { DepartmentCard } from "./DepartmentCard"
import { RepairEstimateCard } from "./RepairEstimateCard"
import { Sparkles, CopyPlus } from "lucide-react"

interface AIAnalysisCardProps {
 analysis: AIAnalysisResult
}

export function AIAnalysisCard({ analysis }: AIAnalysisCardProps) {
 return (
 <div className="glass-dark border border-emerald-500/30 p-6 md:p-8 rounded-[2rem] relative overflow-hidden shadow-2xl">
 {/* Background decoration */}
 <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
 <Sparkles className="w-48 h-48 text-emerald-500" />
 </div>

 <div className="relative z-10">
 <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
 <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
 <Sparkles className="h-5 w-5 text-emerald-400" />
 </div>
 <div>
 <h3 className="font-bold text-xl text-emerald-400">Gemini AI Analysis</h3>
 <p className="text-xs text-gray-300">Auto-filled data based on image recognition</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
 {/* Left Column: Metrics */}
 <div className="md:col-span-4 space-y-6 flex flex-col justify-between">
 <ConfidenceIndicator score={analysis.confidence} />
 <div className="flex flex-col gap-2">
 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Assessed Severity</span>
 <SeverityBadge severity={analysis.severity} />
 </div>
 </div>

 {/* Right Column: Routing & Details */}
 <div className="md:col-span-8 space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <DepartmentCard department={analysis.department} />
 <RepairEstimateCard repairTime={analysis.repairTime} />
 </div>

 {analysis.duplicateReportPossibility && (
 <div className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-start gap-3">
 <CopyPlus className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
 <div>
 <h4 className="text-sm font-bold text-orange-400">Possible Duplicate</h4>
 <p className="text-xs text-orange-200 mt-1">
 Gemini detected that this type of issue at this severity level is frequently reported in this area. It will be flagged for review to prevent redundant dispatch.
 </p>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 )
}
