"use client"

import { motion } from "framer-motion"
import type React from "react"

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  delay?: number
  title?: string
  description?: string
  noPadding?: boolean
  gradientVariant?: "blue" | "purple" | "pink" | "cyan" | "none"
}

export function SectionWrapper({
  children,
  className = "",
  delay = 0,
  title,
  description,
  noPadding = false,
  gradientVariant = "blue",
}: SectionWrapperProps) {
  const gradientClasses = {
    blue: "gradient-section-1 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5",
    purple: "gradient-section-2 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5",
    pink: "gradient-section-3 bg-gradient-to-br from-pink-500/5 via-fuchsia-500/5 to-purple-500/5",
    cyan: "gradient-section-1 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5",
    none: "",
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`section-wrapper relative overflow-hidden backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl ${
        gradientVariant !== "none" ? gradientClasses[gradientVariant] : "bg-slate-900/30"
      } ${noPadding ? "" : "p-6 lg:p-8"} ${className}`}
    >
      {gradientVariant !== "none" && (
        <div className="absolute inset-0 -z-10 opacity-50">
          <div className={`absolute inset-0 ${gradientClasses[gradientVariant]}`} />
        </div>
      )}
      <div className="relative">
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h2 className="text-2xl lg:text-3xl font-bold gradient-text-primary mb-2">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm lg:text-base text-slate-300">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </motion.section>
  )
}
