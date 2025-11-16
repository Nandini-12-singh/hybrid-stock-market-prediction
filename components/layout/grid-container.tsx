"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface GridContainerProps {
  children: React.ReactNode
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  className?: string
}

export function GridContainer({
  children,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 6,
  className = "",
}: GridContainerProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  }

  const gapClasses = {
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
  }

  const colClasses = [
    cols.default && gridCols[cols.default as keyof typeof gridCols],
    cols.sm && `sm:${gridCols[cols.sm as keyof typeof gridCols]}`,
    cols.md && `md:${gridCols[cols.md as keyof typeof gridCols]}`,
    cols.lg && `lg:${gridCols[cols.lg as keyof typeof gridCols]}`,
    cols.xl && `xl:${gridCols[cols.xl as keyof typeof gridCols]}`,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      className={cn(
        "grid",
        colClasses,
        gapClasses[gap as keyof typeof gapClasses] || "gap-6",
        className
      )}
    >
      {children}
    </div>
  )
}

interface GridItemProps {
  children: React.ReactNode
  className?: string
  colSpan?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export function GridItem({
  children,
  className = "",
  colSpan,
}: GridItemProps) {
  const spanClasses = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
  }

  const colSpanClasses = colSpan
    ? [
        colSpan.default && spanClasses[colSpan.default as keyof typeof spanClasses],
        colSpan.sm && `sm:${spanClasses[colSpan.sm as keyof typeof spanClasses]}`,
        colSpan.md && `md:${spanClasses[colSpan.md as keyof typeof spanClasses]}`,
        colSpan.lg && `lg:${spanClasses[colSpan.lg as keyof typeof spanClasses]}`,
        colSpan.xl && `xl:${spanClasses[colSpan.xl as keyof typeof spanClasses]}`,
      ]
        .filter(Boolean)
        .join(" ")
    : ""

  return <div className={cn(colSpanClasses, className)}>{children}</div>
}
