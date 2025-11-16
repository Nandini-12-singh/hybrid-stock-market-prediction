"use client"

export function PerformanceChart() {
  const data = [
    { date: "Jan 2023", buyhold: 100, xgboost: 100, ensemble: 100 },
    { date: "Apr 2023", buyhold: 101.8, xgboost: 105.2, ensemble: 106.1 },
    { date: "Jul 2023", buyhold: 103.2, xgboost: 108.5, ensemble: 110.8 },
    { date: "Oct 2023", buyhold: 105.1, xgboost: 107.2, ensemble: 113.2 },
    { date: "Jan 2024", buyhold: 104.5, xgboost: 109.8, ensemble: 115.6 },
    { date: "Apr 2024", buyhold: 107.2, xgboost: 112.1, ensemble: 118.3 },
    { date: "Jul 2024", buyhold: 107.9, xgboost: 113.5, ensemble: 120.1 },
  ]

  // Normalize data for chart (scale to 0-100)
  const maxValue = Math.max(...data.flatMap((d) => [d.buyhold, d.xgboost, d.ensemble]))
  const normalize = (v: number) => (v / maxValue) * 100

  // Create SVG line paths
  const createPath = (values: number[]) => {
    const width = 600
    const height = 250
    const padding = 40
    const pointCount = values.length
    const pointSpacing = (width - padding * 2) / (pointCount - 1)

    return values
      .map((val, i) => {
        const x = padding + i * pointSpacing
        const y = height - padding - (normalize(val) / 100) * (height - padding * 2)
        return `${x},${y}`
      })
      .join(" ")
  }

  return (
    <div className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4">
      <svg width="100%" height="300" viewBox="0 0 680 280" className="overflow-visible">
        {/* Grid */}
        <defs>
          <pattern id="grid" width="60" height="50" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 50" fill="none" stroke="#475569" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Background with grid */}
        <rect x="40" y="20" width="600" height="220" fill="url(#grid)" opacity="0.3" />

        {/* Axes */}
        <line x1="40" y1="240" x2="640" y2="240" stroke="#64748b" strokeWidth="1" />
        <line x1="40" y1="20" x2="40" y2="240" stroke="#64748b" strokeWidth="1" />

        {/* Y-axis labels */}
        <text x="10" y="245" fontSize="12" fill="#94a3b8" textAnchor="end">
          0
        </text>
        <text x="10" y="175" fontSize="12" fill="#94a3b8" textAnchor="end">
          50
        </text>
        <text x="10" y="105" fontSize="12" fill="#94a3b8" textAnchor="end">
          100
        </text>
        <text x="10" y="35" fontSize="12" fill="#94a3b8" textAnchor="end">
          120
        </text>

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text key={i} x={40 + (600 / (data.length - 1)) * i} y="260" fontSize="11" fill="#94a3b8" textAnchor="middle">
            {d.date.split(" ")[0]}
          </text>
        ))}

        {/* Buy & Hold line */}
        <polyline
          points={createPath(data.map((d) => d.buyhold))}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* XGBoost line */}
        <polyline
          points={createPath(data.map((d) => d.xgboost))}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Ensemble line */}
        <polyline
          points={createPath(data.map((d) => d.ensemble))}
          fill="none"
          stroke="#14b8a6"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Legend */}
      <div className="flex gap-6 justify-center mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-slate-400"></div>
          <span className="text-slate-400">Buy & Hold</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-blue-400"></div>
          <span className="text-slate-400">XGBoost</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-teal-400"></div>
          <span className="text-slate-400">Proposed Ensemble</span>
        </div>
      </div>
    </div>
  )
}
