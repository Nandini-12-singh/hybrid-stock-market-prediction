"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface AnimatedLoaderProps {
  isLoading: boolean
}

export function AnimatedLoader({ isLoading }: AnimatedLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl"
        >
          <div className="relative">
            {/* Animated Gradient Background */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute inset-0 w-64 h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-50"
            />
            
            {/* Spinning Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative w-32 h-32"
            >
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 border-r-purple-500" />
            </motion.div>

            {/* Center Pulse */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 blur-lg" />
            </motion.div>

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-lg font-semibold text-slate-300 tracking-wide"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                Loading...
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Page Loading Component
export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return <AnimatedLoader isLoading={isLoading} />
}
