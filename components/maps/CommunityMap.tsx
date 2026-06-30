"use client"

import * as React from "react"
import { GoogleMap, useLoadScript, MarkerClusterer, DirectionsService, DirectionsRenderer } from "@react-google-maps/api"
import { useIssues, IssueFilters } from "@/hooks/useIssues"
import { IssueReport } from "@/types/issue"
import { Skeleton } from "@/components/ui/skeleton"

import { IssueMarker } from "./IssueMarker"
import { MarkerPopup } from "./MarkerPopup"
import { MapLegend } from "./MapLegend"
import { FilterSidebar } from "./FilterSidebar"
import { NearbyIssuesPanel } from "./NearbyIssuesPanel"
import { UserLocationButton } from "./UserLocationButton"

const LIBRARIES: "places"[] = ["places"]
const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 } // NYC
const MAP_STYLES = [
 { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
 { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
 { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
 { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
 { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
 { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
 { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
 { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
 { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }
]

export function CommunityMap() {
 const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
 
 const { isLoaded } = useLoadScript({
 googleMapsApiKey: apiKey,
 libraries: LIBRARIES,
 })

 const [filters, setFilters] = React.useState<IssueFilters>({ category: "All", severity: "All", status: "All" })
 const { issues, loading } = useIssues(filters)
 
 const [selectedIssue, setSelectedIssue] = React.useState<IssueReport | null>(null)
 const [userLocation, setUserLocation] = React.useState<google.maps.LatLngLiteral | null>(null)
 const [isDetecting, setIsDetecting] = React.useState(false)
 const [directions, setDirections] = React.useState<google.maps.DirectionsResult | null>(null)

 const mapRef = React.useRef<google.maps.Map | null>(null)

 // Handlers
 const handleLocateUser = () => {
 setIsDetecting(true)
 if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(
 (position) => {
 const loc = { lat: position.coords.latitude, lng: position.coords.longitude }
 setUserLocation(loc)
 mapRef.current?.panTo(loc)
 mapRef.current?.setZoom(15)
 setIsDetecting(false)
 },
 () => {
 setIsDetecting(false)
 alert("Could not detect location.")
 }
 )
 } else {
 setIsDetecting(false)
 }
 }

 const handleNavigate = (issue: IssueReport) => {
 if (!userLocation) {
 alert("Please detect your location first using the target button.")
 return
 }
 // Set up direction request
 const directionsService = new google.maps.DirectionsService()
 directionsService.route(
 {
 origin: userLocation,
 destination: { lat: issue.location.lat, lng: issue.location.lng },
 travelMode: google.maps.TravelMode.WALKING,
 },
 (result, status) => {
 if (status === google.maps.DirectionsStatus.OK) {
 setDirections(result)
 setSelectedIssue(null) // close popup when navigating
 } else {
 console.error(`error fetching directions ${result}`)
 }
 }
 )
 }

 if (!apiKey) {
 return (
 <div className="h-screen w-full bg-zinc-900 flex items-center justify-center">
 <div className="glass p-6 rounded-2xl max-w-md text-center border border-red-500/30">
 <h3 className="text-lg font-bold text-red-400 mb-2">Missing Maps Configuration</h3>
 <p className="text-sm text-slate-300">Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.</p>
 </div>
 </div>
 )
 }

 if (!isLoaded) return <div className="h-screen w-full bg-zinc-900 flex items-center justify-center"><Skeleton className="w-full h-full glass" /></div>

 return (
 <div className="relative w-full h-screen bg-zinc-900 overflow-hidden">
 <GoogleMap
 mapContainerStyle={{ width: "100%", height: "100%" }}
 center={DEFAULT_CENTER}
 zoom={13}
 onLoad={(map) => { mapRef.current = map }}
 onClick={() => setSelectedIssue(null)}
 options={{
 disableDefaultUI: true,
 styles: MAP_STYLES,
 clickableIcons: false
 }}
 >
 <MarkerClusterer>
 {(clusterer) => (
 <>
 {issues.map((issue) => (
 <IssueMarker 
 key={issue.id} 
 issue={issue} 
 clusterer={clusterer}
 onClick={(i) => {
 setSelectedIssue(i)
 setDirections(null) // clear previous route
 }} 
 />
 ))}
 </>
 )}
 </MarkerClusterer>

 {selectedIssue && (
 <MarkerPopup 
 issue={selectedIssue} 
 onClose={() => setSelectedIssue(null)} 
 onNavigate={handleNavigate}
 />
 )}

 {/* User Location Marker */}
 {userLocation && (
 <MarkerClusterer>
 {() => (
 <IssueMarker 
 issue={{
 id: "user",
 title: "You are here",
 category: "User",
 severity: "Low",
 location: userLocation,
 imageUrl: "",
 status: "verified"
 } as any}
 onClick={() => {}}
 />
 )}
 </MarkerClusterer>
 )}

 {/* Directions */}
 {directions && (
 <DirectionsRenderer
 directions={directions}
 options={{
 suppressMarkers: false,
 polylineOptions: { strokeColor: "#3b82f6", strokeWeight: 5 }
 }}
 />
 )}
 </GoogleMap>

 {/* UI Overlays */}
 <FilterSidebar filters={filters} onFilterChange={setFilters} />
 <NearbyIssuesPanel 
 issues={issues} 
 onIssueClick={(i) => {
 setSelectedIssue(i)
 mapRef.current?.panTo({ lat: i.location.lat, lng: i.location.lng })
 mapRef.current?.setZoom(17)
 }} 
 />
 <MapLegend />
 <UserLocationButton onLocate={handleLocateUser} isDetecting={isDetecting} />
 
 {/* Loading overlay for filters */}
 {loading && (
 <div className="absolute top-4 left-1/2 -translate-x-1/2 glass px-4 py-1 rounded-full border border-white/20 text-xs text-foreground z-20">
 Updating map...
 </div>
 )}
 </div>
 )
}
