"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, ChevronRight, RefreshCw, ArrowLeft, Star, Medal, Flame, Info } from "lucide-react"
import { GeminiVerificationResult } from "@/types/problem-go"
import { Button } from "@/components/ui/button"

interface VerificationResultProps {
  result: GeminiVerificationResult
  onContinue: () => void
}

export function VerificationResult({ result, onContinue }: VerificationResultProps) {
  const isFake = result.status === "Fake Report"

  const statusConfig = {
    "Still Exists": { color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-200" },
    "Partially Resolved": { color: "text-yellow-700", bg: "bg-yellow-100", border: "border-yellow-200" },
    "Fully Resolved": { color: "text-green-700", bg: "bg-green-100", border: "border-green-200" },
    "Fake Report": { color: "text-red-700", bg: "bg-red-100", border: "border-red-200" }
  }

  const badgeStyle = statusConfig[result.status] || statusConfig["Fake Report"]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-2xl relative overflow-hidden text-center flex flex-col items-center max-w-2xl mx-auto"
    >
      {/* Top Icon */}
      <div className="mb-6">
        {isFake ? (
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center border-4 border-red-50">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
        ) : (
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-50">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        )}
      </div>

      {/* Title */}
      <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
        {isFake ? "Verification Failed" : "Verification Successful"}
      </h2>

      {/* Status Badge */}
      <div className={`inline-flex items-center px-4 py-1.5 rounded-full border ${badgeStyle.bg} ${badgeStyle.border} ${badgeStyle.color} font-semibold text-sm mb-8 shadow-sm`}>
        {result.status}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
        {/* Confidence Card */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center justify-center">
          <div className="text-5xl font-black text-primary tracking-tighter mb-2">
            {result.confidence}%
          </div>
          <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">
            AI Confidence
          </div>
        </div>

        {/* Explanation Card */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-700">AI Assessment</h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            "{result.explanation}"
          </p>
        </div>
      </div>

      {/* Rewards Section */}
      {!isFake && (
        <div className="w-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10 mb-8">
          <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Rewards Unlocked</h4>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-gray-700">XP Earned</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
              <Medal className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-gray-700">Verifier Bonus</span>
            </div>
            {result.confidence >= 90 && (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
                <span className="font-semibold text-gray-700">High Confidence</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {isFake ? (
          <>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14 rounded-xl text-lg font-semibold border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={onContinue}
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Return to Missions
            </Button>
            <Button
              size="lg"
              className="flex-1 h-14 rounded-xl text-lg font-semibold bg-gray-900 text-white hover:bg-gray-800"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-5 w-5" /> Try Again
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14 rounded-xl text-lg font-semibold border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={() => window.location.href = "/problem-go"}
            >
              Verify Another
            </Button>
            <Button
              size="lg"
              className="flex-1 h-14 rounded-xl text-lg font-semibold bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/25"
              onClick={onContinue}
            >
              Continue <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </motion.div>
  )
}
