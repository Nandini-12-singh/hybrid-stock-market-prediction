"use client"

import { BaseTable } from "@/components/ui/base-table"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export function ModelComparison() {
  const [metric, setMetric] = useState<"auc" | "rmse" | "mape" | "sharpe">("auc")

  const detailedModels = [
    {
      model: "Momentum baseline",
      auc: "0.51",
      rmse: "—",
      mape: "—",
      sharpe: "0.32",
      inference: "0.1ms",
      params: "0",
    },
    {
      model: "Logistic Regression",
      auc: "0.53",
      rmse: "13.4",
      mape: "12.1%",
      sharpe: "0.42",
      inference: "0.2ms",
      params: "150",
    },
    {
      model: "Random Forest",
      auc: "0.57",
      rmse: "12.8",
      mape: "10.6%",
      sharpe: "0.58",
      inference: "2.1ms",
      params: "1.2M",
    },
    {
      model: "XGBoost",
      auc: "0.56",
      rmse: "12.2",
      mape: "10.0%",
      sharpe: "0.62",
      inference: "1.8ms",
      params: "0.8M",
    },
    {
      model: "LSTM (128 units)",
      auc: "0.59",
      rmse: "12.0",
      mape: "9.8%",
      sharpe: "0.71",
      inference: "3.2ms",
      params: "2.1M",
    },
    {
      model: "Light Transformer",
      auc: "0.61",
      rmse: "11.9",
      mape: "9.5%",
      sharpe: "0.78",
      inference: "2.8ms",
      params: "1.8M",
    },
    {
      model: "Hybrid Ensemble (proposed)",
      auc: "0.62",
      rmse: "11.2",
      mape: "9.3%",
      sharpe: "0.85",
      inference: "5.2ms",
      params: "5.9M",
    },
  ]

  const metricsDesc = {
    auc: "Receiver Operating Characteristic Area Under Curve (↑ better)",
    rmse: "Root Mean Squared Error, basis points (↓ better)",
    mape: "Mean Absolute Percentage Error (↓ better)",
    sharpe: "Simulated Sharpe Ratio on OOS test set (↑ better)",
  }

  return (
    <div className="space-y-8">
      <p className="text-slate-400 text-sm">
        Comprehensive model comparison across predictive, computational, and risk metrics. All results are out-of-sample
        (2023-2024) with identical feature engineering and holdout sets.
      </p>

      {/* Metric Selector */}
      <div className="flex gap-2 flex-wrap">
        {(["auc", "rmse", "mape", "sharpe"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              metric === m ? "bg-teal-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-400">{metricsDesc[metric]}</p>

      {/* Comparison Table */}
      <div>
        <h3 className="text-lg font-bold text-slate-50 mb-4">Full Model Comparison</h3>
        <BaseTable
          columns={["Model", "AUC", "RMSE (bps)", "MAPE", "Sharpe", "Inference (ms)", "Parameters"]}
          rows={detailedModels.map((m) => [m.model, m.auc, m.rmse, m.mape, m.sharpe, m.inference, m.params])}
          highlightLastRow
        />
      </div>

      {/* Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold text-slate-50 mb-3">Trade-offs</h3>
          <ul className="text-sm text-slate-400 space-y-2">
            <li>
              • <span className="text-amber-400">XGBoost</span>: Fast inference, good AUC
            </li>
            <li>
              • <span className="text-blue-400">LSTM</span>: Temporal context, higher latency
            </li>
            <li>
              • <span className="text-green-400">Hybrid</span>: Best Sharpe, trade-off complexity
            </li>
          </ul>
        </Card>

        <Card>
          <h3 className="font-bold text-slate-50 mb-3">Why Hybrid Wins</h3>
          <ul className="text-sm text-slate-400 space-y-2">
            <li>• Captures diverse signal sources</li>
            <li>• Meta-learner learns signal weights</li>
            <li>• Reduces single-model overfitting risk</li>
            <li>• +3% AUC vs best single model</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
