"use client"

import * as React from "react"
import { GoogleMap as GoogleMapComponent, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api"
import { Skeleton } from "@/components/ui/skeleton"

const libraries: "places"[] = ["places"]

interface GoogleMapProps {
 center: { lat: number; lng: number }
 zoom?: number
 children?: React.ReactNode
 className?: string
}

export function GoogleMap({ center, zoom = 14, children, className }: GoogleMapProps) {
 const { isLoaded, loadError } = useLoadScript({
 googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
 libraries,
 })

 const mapContainerStyle = {
 width: "100%",
 height: "100%",
 }

 const mapOptions = {
 disableDefaultUI: true,
 clickableIcons: false,
 mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || undefined, // Useful for styling if using Advanced Markers
 }

 if (loadError) return <div className="p-4 bg-destructive/10 text-destructive rounded-xl">Error loading maps</div>
 if (!isLoaded) return <Skeleton className="w-full h-full min-h-[400px] rounded-3xl" />

 return (
 <div className={`relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl ${className || "w-full h-[600px]"}`}>
 <GoogleMapComponent
 mapContainerStyle={mapContainerStyle}
 zoom={zoom}
 center={center}
 options={mapOptions}
 >
 {children}
 </GoogleMapComponent>
 </div>
 )
}
