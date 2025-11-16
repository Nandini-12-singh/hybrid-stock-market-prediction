'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

interface SimulationButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  loading?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
}

export const SimulationButton = React.forwardRef<HTMLButtonElement, SimulationButtonProps>(
  ({ className, children, loading, icon, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg bg-[#6E21D7] px-6 py-3",
          "text-white font-medium shadow-lg",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-transform duration-200",
          className
        )}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 0 25px rgba(58, 179, 245, 0.4)"
        }}
        whileTap={{ scale: 0.98 }}
        disabled={loading || disabled}
        {...props}
      >
        {/* Background gradient and glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#6E21D7] to-[#3AB3F5]/80"
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Content */}
        <div className="relative flex items-center justify-center gap-2">
          {loading ? (
            <motion.div
              className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ) : (
            icon && <span>{icon}</span>
          )}
          <span className="relative">{children}</span>
        </div>
      </motion.button>
    )
  }
)
SimulationButton.displayName = "SimulationButton"