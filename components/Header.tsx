"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full glass-header text-slate-100"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" passHref>
            <motion.div
              className="text-accent-primary font-extrabold text-xl lg:text-2xl tracking-tight cursor-pointer"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
              whileHover={{ scale: 1.05, y: -2, color: "var(--accent-secondary)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              Quantum Market
            </motion.div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" passHref>
            <motion.div
              className="text-sm font-semibold text-accent-primary hover:text-accent-secondary transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Overview
            </motion.div>
          </Link>
          <Link href="/simulation" passHref>
            <motion.div
              className="text-sm font-semibold text-accent-primary hover:text-accent-secondary transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Simulation
            </motion.div>
          </Link>
          <Link href="/models-benchmarks" passHref>
            <motion.div
              className="text-sm font-semibold text-slate-300 hover:text-accent-primary transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Models
            </motion.div>
          </Link>
          <Link href="/portfolio-results" passHref>
            <motion.div
              className="text-sm font-semibold text-slate-300 hover:text-accent-primary transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Portfolio
            </motion.div>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-accent-primary hover:text-accent-secondary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-accent-primary/20 bg-slate-950/95 backdrop-blur-xl"
        >
          <nav className="flex flex-col px-6 py-4 space-y-3">
            <Link href="/" passHref onClick={() => setMobileMenuOpen(false)}>
              <motion.div 
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm font-semibold text-accent-primary hover:text-accent-secondary transition-all py-2 cursor-pointer"
              >
                Overview
              </motion.div>
            </Link>
            <Link href="/simulation" passHref onClick={() => setMobileMenuOpen(false)}>
              <motion.div 
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm font-semibold text-accent-primary hover:text-accent-secondary transition-all py-2 cursor-pointer"
              >
                Simulation
              </motion.div>
            </Link>
            <Link href="/models-benchmarks" passHref onClick={() => setMobileMenuOpen(false)}>
              <motion.div 
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm font-semibold text-slate-300 hover:text-accent-primary transition-all py-2 cursor-pointer"
              >
                Models
              </motion.div>
            </Link>
            <Link href="/portfolio-results" passHref onClick={() => setMobileMenuOpen(false)}>
              <motion.div 
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm font-semibold text-slate-300 hover:text-accent-primary transition-all py-2 cursor-pointer"
              >
                Portfolio
              </motion.div>
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}