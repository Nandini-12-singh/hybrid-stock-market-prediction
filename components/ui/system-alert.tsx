'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface SystemAlertProps {
  message: string
  isVisible: boolean
  onClose?: () => void
  className?: string
}

export function SystemAlert({
  message,
  isVisible,
  onClose,
  className,
}: SystemAlertProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "relative rounded-lg border border-red-500/50 bg-background/95 p-4",
            "shadow-lg backdrop-blur-sm",
            className
          )}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          {/* Neon border effect */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(239, 68, 68, 0)",
                "0 0 10px 2px rgba(239, 68, 68, 0.3)",
                "0 0 0 0px rgba(239, 68, 68, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div className="flex-1 text-sm text-red-500">{message}</div>
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-red-500/10 transition-colors"
              >
                <svg
                  className="h-4 w-4 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}