"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
 title: string
 value: string | number
 icon?: React.ReactNode
 trend?: {
 value: number
 isPositive: boolean
 }
 className?: string
}

export function MetricCard({ title, value, icon, trend, className }: MetricCardProps) {
 return (
 <Card className={cn("glass overflow-hidden relative group", className)}>
 <div className="absolute inset-0 bg-gradient-to-br from-foreground to-muted-foreground dark:from-foreground dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
 <CardHeader className="flex flex-row items-center justify-between pb-2">
 <CardTitle className="text-sm font-medium text-muted-foreground">
 {title}
 </CardTitle>
 {icon && (
 <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
 {icon}
 </div>
 )}
 </CardHeader>
 <CardContent>
 <div className="text-3xl font-bold tracking-tight">{value}</div>
 {trend && (
 <p className="text-xs mt-2 flex items-center gap-1">
 <span className={cn(
 "font-medium",
 trend.isPositive ? "text-emerald-500" : "text-destructive"
 )}>
 {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
 </span>
 <span className="text-muted-foreground">from last month</span>
 </p>
 )}
 </CardContent>
 </Card>
 )
}
