"use client"

import { motion } from "framer-motion"

interface FloatingBlobProps {
  color: string
  size: number
  x: string
  y: string
  delay?: number
  duration?: number
}

function FloatingBlob({ color, size, x, y, delay = 0, duration = 20 }: FloatingBlobProps) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-50"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
      animate={{
        x: [0, 30, -20, 40, 0],
        y: [0, -40, 30, -30, 0],
        scale: [1, 1.1, 0.9, 1.05, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  )
}

export function FloatingBlobsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large blobs */}
      <FloatingBlob
        color="rgba(99, 102, 241, 0.4)"
        size={600}
        x="10%"
        y="20%"
        duration={25}
        delay={0}
      />
      <FloatingBlob
        color="rgba(168, 85, 247, 0.4)"
        size={500}
        x="70%"
        y="10%"
        duration={30}
        delay={2}
      />
      <FloatingBlob
        color="rgba(236, 72, 153, 0.4)"
        size={550}
        x="50%"
        y="60%"
        duration={28}
        delay={4}
      />
      
      {/* Medium blobs */}
      <FloatingBlob
        color="rgba(6, 182, 212, 0.3)"
        size={400}
        x="30%"
        y="70%"
        duration={22}
        delay={1}
      />
      <FloatingBlob
        color="rgba(139, 92, 246, 0.3)"
        size={450}
        x="80%"
        y="50%"
        duration={26}
        delay={3}
      />
      
      {/* Small accent blobs */}
      <FloatingBlob
        color="rgba(251, 113, 133, 0.3)"
        size={300}
        x="15%"
        y="40%"
        duration={18}
        delay={2.5}
      />
      <FloatingBlob
        color="rgba(34, 211, 238, 0.3)"
        size={350}
        x="85%"
        y="75%"
        duration={20}
        delay={1.5}
      />
    </div>
  )
}

// Abstract floating shapes
interface FloatingShapeProps {
  shape: "circle" | "square" | "triangle"
  size: number
  x: string
  y: string
  color: string
  delay?: number
}

export function FloatingShape({ shape, size, x, y, color, delay = 0 }: FloatingShapeProps) {
  const shapeStyles = {
    circle: "rounded-full",
    square: "rounded-lg rotate-45",
    triangle: "clip-triangle",
  }

  return (
    <motion.div
      className={`absolute ${shapeStyles[shape]} opacity-20`}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: color,
        boxShadow: `0 0 40px ${color}`,
      }}
      animate={{
        y: [0, -30, 0],
        rotate: shape === "square" ? [45, 90, 45] : [0, 360, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  )
}
