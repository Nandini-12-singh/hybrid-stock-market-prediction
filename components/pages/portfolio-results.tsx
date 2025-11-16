"use client"

import { BaseTable } from "@/components/ui/base-table"
import { Card } from "@/components/ui/card"
import { PerformanceChart } from "@/components/ui/performance-chart"
import { useState } from "react"

export function PortfolioResults() {
  const [detailed, setDetailed] = useState(false)

  const portfolios = [
    { strategy: "Buy & Hold (universe EW)", annual: "7.2%", sharpe: "0.45", maxdraw: "−28%", turnover: "—" },
    {
      strategy: "XGBoost signals (no turnover ctl.)",
      annual: "9.0%",
      sharpe: "0.60",
      maxdraw: "−20%",
      turnover: "1.10",
    },
    {
      strategy: "Ensemble + turnover penalty (proposed)",
      annual: "9.2%",
      sharpe: "0.85",
      maxdraw: "−12%",
      turnover: "0.35",
    },
  ]

  const detailedMetrics = [
    { metric: "Win rate (%)", bh: "50.0", xgb: "52.1", ens: "54.3" },
    { metric: "Avg win ($)", bh: "1.25", xgb: "1.42", ens: "1.58" },
    { metric: "Avg loss ($)", bh: "1.34", xgb: "1.31", ens: "1.28" },
    { metric: "Profit factor", bh: "0.93", xgb: "1.08", ens: "1.23" },
    { metric: "Information ratio", bh: "—", xgb: "0.72", ens: "0.94" },
  ]

  return (
    <div className="space-y-8">
      <p className="text-slate-400 text-sm">
        Signals are converted to investable weights with volatility targeting, Ledoit–Wolf shrinkage, sector/name caps,
        turnover penalty, and 10 bps round-trip transaction cost.
      </p>

      {/* Portfolio Performance Table */}
      <div>
        <h3 className="text-lg font-bold text-slate-50 mb-4">Portfolio Performance (daily rebalance, 10 bps)</h3>
        <BaseTable
          columns={["Strategy", "Annual Return ↑", "Sharpe ↑", "Max Drawdown ↓", "Turnover (yr) ↓"]}
          rows={portfolios.map((p) => [p.strategy, p.annual, p.sharpe, p.maxdraw, p.turnover])}
          highlightLastRow
        />
      </div>

      {/* Chart */}
      <div>
        <h3 className="text-lg font-bold text-slate-50 mb-4">Net return vs benchmarks (simulated)</h3>
        <PerformanceChart />
      </div>

      {/* Toggle for detailed metrics */}
      <div className="flex gap-2">
        <button
          onClick={() => setDetailed(false)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            !detailed ? "bg-teal-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setDetailed(true)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            detailed ? "bg-teal-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Detailed Metrics
        </button>
      </div>

      {detailed && (
        <div>
          <h3 className="text-lg font-bold text-slate-50 mb-4">Trade-by-trade Analysis</h3>
          <BaseTable
            columns={["Metric", "B&H", "XGBoost", "Ensemble"]}
            rows={detailedMetrics.map((m) => [m.metric, m.bh, m.xgb, m.ens])}
            highlightLastRow
          />
        </div>
      )}

      {/* Note */}
      <Card className="bg-slate-800 border-slate-700">
        <p className="text-slate-300 text-sm">
          <span className="font-medium">Note:</span> Positive until ~20 bps cost; after that performance converges to
          equal-weight. Turnover control is key to net gains.
        </p>
      </Card>
    </div>
  )
}
