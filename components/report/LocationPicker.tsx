"use client"

import * as React from "react"
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"
import { Location } from "@/types/issue"
import { Button } from "@/components/ui/button"
import { LocateFixed, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface LocationPickerProps {
 location: Location | null
 onLocationChange: (location: Location) => void
 disabled?: boolean
}

// Default to a generic center (e.g., New York City) if GPS is off
const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 }
const LIBRARIES: "places"[] = ["places"]

export function LocationPicker({ location, onLocationChange, disabled }: LocationPickerProps) {
 const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
 
 const { isLoaded } = useLoadScript({
 googleMapsApiKey: apiKey,
 libraries: LIBRARIES,
 })

 const [isDetecting, setIsDetecting] = React.useState(false)
 const mapRef = React.useRef<google.maps.Map | null>(null)

 const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (disabled || !e.latLng) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    // Reverse Geocode
    if (window.google) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          onLocationChange({
            lat,
            lng,
            address: results[0].formatted_address
          });
        } else {
          onLocationChange({ lat, lng });
        }
      });
    } else {
      onLocationChange({ lat, lng });
    }
  }

 const detectLocation = () => {
 if (disabled) return
 setIsDetecting(true)
 
 if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(
 (position) => {
    const newLoc = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    
    if (window.google) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: newLoc }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          onLocationChange({ ...newLoc, address: results[0].formatted_address });
        } else {
          onLocationChange(newLoc);
        }
      });
    } else {
      onLocationChange(newLoc);
    }

    if (mapRef.current) {
      mapRef.current.panTo(newLoc)
      mapRef.current.setZoom(16)
    }
    setIsDetecting(false)
 },
 (error) => {
 console.error("Error detecting location", error)
 setIsDetecting(false)
 // Fallback handling could go here (e.g. Toast error)
 }
 )
 } else {
 setIsDetecting(false)
 }
 }

 if (!apiKey) {
 return (
 <div className="w-full h-[400px] rounded-2xl glass flex items-center justify-center p-6 text-center border border-red-500/30">
 <div>
 <h3 className="text-lg font-bold text-red-400 mb-2">Missing Maps Configuration</h3>
 <p className="text-sm text-slate-300">Google Maps API key is missing. Please check your environment variables.</p>
 </div>
 </div>
 )
 }

 if (!isLoaded) return <Skeleton className="w-full h-[400px] rounded-2xl glass" />

 return (
 <div className="relative w-full h-[400px] rounded-2xl overflow-hidden glass border border-white/20 shadow-lg">
 <GoogleMap
 mapContainerStyle={{ width: "100%", height: "100%" }}
 center={location || DEFAULT_CENTER}
 zoom={location ? 16 : 12}
 onClick={handleMapClick}
 onLoad={(map) => { mapRef.current = map }}
 options={{
 disableDefaultUI: true,
 clickableIcons: false,
 styles: [
 // Basic dark mode style for maps
 { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
 { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
 { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
 { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
 ]
 }}
 >
 {location && (
 <Marker 
 position={location} 
 animation={google.maps.Animation.DROP}
 icon={{
 path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
 fillColor: "var(--accent)",
 fillOpacity: 1,
 strokeWeight: 2,
 strokeColor: "#ffffff",
 scale: 1.5,
 }}
 />
 )}
 </GoogleMap>

 {/* Overlays */}
 <div className="absolute top-4 right-4 flex flex-col gap-2">
 <Button 
 type="button"
 variant="secondary" 
 size="sm" 
 onClick={detectLocation}
 disabled={disabled || isDetecting}
 className="shadow-xl bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
 >
 <LocateFixed className={`h-4 w-4 mr-2 ${isDetecting ? "animate-spin" : ""}`} />
 {isDetecting ? "Detecting..." : "My Location"}
 </Button>
 </div>

 {!location && (
 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
 <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-medium flex items-center gap-2">
 <MapPin className="h-4 w-4 text-accent" />
 Tap anywhere to place a pin
 </div>
 </div>
 )}
 </div>
 )
}
