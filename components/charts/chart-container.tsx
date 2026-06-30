"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface ChartContainerProps {
 title: string
 description?: string
 children: React.ReactNode
 className?: string
}

export function ChartContainer({ title, description, children, className }: ChartContainerProps) {
 return (
 <Card className={`glass ${className || ""}`}>
 <CardHeader>
 <CardTitle>{title}</CardTitle>
 {description && <CardDescription>{description}</CardDescription>}
 </CardHeader>
 <CardContent className="h-[300px] w-full pb-4">
 {children}
 </CardContent>
 </Card>
 )
}
