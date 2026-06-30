"use client"

import * as React from "react"
import { Marker } from "@react-google-maps/api"

interface IssueMarkerProps {
 position: { lat: number; lng: number }
 severity: "high" | "medium" | "low"
 onClick?: () => void
}

export function IssueMarker({ position, severity, onClick }: IssueMarkerProps) {
 // Define custom icon based on severity (using colors matching design system)
 const getIconColor = () => {
 switch (severity) {
 case "high": return "var(--accent)" // pink-500
 case "medium": return "#f59e0b" // amber-500
 case "low": return "#3b82f6" // blue-500
 default: return "var(--primary)" // indigo-600
 }
 }

 // A basic fallback if no custom SVG marker is provided
 // In a real prod environment, use a custom SVG path or AdvancedMarkerElement
 return (
 <Marker 
 position={position}
 onClick={onClick}
 icon={{
 path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
 fillColor: getIconColor(),
 fillOpacity: 0.9,
 strokeWeight: 2,
 strokeColor: "#ffffff",
 scale: 1.5,
 }}
 />
 )
}
