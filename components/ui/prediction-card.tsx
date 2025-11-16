'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface PredictionCardProps {
  value: string
  isLoading?: boolean
  className?: string
}

export function PredictionCard({
  value,
  isLoading = false,
  className,
}: PredictionCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-xl border border-[#6E21D7] bg-background p-6",
        "shadow-lg overflow-hidden",
        className
      )}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 0 20px rgba(110, 33, 215, 0.2)",
      }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 10
      }}
    >
      {/* Pulsing border effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: [
            "0 0 0 0px rgba(110, 33, 215, 0)",
            "0 0 0 4px rgba(110, 33, 215, 0.1)",
            "0 0 0 0px rgba(110, 33, 215, 0)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2 text-[#6E21D7]">
            Predicted Price
          </h3>
          <motion.div
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isLoading ? (
              <motion.div
                className="h-12 w-32 mx-auto bg-[#6E21D7]/10 rounded"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ) : (
              <span>${value}</span>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}