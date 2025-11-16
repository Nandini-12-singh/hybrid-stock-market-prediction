"use client"

import { PortfolioResults } from "@/components/pages/portfolio-results"
import { ViewportFade } from "@/components/animations/viewport-fade"

export default function PortfolioResultsPage() {
  return (
    <ViewportFade direction="blur" duration={0.8} amount={0.2}>
      <section className="relative glass-card gradient-section-3 rounded-2xl p-6 lg:p-8 overflow-hidden card-hover glass-glow-purple">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-indigo-500/5" />
        <div className="relative">
          <PortfolioResults />
        </div>
      </section>
    </ViewportFade>
  )
}
