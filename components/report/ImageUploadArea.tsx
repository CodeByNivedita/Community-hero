"use client"

import * as React from "react"
import { Camera, UploadCloud, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadAreaProps {
 onImageSelected: (file: File) => void
 onImageCleared: () => void
 currentImage: File | null
 disabled?: boolean
}

export function ImageUploadArea({
 onImageSelected,
 onImageCleared,
 currentImage,
 disabled = false,
}: ImageUploadAreaProps) {
 const [dragActive, setDragActive] = React.useState(false)
 const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
 const inputRef = React.useRef<HTMLInputElement>(null)

 React.useEffect(() => {
 if (currentImage) {
 const url = URL.createObjectURL(currentImage)
 setPreviewUrl(url)
 return () => URL.revokeObjectURL(url)
 } else {
 setPreviewUrl(null)
 }
 }, [currentImage])

 const handleDrag = (e: React.DragEvent) => {
 e.preventDefault()
 e.stopPropagation()
 if (e.type === "dragenter" || e.type === "dragover") {
 setDragActive(true)
 } else if (e.type === "dragleave") {
 setDragActive(false)
 }
 }

 const handleDrop = (e: React.DragEvent) => {
 e.preventDefault()
 e.stopPropagation()
 setDragActive(false)
 if (disabled) return
 
 if (e.dataTransfer.files && e.dataTransfer.files[0]) {
 const file = e.dataTransfer.files[0]
 if (file.type.startsWith("image/")) {
 onImageSelected(file)
 }
 }
 }

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 e.preventDefault()
 if (disabled) return
 if (e.target.files && e.target.files[0]) {
 onImageSelected(e.target.files[0])
 }
 }

 const handleClear = () => {
 if (disabled) return
 onImageCleared()
 if (inputRef.current) inputRef.current.value = ""
 }

 return (
 <div className="w-full">
 {previewUrl ? (
 <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden glass border border-white/20 group">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img 
 src={previewUrl} 
 alt="Upload preview" 
 className="w-full h-full object-cover"
 />
 {!disabled && (
 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
 <Button 
 variant="danger" 
 size="icon" 
 onClick={handleClear}
 className="rounded-full shadow-2xl h-12 w-12"
 >
 <X className="h-6 w-6" />
 </Button>
 </div>
 )}
 </div>
 ) : (
 <div
 className={`relative w-full h-64 md:h-80 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all ${
 dragActive 
 ? "border-primary bg-primary/10" 
 : "border-white/20 glass hover:bg-white/5"
 } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
 onDragEnter={handleDrag}
 onDragLeave={handleDrag}
 onDragOver={handleDrag}
 onDrop={handleDrop}
 onClick={() => !disabled && inputRef.current?.click()}
 >
 <input
 ref={inputRef}
 type="file"
 accept="image/*"
 capture="environment" // Suggests back camera on mobile devices
 className="hidden"
 onChange={handleChange}
 disabled={disabled}
 />
 
 <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
 <UploadCloud className="h-8 w-8 text-primary" />
 </div>
 
 <h3 className="text-xl font-semibold mb-2">Upload a Photo</h3>
 <p className="text-muted-foreground text-center text-sm mb-6 max-w-sm">
 Drag and drop an image of the civic issue, or click to browse files.
 </p>

 <Button 
 type="button" 
 variant="secondary" 
 className="pointer-events-none rounded-full px-6 bg-white/10"
 >
 <Camera className="mr-2 h-4 w-4" /> Use Camera
 </Button>
 </div>
 )}
 </div>
 )
}
