"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Plug, 
  Brain, 
  Scale, 
  Briefcase, 
  Play 
} from "lucide-react"
import { ParallaxLayer } from "@/components/animations/parallax-scroll"

const pages = [
  { path: "/", name: "Overview", icon: LayoutDashboard },
  { path: "/data-apis", name: "Data & APIs", icon: Plug },
  { path: "/models-benchmarks", name: "Models & Benchmarks", icon: Brain },
  { path: "/model-comparison", name: "Model Comparison", icon: Scale },
  { path: "/portfolio-results", name: "Portfolio Results", icon: Briefcase },
]

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Quick Navigation Bar - Below Header with Glassmorphism */}
      <nav className="w-full glass-nav sticky top-[73px] z-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {pages.map((page) => {
              const Icon = page.icon
              const isActive = pathname === page.path
              
              return (
                <Link key={page.path} href={page.path}>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-600/30 glow-primary"
                        : "glass-button text-slate-300 hover:text-white"
                    }`}
                  >
                    <Icon size={16} className="transition-transform group-hover:rotate-12" />
                    <span className="hidden sm:inline">{page.name}</span>
                  </motion.button>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content - Full Width with Max Width Container */}
      <main className="w-full relative">
        {/* Animated Gradient Background Layers with Parallax */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Base Animated Gradient - Static */}
          <div className="absolute inset-0 gradient-bg-animated opacity-90" />
          
          {/* Parallax Gradient Layers with Scroll Effect */}
          <ParallaxLayer speed={-20} className="parallax-layer-1 absolute inset-0" />
          <ParallaxLayer speed={-30} className="parallax-layer-2 absolute inset-0" />
          
          {/* Radial Gradient Orbs with Parallax */}
          <div className="absolute inset-0">
            <ParallaxLayer speed={-15}>
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
            </ParallaxLayer>
            <ParallaxLayer speed={-25}>
              <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/15 via-blue-500/15 to-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </ParallaxLayer>
            <ParallaxLayer speed={-20}>
              <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-gradient-to-br from-pink-500/20 via-rose-500/15 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            </ParallaxLayer>
            <ParallaxLayer speed={-35}>
              <div className="absolute bottom-1/3 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-violet-500/15 via-fuchsia-500/15 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
            </ParallaxLayer>
          </div>
          
          {/* Gradient Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/50 pointer-events-none" />
        </div>

        {/* Content Container with Grid Layout */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {children}
          </motion.div>
        </div>

        {/* Action Bar - Floating Bottom with Glassmorphism */}
        <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-xl shadow-teal-600/30 backdrop-blur-md flex items-center gap-2 btn-gradient-shift btn-ripple glow-on-hover border border-white/20"
          >
            <Play size={18} className="transition-transform group-hover:scale-110" />
            Run Pipeline
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="glass-card text-slate-200 px-6 py-3 rounded-xl font-semibold text-sm card-hover-subtle"
          >
            Export Data
          </motion.button>
        </div>
      </main>
    </div>
  )
}
