"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <>
      {/* Cursor Glow Effect - Desktop Only */}
      {isVisible && (
        <motion.div
          className="pointer-events-none fixed z-50 hidden md:block"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            x: "-50%",
            y: "-50%",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            {/* Inner glow */}
            <div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 blur-2xl" />
            {/* Outer glow */}
            <div className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
          </div>
        </motion.div>
      )}
    </>
  )
}

// Magnetic Button Hook
export function useMagneticEffect(ref: React.RefObject<HTMLElement>, strength = 0.3) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength
      
      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    }

    const handleMouseLeave = () => {
      element.style.transform = "translate(0px, 0px)"
    }

    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [ref, strength])
}
