"use client"

import * as React from "react"
import { Marker } from "@react-google-maps/api"
import { IssueReport } from "@/types/issue"

interface IssueMarkerProps {
 issue: IssueReport
 onClick: (issue: IssueReport) => void
 clusterer?: any // from @react-google-maps/api MarkerClusterer
}

export const CATEGORY_ICONS: Record<string, { path: string, color: string }> = {
 "Pothole": { 
 // Circle with jagged edge or simple warning
 path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z", 
 color: "#eab308" // Yellow
 },
 "Garbage": { 
 path: "M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z", 
 color: "var(--primary)" // Violet
 },
 "Water Leakage": {
 path: "M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z",
 color: "#3b82f6" // Blue
 },
 "Broken Streetlight": {
 path: "M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z",
 color: "#f59e0b" // Amber
 },
 "Sewage": {
 path: "M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm5 15h-2v-6H9v6H7v-7.81l5-4.5 5 4.5V18z",
 color: "#84cc16" // Lime
 },
 "Fallen Tree": {
 path: "M11 21v-5.22c-1.34-1.25-2.28-2.9-2.73-4.78H5.97c.48 3 1.94 5.67 4.03 7.72V21h1zm4.03-2.28c2.09-2.05 3.55-4.72 4.03-7.72h-2.3c-.45 1.88-1.39 3.53-2.73 4.78V21h1v-2.28zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
 color: "#22c55e" // Green
 },
 "Traffic Signal": {
 path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z", // Reusing warning
 color: "#ef4444" // Red
 },
 "Vandalism": {
 path: "M2.5 19h19v2h-19zm19.5-3.32l-1.41 1.41-5.66-5.66 1.41-1.41 5.66 5.66zm-7.07-5.66L9.29 4.36a1.99 1.99 0 00-2.83 0L3.64 7.19a1.99 1.99 0 000 2.83l5.66 5.66 5.66-5.66z",
 color: "var(--accent)" // Pink
 },
 "Other": {
 path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
 color: "#a8a29e" // Stone
 }
}

export function IssueMarker({ issue, onClick, clusterer }: IssueMarkerProps) {
 const iconConfig = CATEGORY_ICONS[issue.category] || CATEGORY_ICONS["Other"]

 return (
 <Marker
 position={{ lat: issue.location.lat, lng: issue.location.lng }}
 clusterer={clusterer}
 onClick={() => onClick(issue)}
 animation={google.maps.Animation.DROP}
 icon={{
 path: iconConfig.path,
 fillColor: iconConfig.color,
 fillOpacity: 1,
 strokeWeight: 1,
 strokeColor: "#ffffff",
 scale: 1.5, // Scale SVG up slightly
 anchor: new google.maps.Point(12, 12),
 }}
 />
 )
}
