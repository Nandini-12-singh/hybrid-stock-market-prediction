'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface ModeToggleProps {
  modes: Array<{
    id: string
    label: string
    icon?: React.ReactNode
  }>
  activeMode: string
  onModeChange: (mode: string) => void
  className?: string
}

export function ModeToggle({
  modes,
  activeMode,
  onModeChange,
  className,
}: ModeToggleProps) {
  return (
    <div
      className={cn(
        "relative flex rounded-lg border border-[#6E21D7] p-1",
        "bg-background shadow-sm",
        className
      )}
    >
      <AnimatePresence>
        <motion.div
          className="absolute inset-1 rounded-md bg-[#6E21D7]/10"
          layoutId="mode-toggle-active"
          transition={{ type: "spring", duration: 0.5 }}
          initial={false}
          style={{
            width: `calc(${100 / modes.length}% - 4px)`,
            left: `calc(${(modes.findIndex(m => m.id === activeMode) * 100) / modes.length}% + 2px)`,
          }}
        />
      </AnimatePresence>

      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={cn(
            "relative z-10 flex flex-1 items-center justify-center rounded-md px-3 py-2",
            "text-sm font-medium transition-colors",
            "hover:text-[#6E21D7]",
            mode.id === activeMode 
              ? "text-[#6E21D7]" 
              : "text-muted-foreground"
          )}
        >
          {mode.icon && <span className="mr-2">{mode.icon}</span>}
          {mode.label}
        </button>
      ))}
    </div>
  )
}