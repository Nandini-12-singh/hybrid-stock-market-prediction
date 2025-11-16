"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef, type ReactNode } from "react"

interface ViewportFadeProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none" | "scale" | "blur"
  duration?: number
  once?: boolean
  amount?: number
}

export function ViewportFade({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true,
  amount = 0.3,
}: ViewportFadeProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-50px", amount })

  const directionVariants = {
    up: { 
      initial: { opacity: 0, y: 60, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 }
    },
    down: { 
      initial: { opacity: 0, y: -60, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 }
    },
    left: { 
      initial: { opacity: 0, x: 60, scale: 0.98 },
      animate: { opacity: 1, x: 0, scale: 1 }
    },
    right: { 
      initial: { opacity: 0, x: -60, scale: 0.98 },
      animate: { opacity: 1, x: 0, scale: 1 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 }
    },
    blur: {
      initial: { opacity: 0, filter: "blur(10px)" },
      animate: { opacity: 1, filter: "blur(0px)" }
    },
    none: { 
      initial: { opacity: 0 },
      animate: { opacity: 1 }
    },
  }

  const variants = directionVariants[direction]

  return (
    <motion.div
      ref={ref}
      initial={variants.initial}
      animate={isInView ? variants.animate : variants.initial}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
