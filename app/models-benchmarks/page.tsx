"use client"

import { ModelsBenchmarks } from "@/components/pages/models-benchmarks"
import { ViewportFade } from "@/components/animations/viewport-fade"

export default function ModelsBenchmarksPage() {
  return (
    <ViewportFade direction="left" duration={0.7} amount={0.2}>
      <section className="relative glass-card gradient-section-2 rounded-2xl p-6 lg:p-8 overflow-hidden card-hover glass-glow-purple">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5" />
        <div className="relative">
          <ModelsBenchmarks />
        </div>
      </section>
    </ViewportFade>
  )
}
