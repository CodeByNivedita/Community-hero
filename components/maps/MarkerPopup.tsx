"use client"

import * as React from "react"
import { InfoWindow } from "@react-google-maps/api"
import { IssueReport } from "@/types/issue"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Clock, ShieldAlert, User } from "lucide-react"
import { format } from "date-fns"

interface MarkerPopupProps {
 issue: IssueReport
 onClose: () => void
 onNavigate: (issue: IssueReport) => void
}

export function MarkerPopup({ issue, onClose }: MarkerPopupProps) {
 const [imgError, setImgError] = React.useState(false)
 const [imgLoaded, setImgLoaded] = React.useState(false)

 const handleDirectionsClick = () => {
 if (!issue.location?.lat || !issue.location?.lng) {
 alert("Issue coordinates are missing.")
 return
 }
 const dest = `${issue.location.lat},${issue.location.lng}`
 
 if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(
 (pos) => {
 const origin = `${pos.coords.latitude},${pos.coords.longitude}`
 window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`, "_blank")
 },
 () => {
 window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, "_blank")
 }
 )
 } else {
 window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, "_blank")
 }
 }

 return (
 <InfoWindow
 position={{ lat: issue.location.lat, lng: issue.location.lng }}
 onCloseClick={onClose}
 options={{
 pixelOffset: new google.maps.Size(0, -30),
 maxWidth: 320,
 }}
 >
 <div className="w-[300px] flex flex-col font-sans p-1">
 {/* Issue Image */}
 <div className="w-full h-32 rounded-lg overflow-hidden mb-3 relative bg-surface-secondary">
 {!imgLoaded && !imgError && (
 <div className="absolute inset-0 bg-surface-secondary animate-pulse" />
 )}
 <img 
 src={imgError || !issue.imageUrl || issue.imageUrl.startsWith("blob:") ? "/pothole.jpg" : issue.imageUrl} 
 alt={issue.title} 
 className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
 onLoad={() => setImgLoaded(true)}
 onError={() => { setImgError(true); setImgLoaded(true); }}
 />
 <div className="absolute top-2 right-2">
 <Badge variant={issue.severity === "Critical" ? "destructive" : "secondary"} className="shadow-lg">
 {issue.severity.toUpperCase()}
 </Badge>
 </div>
 </div>

 {/* Title & Details */}
 <h3 className="text-card-title mb-1 leading-tight line-clamp-1">{issue.title}</h3>
 <p className="text-caption mb-3 line-clamp-2">{issue.description}</p>
 
 {/* Reporter Info */}
 <div className="flex flex-col gap-1 mb-3 text-caption bg-surface-secondary p-3 rounded-xl border border-border shadow-sm">
 <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Reported by:</div>
 <div className="flex items-center gap-3 mb-2">
 {issue.reporterPhoto ? (
 <img src={issue.reporterPhoto} alt={issue.reporterName || "Reporter"} className="w-9 h-9 rounded-full object-cover shadow-sm border border-surface" />
 ) : (
 <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shadow-sm border border-surface">
 <User className="w-4 h-4 text-primary" />
 </div>
 )}
 <div className="flex flex-col overflow-hidden">
 <span className="font-semibold text-text-primary truncate">{issue.reporterName || "Anonymous Hero"}</span>
 {issue.reporterEmail && <span className="text-xs text-muted truncate">{issue.reporterEmail}</span>}
 </div>
 </div>
 
 <div className="w-full h-px bg-border my-1"></div>
 
 <div className="flex flex-col gap-1 mt-1">
 <div className="text-xs font-medium text-text-secondary">
 {issue.createdAt ? format(issue.createdAt, "dd MMMM yyyy") : "Unknown Date"}
 </div>
 <div className="text-xs font-medium text-text-secondary flex gap-1 items-center">
 Status: <span className={`capitalize font-semibold ${issue.status === 'pending' ? 'text-warning' : 'text-success'}`}>{issue.status.replace("_", " ")}</span>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 gap-2 mb-4">
 <div className="flex items-center text-xs text-text-secondary font-medium bg-surface-secondary p-2 rounded-lg border border-border">
 <MapPin className="h-4 w-4 mr-2 text-primary" /> {issue.category}
 </div>
 {issue.aiAnalysis && (
 <div className="flex items-center text-xs text-success font-medium bg-success/10 p-2 rounded-lg border border-success/20">
 <ShieldAlert className="h-4 w-4 mr-2" /> Routed: {issue.aiAnalysis.department}
 </div>
 )}
 </div>

 {/* CTA */}
 <Button 
 size="sm" 
 onClick={handleDirectionsClick}
 className="w-full rounded-full shadow-md"
 >
 <Navigation className="h-4 w-4 mr-2" /> Get Directions
 </Button>
 </div>
 </InfoWindow>
 )
}
