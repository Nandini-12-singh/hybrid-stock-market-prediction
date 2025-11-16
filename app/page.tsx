"use client"

import { Overview } from "@/components/pages/overview"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, Activity, Sparkles, Zap } from "lucide-react"
import { ViewportFade, StaggerContainer, StaggerItem } from "@/components/animations/viewport-fade"
import { FloatingBlobsBackground, FloatingShape } from "@/components/animations/floating-blobs"
import { ParallaxScroll, ScrollReveal } from "@/components/animations/parallax-scroll"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { Footer } from "@/components/layout/footer"

export default function Home() {
  return (
    <>
      <CursorGlow />
      <div className="space-y-16">
      {/* Redesigned Hero Section - Visually Striking Centerpiece */}
      <section className="relative -mx-6 lg:-mx-8 px-6 lg:px-8 min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Floating Gradient Blobs Background with Parallax */}
        <ParallaxScroll speed={30} className="absolute inset-0">
          <FloatingBlobsBackground />
        </ParallaxScroll>
        
        {/* Abstract Floating Shapes with Parallax Layers */}
        <ParallaxScroll speed={20}>
          <FloatingShape shape="circle" size={80} x="10%" y="15%" color="rgba(99, 102, 241, 0.3)" delay={0} />
        </ParallaxScroll>
        <ParallaxScroll speed={40}>
          <FloatingShape shape="square" size={60} x="85%" y="20%" color="rgba(236, 72, 153, 0.3)" delay={1} />
        </ParallaxScroll>
        <ParallaxScroll speed={25}>
          <FloatingShape shape="circle" size={50} x="15%" y="75%" color="rgba(6, 182, 212, 0.3)" delay={2} />
        </ParallaxScroll>
        <ParallaxScroll speed={35}>
          <FloatingShape shape="square" size={70} x="90%" y="70%" color="rgba(168, 85, 247, 0.3)" delay={1.5} />
        </ParallaxScroll>
        
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950/60" />
        
        {/* Hero Content - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center max-w-6xl mx-auto space-y-8 px-4"
        >
          {/* Animated Badge with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl glass-panel border-purple-500/30 glass-glow-purple"
          >
            <Sparkles size={20} className="text-purple-400 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI-Powered Market Intelligence
            </span>
            <Zap size={20} className="text-cyan-400 animate-pulse" />
          </motion.div>

          {/* Main Headline - Gradient & Large with Space Grotesk */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
            className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-[1.1] tracking-tight"
          >
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              Quantum Stock
            </span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-2xl mt-3">
              Market Prediction
            </span>
          </motion.h1>

          {/* Animated Subtitle with Inter Font */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto font-light tracking-wide"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Harness the power of
            </motion.span>
            {" "}
            <span className="font-semibold text-purple-300">7+ ML models</span>
            {" "}with{" "}
            <span className="font-semibold text-cyan-300">82% accuracy</span>
            {" "}
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >
              for real-time market analysis
            </motion.span>
          </motion.p>

          {/* Glassy Effect Info Boxes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {[
              { label: "ML Models", value: "7+", icon: "🧠", color: "from-indigo-500/20 to-purple-500/20" },
              { label: "Accuracy", value: "82%", icon: "🎯", color: "from-purple-500/20 to-pink-500/20" },
              { label: "Real-time", value: "Live", icon: "⚡", color: "from-cyan-500/20 to-blue-500/20" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative glass-card bg-gradient-to-br ${stat.color} rounded-2xl p-8 cursor-pointer group overflow-hidden ${
                  index === 0 ? 'glass-glow-purple' : index === 1 ? 'glass-glow-pink' : 'glass-glow-cyan'
                }`}
              >
                {/* Enhanced glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="text-5xl mb-3">{stat.icon}</div>
                  <div className="text-4xl font-black bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-slate-400 mt-2 tracking-wide">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Glowing Call-to-Action Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="pt-4"
          >
            <Link href="/simulation">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 80px rgba(168, 85, 247, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
                className="group relative inline-flex items-center gap-4 px-12 py-7 text-xl font-bold text-white rounded-2xl overflow-hidden transition-all duration-300 tracking-wide"
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                />
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/50 via-pink-400/50 to-cyan-400/50 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                
                {/* Border glow */}
                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-colors" />
                
                {/* Button content */}
                <span className="relative z-10 flex items-center gap-4">
                  <TrendingUp size={28} className="stroke-[2.5]" />
                  Start Prediction Now
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={28} className="stroke-[2.5]" />
                  </motion.div>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Overview Section with Glassmorphism and Scroll Reveal */}
      <ScrollReveal threshold={0.2}>
        <ViewportFade direction="blur" delay={0.1} duration={0.8}>
          <section className="relative glass-card gradient-section-1 rounded-2xl p-8 lg:p-12 overflow-hidden card-hover glass-glow-cyan">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-extrabold gradient-text-primary" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    Dashboard Overview
                  </h2>
                  <p className="text-base text-slate-400 mt-3 font-light tracking-wide">Real-time metrics and analytics</p>
                </div>
              </div>
              <Overview />
            </div>
          </section>
        </ViewportFade>
      </ScrollReveal>
      </div>
      <Footer />
    </>
  )
}
