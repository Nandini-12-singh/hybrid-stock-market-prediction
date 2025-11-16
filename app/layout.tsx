import type React from "react"
import "./globals.css"
import { ClientLayout } from "@/components/layout/client-layout"
import Header from "@/components/Header"
import { Inter, Space_Grotesk } from "next/font/google"

// Configure Inter for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

// Configure Space Grotesk for headings
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const metadata = {
  title: "Quantum Market | Hybrid Stock ML Bench Console",
  description: "Research-grade ensemble stock prediction benchmarking with advanced ML models",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased font-sans">
        <Header />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
