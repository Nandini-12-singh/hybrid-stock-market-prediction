"use client"

import { ModelComparison } from "@/components/pages/model-comparison"
import { ViewportFade } from "@/components/animations/viewport-fade"

export default function ModelComparisonPage() {
  return (
    <ViewportFade direction="right" duration={0.7} amount={0.2}>
      <section className="relative glass-card gradient-section-3 rounded-2xl p-6 lg:p-8 overflow-hidden card-hover glass-glow-pink">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5" />
        <div className="relative">
          <ModelComparison />
        </div>
      </section>
    </ViewportFade>
  )
}
