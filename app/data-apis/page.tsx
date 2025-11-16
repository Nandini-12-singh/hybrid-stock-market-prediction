"use client"

import { DataApis } from "@/components/pages/data-apis"
import { ViewportFade } from "@/components/animations/viewport-fade"

export default function DataApisPage() {
  return (
    <ViewportFade direction="scale" duration={0.7} amount={0.2}>
      <section className="relative glass-card gradient-section-1 rounded-2xl p-6 lg:p-8 overflow-hidden card-hover glass-glow-cyan">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5" />
        <div className="relative">
          <DataApis />
        </div>
      </section>
    </ViewportFade>
  )
}
