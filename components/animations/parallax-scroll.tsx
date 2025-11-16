"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, type ReactNode } from "react"

interface ParallaxScrollProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: "up" | "down"
}

export function ParallaxScroll({
  children,
  className = "",
  speed = 50,
  direction = "up",
}: ParallaxScrollProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "up" ? [0, -speed] : [0, speed]
  )

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

interface ParallaxLayerProps {
  children?: ReactNode
  className?: string
  speed?: number
  scale?: boolean
}

export function ParallaxLayer({
  children,
  className = "",
  speed = 30,
  scale = false,
}: ParallaxLayerProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, speed])
  const scaleValue = scale ? useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]) : 1
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <motion.div
      ref={ref}
      style={{ y, scale: scaleValue, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  threshold?: number
}

export function ScrollReveal({
  children,
  className = "",
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, threshold, 1 - threshold, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, threshold, 1 - threshold, 1], [0.9, 1, 1, 0.9])
  const y = useTransform(scrollYProgress, [0, threshold, 1], [50, 0, -50])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, y }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Parallax background layers for gradient effects
interface ParallaxBackgroundProps {
  children?: ReactNode
  className?: string
  intensity?: "subtle" | "medium" | "strong"
}

export function ParallaxBackground({
  children,
  className = "",
  intensity = "medium",
}: ParallaxBackgroundProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const speeds = {
    subtle: { y: 20, scale: [0.95, 1, 0.95] },
    medium: { y: 50, scale: [0.9, 1, 0.9] },
    strong: { y: 100, scale: [0.85, 1, 0.85] },
  }

  const config = speeds[intensity]
  const y = useTransform(scrollYProgress, [0, 1], [0, config.y])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], config.scale)
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5])

  return (
    <motion.div
      ref={ref}
      style={{ y, scale, rotate }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
