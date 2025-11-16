"use client"

import { MetricCard } from "@/components/ui/metric-card"
import { BaseTable } from "@/components/ui/base-table"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export function Overview() {
  const [tab, setTab] = useState<"runs" | "metrics">("runs")

  const runs = [
    { id: "RUN-5911", task: "Next-day direction", split: "WF-2023Q4", auc: "0.62", sharpe: "0.85", status: "✅" },
    { id: "RUN-369", task: "Next-day return (reg)", split: "WF-2024Q1", auc: "—", sharpe: "0.79", status: "✅" },
    { id: "RUN-4688", task: "Stress: 20 bps cost", split: "WF-2024Q2", auc: "0.60", sharpe: "0.72", status: "⚠" },
    { id: "RUN-4890", task: "Sector rotation", split: "WF-2024Q3", auc: "0.65", sharpe: "0.91", status: "✅" },
  ]

  const systemMetrics = [
    { name: "Average inference time", value: "1.8ms", detail: "per batch" },
    { name: "Data quality score", value: "94.2%", detail: "across all sources" },
    { name: "Model stability", value: "0.87", detail: "Spearman rank correlation" },
  ]

  return (
    <div className="space-y-8">
      {/* Key Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <MetricCard label="Pipeline status" value="Ready" detail="1.8s batch latency" />
        <MetricCard label="Universe" value="150 stocks" detail="S&P 500 (2018–2024)" />
        <MetricCard label="Data tier" value="Free/Freemium" detail="Alpha Vantage, yfinance" />
        <MetricCard label="Model accuracy" value="0.62 AUC" detail="Latest ensemble run" />
      </div>

      {/* System Description & Key Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-slate-50 mb-4">System Architecture</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-3">
            Hybrid ensemble combining: Gradient-Boosted Trees (XGBoost/LightGBM), Shallow NN, and Sequence block
            (LSTM/Light Transformer). Stacked with a meta-learner using time-aware, purged/embargoed CV.
          </p>
          <div className="text-xs bg-slate-800 rounded p-2 text-teal-300">Last retrained: 2024-12-01 15:32 UTC</div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-slate-50 mb-4">Key Questions</h3>
          <ul className="text-sm text-slate-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-teal-400">✓</span> Does ensemble beat single models?
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400">✓</span> Does turnover control preserve performance?
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400">✓</span> Can free APIs support near-real-time runs?
            </li>
          </ul>
        </Card>
      </div>

      {/* Tabs for Latest Runs and System Metrics */}
      <div>
        <div className="flex gap-4 mb-4 border-b border-slate-800">
          <button
            onClick={() => setTab("runs")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              tab === "runs" ? "text-teal-400 border-b-2 border-teal-400" : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Latest Runs
          </button>
          <button
            onClick={() => setTab("metrics")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              tab === "metrics" ? "text-teal-400 border-b-2 border-teal-400" : "text-slate-400 hover:text-slate-300"
            }`}
          >
            System Metrics
          </button>
        </div>

        {tab === "runs" && (
          <div>
            <h3 className="text-lg font-bold text-slate-50 mb-4">Latest simulated runs</h3>
            <BaseTable
              columns={["Run ID", "Task", "Split", "AUC", "Sharpe", "Status"]}
              rows={runs.map((r) => [r.id, r.task, r.split, r.auc, r.sharpe, r.status])}
            />
          </div>
        )}

        {tab === "metrics" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {systemMetrics.map((m) => (
              <Card key={m.name}>
                <p className="text-slate-400 text-sm mb-2">{m.name}</p>
                <p className="text-3xl font-bold text-teal-400 mb-1">{m.value}</p>
                <p className="text-slate-500 text-xs">{m.detail}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
