"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Sparkles, CheckCircle2, ArrowRight, Loader2, Info, AlertTriangle, FastForward } from "lucide-react"
import { useAuthContext } from "@/contexts/AuthContext"
import { toast } from "sonner"

import { ImageUploadArea } from "./ImageUploadArea"
import { LocationPicker } from "./LocationPicker"
import { AIAnalysisCard } from "@/components/ai/AIAnalysisCard"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

import { analyzeIssueImage } from "@/services/ai.service"
import { submitIssueReport } from "@/services/issue.service"
import { Location, AIAnalysisResult, IssueReport } from "@/types/issue"

const CATEGORIES = [
 "Infrastructure",
 "Pothole",
 "Graffiti",
 "Sanitation",
 "Safety",
 "Lighting",
 "Environment",
 "Vandalism",
 "Other"
]

function getFriendlyErrorMessage(errorCode?: string): string {
  switch(errorCode) {
    case "ERROR_503": return "Gemini AI is currently busy due to high demand. Please try again in a few moments.";
    case "ERROR_429": return "AI usage limit reached. Please try again later.";
    case "ERROR_NETWORK": return "Unable to connect to the AI service. Check your internet connection.";
    case "ERROR_TIMEOUT": return "AI analysis is taking longer than expected. Please retry.";
    case "ERROR_AUTH": return "AI service configuration error. Please use manual mode.";
    default: return "An unexpected error occurred during AI analysis. Please retry or use manual mode.";
  }
}

export function ReportForm() {
 const router = useRouter()
 const { user } = useAuthContext()
 
 // Form State
 const [image, setImage] = React.useState<File | null>(null)
 const [location, setLocation] = React.useState<Location | null>(null)
 const [title, setTitle] = React.useState("")
 const [description, setDescription] = React.useState("")
 const [category, setCategory] = React.useState("")
 const [severity, setSeverity] = React.useState<"Low" | "Medium" | "High" | "Critical">("Medium")
 
 // Process State
 type ProcessState = "idle" | "uploading" | "analyzing" | "generating";
 const [processState, setProcessState] = React.useState<ProcessState>("idle")
 const [aiResult, setAiResult] = React.useState<AIAnalysisResult | null>(null)
 const [aiError, setAiError] = React.useState<{ message: string, code: string } | null>(null)
 const [isManualMode, setIsManualMode] = React.useState(false)
 
 const [isSubmitting, setIsSubmitting] = React.useState(false)
 const [showSuccessModal, setShowSuccessModal] = React.useState(false)

 const handleAnalyze = async () => {
  if (!image) return
  
  setAiError(null)
  setIsManualMode(false)
  setProcessState("uploading")
  
  try {
    const formData = new FormData()
    formData.append("image", image)
    
    let attempt = 0;
    
    while (attempt <= 3) {
      if (attempt > 0) setProcessState("analyzing");
      
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("ERROR_TIMEOUT")), 30000))
      
      let result: AIAnalysisResult;
      try {
        result = await Promise.race([
          analyzeIssueImage(formData),
          timeoutPromise
        ]) as AIAnalysisResult;
      } catch (e: any) {
        if (e.message === "ERROR_TIMEOUT") {
          throw new Error("ERROR_TIMEOUT");
        }
        throw e;
      }
      
      if (result.error) {
        const code = result.errorCode || "ERROR_UNKNOWN";
        if (code === "ERROR_503" && attempt < 3) {
          const delay = attempt === 0 ? 2000 : (attempt === 1 ? 5000 : 10000);
          console.log(`503 received. Retrying in ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
          attempt++;
          continue;
        }
        throw new Error(code);
      }
      
      // Success
      setProcessState("generating");
      setAiResult(result);
      if (result.title) setTitle(result.title);
      if (result.description) setDescription(result.description);
      if (result.severity) setSeverity(result.severity);
      if (result.category) {
        const matched = CATEGORIES.find(c => c.toLowerCase() === result.category.toLowerCase());
        setCategory(matched || "Other");
      }
      toast.success("Image analyzed successfully");
      return; // Exit function on success
    }
  } catch (error: any) {
    const code = error.message;
    setAiError({ message: getFriendlyErrorMessage(code), code });
    setIsManualMode(true); // Automatically switch to manual mode on failure
  } finally {
    setProcessState("idle");
  }
 }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!image || !location || !category || !title) return

  setIsSubmitting(true)
  try {
  const addressParts = location.address?.split(",") || [];
  // Basic heuristic to get city/district from formatted address
  const extractedArea = addressParts.length >= 3 
    ? addressParts[addressParts.length - 3].trim() 
    : (location.address || "Global");

  console.log("Starting report submission process...");
  const reportData: IssueReport = {
  title,
  description,
  category,
  severity: severity,
  location,
  adminArea: extractedArea,
  imageUrl: "pending_upload", 
  aiAnalysis: aiResult || undefined,
  status: "pending",
  userId: user?.uid,
  reporterName: user?.displayName || "",
  reporterEmail: user?.email || "",
  reporterPhoto: user?.photoURL || ""
  }

  await submitIssueReport(reportData, image)
  console.log("Navigating...");
  toast.success("Report submitted successfully!")
  setShowSuccessModal(true)
  } catch (error: any) {
  console.error("Submission failed:", error)
  toast.error(`Submission failed: ${error.message || "Please try again."}`)
  } finally {
  setIsSubmitting(false)
  }
 }

 const getLoadingMessage = () => {
  switch (processState) {
    case "uploading": return "Uploading image...";
    case "analyzing": return "Analyzing with Gemini...";
    case "generating": return "Generating report...";
    default: return "";
  }
 }

 const showFormFields = aiResult !== null || isManualMode;

 return (
 <div className="relative">
 <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl mx-auto pb-24">
 
 {/* Section 1: Photo & AI */}
 <div className="space-y-4">
 <div className="flex items-center gap-2 mb-2">
 <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-sm">1</div>
 <h2 className="text-section-title">Capture the Issue</h2>
 </div>
 
 <ImageUploadArea 
 currentImage={image}
 onImageSelected={(file) => {
 setImage(file)
 setAiResult(null)
 setAiError(null)
 setIsManualMode(false) 
 }}
 onImageCleared={() => {
 setImage(null)
 setAiResult(null)
 setAiError(null)
 setIsManualMode(false)
 }}
 disabled={processState !== "idle" || isSubmitting}
 />

 <AnimatePresence mode="wait">
 {image && !aiResult && !isManualMode && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 className="pt-4 flex flex-col sm:flex-row gap-4"
 >
 {processState !== "idle" ? (
 <Button 
 disabled 
 className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-primary to-accent opacity-90 text-white shadow-md text-lg transition-all"
 >
 <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {getLoadingMessage()}
 </Button>
 ) : (
 <>
 <Button 
 type="button" 
 onClick={handleAnalyze} 
 className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-md text-lg transition-all"
 >
 <Sparkles className="mr-2 h-5 w-5" /> Auto-Fill with Gemini AI
 </Button>
 <Button 
 type="button" 
 variant="secondary"
 onClick={() => setIsManualMode(true)}
 className="flex-1 sm:max-w-[200px] h-14 rounded-2xl text-lg border border-border shadow-sm"
 >
 <FastForward className="mr-2 h-5 w-5" /> Skip AI
 </Button>
 </>
 )}
 </motion.div>
 )}

 {aiError && (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="pt-4"
 >
 <Card className="p-4 bg-danger/5 border-danger/20 flex flex-col sm:flex-row items-center justify-between gap-4">
 <div className="flex items-start gap-3">
 <AlertTriangle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
 <div>
 <h4 className="text-danger font-semibold text-sm">AI Analysis Failed</h4>
 <p className="text-danger/80 text-sm mt-1">{aiError.message}</p>
 </div>
 </div>
 <Button 
 type="button"
 onClick={handleAnalyze} 
 variant="outline" 
 disabled={processState !== "idle"}
 className="border-danger/20 text-danger hover:bg-danger/10 whitespace-nowrap"
 >
 {processState !== "idle" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Retry AI"}
 </Button>
 </Card>
 </motion.div>
 )}

 {aiResult && (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="pt-4"
 >
 <AIAnalysisCard analysis={aiResult} />
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 <AnimatePresence>
 {showFormFields && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 className="space-y-10"
 >
 {/* Section 2: Location */}
 <div className="space-y-4">
 <div className="flex items-center gap-2 mb-2">
 <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-sm">2</div>
 <h2 className="text-section-title">Pin Location</h2>
 </div>
 
 <LocationPicker 
 location={location}
 onLocationChange={setLocation}
 disabled={isSubmitting}
 />
 </div>

 {/* Section 3: Details */}
 <div className="space-y-4">
 <div className="flex flex-col gap-2 mb-2">
 <div className="flex items-center gap-2">
 <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-sm">3</div>
 <h2 className="text-section-title">Details</h2>
 </div>
 {aiResult && (
 <div className="flex items-center gap-2 text-success bg-success/10 border border-success/20 text-sm px-4 py-2 rounded-xl mt-2 w-fit font-medium shadow-sm">
 <Info className="h-4 w-4" /> Fields below were auto-filled by Gemini. You can edit them if needed.
 </div>
 )}
 </div>

 <Card className={`grid grid-cols-1 gap-6 p-6 rounded-[2rem] transition-all duration-500 ${
 aiResult ? 'border-success/30 shadow-[0_0_20px_rgba(22,163,74,0.1)]' : ''
 }`}>
 <div className="space-y-2">
 <label className="text-sm font-semibold text-text-primary">Title</label>
 <Input 
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 placeholder="E.g., Large pothole on main street"
 required
 disabled={isSubmitting}
 className={`transition-all ${aiResult ? 'border-success/50 bg-success/5' : ''}`}
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-sm font-semibold text-text-primary">Category</label>
 <select 
 value={category}
 onChange={(e) => setCategory(e.target.value)}
 required
 disabled={isSubmitting}
 className={`w-full h-12 px-4 rounded-xl text-text-primary appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-primary shadow-sm ${aiResult ? 'border border-success/50 bg-success/5' : 'bg-surface border border-border'}`}
 >
 <option value="" disabled>Select a category...</option>
 {CATEGORIES.map(c => (
 <option key={c} value={c} className="bg-surface">{c}</option>
 ))}
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-sm font-semibold text-text-primary">Severity</label>
 <select 
 value={severity}
 onChange={(e) => setSeverity(e.target.value as any)}
 required
 disabled={isSubmitting}
 className={`w-full h-12 px-4 rounded-xl text-text-primary appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-primary shadow-sm ${aiResult ? 'border border-success/50 bg-success/5' : 'bg-surface border border-border'}`}
 >
 <option value="Low" className="bg-surface">Low</option>
 <option value="Medium" className="bg-surface">Medium</option>
 <option value="High" className="bg-surface">High</option>
 <option value="Critical" className="bg-surface">Critical</option>
 </select>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-semibold text-text-primary">Description</label>
 <Textarea 
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 placeholder="Add any extra details that might help responders..."
 className={`transition-all ${aiResult ? 'border-success/50 bg-success/5' : ''}`}
 disabled={isSubmitting}
 />
 </div>
 </Card>
 </div>

 {/* Submit Button */}
 <div className="pt-6">
 <Button 
 type="submit" 
 size="lg" 
 disabled={!image || !location || !category || !title || isSubmitting || processState !== "idle"}
 className="w-full h-16 rounded-full text-lg shadow-md transition-all"
 >
 {isSubmitting ? (
 <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting Report...</>
 ) : (
 <>Submit Issue Report <ArrowRight className="ml-2 h-5 w-5" /></>
 )}
 </Button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </form>

 {/* Success Modal Overlay */}
 <AnimatePresence>
 {showSuccessModal && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
 >
 <motion.div 
 initial={{ scale: 0.9, opacity: 0, y: 20 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 className="bg-surface p-8 md:p-12 rounded-[2rem] max-w-lg w-full text-center border border-border shadow-2xl relative overflow-hidden"
 >
 <div className="absolute inset-0 bg-gradient-to-tr from-success/10 to-primary/10 pointer-events-none" />
 
 <div className="relative z-10 flex flex-col items-center">
 <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center mb-6 border border-success/30 shadow-[0_0_30px_rgba(22,163,74,0.2)]">
 <CheckCircle2 className="h-12 w-12 text-success" />
 </div>
 
 <h3 className="text-page-title mb-4">Hero Status Achieved!</h3>
 <p className="text-body mb-8">
 Your report has been successfully submitted and routed to the correct department. You've earned <span className="text-success font-bold">+50 XP</span>.
 </p>
 
 <div className="flex flex-col sm:flex-row gap-4 w-full">
 <Button 
 variant="secondary" 
 className="flex-1 rounded-full h-12"
 onClick={() => {
 setShowSuccessModal(false)
 // Reset form
 setImage(null)
 setLocation(null)
 setTitle("")
 setCategory("")
 setDescription("")
 setSeverity("Medium")
 setAiResult(null)
 setAiError(null)
 setIsManualMode(false)
 }}
 >
 Report Another
 </Button>
 <Button 
 className="flex-1 rounded-full h-12"
 onClick={() => router.push("/dashboard")}
 >
 View Dashboard
 </Button>
 </div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 )
}
