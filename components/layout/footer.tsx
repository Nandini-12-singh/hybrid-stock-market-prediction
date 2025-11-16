"use client"

import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react"
import Link from "next/link"

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub", color: "hover:text-slate-300" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter", color: "hover:text-cyan-400" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn", color: "hover:text-blue-400" },
  { icon: Mail, href: "mailto:contact@example.com", label: "Email", color: "hover:text-purple-400" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-20 border-t border-slate-800/50 glass-nav">
      {/* Animated Gradient Divider */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-6">
          {/* Brand/Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 
              className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Quantum Market
            </h3>
          </motion.div>

          {/* Animated Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-6"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.3 + index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.2, 
                  y: -4,
                  rotate: [0, -10, 10, 0],
                }}
                whileTap={{ scale: 0.9 }}
                className={`glass-button p-3 rounded-xl transition-colors ${social.color}`}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm"
          >
            {["Overview", "Data & APIs", "Models", "Portfolio", "Simulation"].map((item, index) => (
              <motion.div
                key={item}
                whileHover={{ x: 4 }}
                className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                {item}
              </motion.div>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center text-sm text-slate-500"
          >
            <div className="flex items-center gap-2 justify-center">
              <span>© {currentYear} Quantum Market. Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart size={14} className="text-pink-500 fill-pink-500" />
              </motion.div>
              <span>for traders</span>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-xs text-slate-600 text-center max-w-2xl"
          >
            AI-powered stock market prediction platform with 95% accuracy using 7+ ML models
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </footer>
  )
}
