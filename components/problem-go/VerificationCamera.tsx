"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Camera, X, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUploadArea } from "@/components/report/ImageUploadArea"

interface VerificationCameraProps {
 onCapture: (file: File) => void
 onCancel: () => void
 isProcessing: boolean
}

export function VerificationCamera({ onCapture, onCancel, isProcessing }: VerificationCameraProps) {
 const [image, setImage] = React.useState<File | null>(null)

 const handleSubmit = () => {
 if (image) {
 onCapture(image)
 }
 }

 return (
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="glass p-6 md:p-8 rounded-[2rem] border border-white/20 shadow-2xl relative"
 >
 <button 
 onClick={onCancel}
 disabled={isProcessing}
 className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors z-10"
 >
 <X className="h-6 w-6" />
 </button>

 <div className="text-center mb-8">
 <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/50 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
 <Camera className="h-8 w-8 text-primary" />
 </div>
 <h2 className="text-2xl font-bold text-foreground mb-2">Capture Verification</h2>
 <p className="text-muted-foreground text-sm max-w-md mx-auto">
 Ensure the issue is clearly visible in the frame. The AI will compare this photo with the original report.
 </p>
 </div>

 <div className="mb-8">
 <ImageUploadArea 
 currentImage={image}
 onImageSelected={setImage}
 onImageCleared={() => setImage(null)}
 disabled={isProcessing}
 />
 </div>

 <div className="flex gap-4">
 <Button 
 variant="secondary" 
 className="flex-1 rounded-full h-14" 
 onClick={onCancel}
 disabled={isProcessing}
 >
 Cancel
 </Button>
 <Button 
 className="flex-1 rounded-full h-14 bg-emerald-500 hover:bg-emerald-600 text-foreground shadow-lg shadow-emerald-500/20"
 onClick={handleSubmit}
 disabled={!image || isProcessing}
 >
 {isProcessing ? "Analyzing..." : "Submit Verification"}
 </Button>
 </div>
 </motion.div>
 )
}
