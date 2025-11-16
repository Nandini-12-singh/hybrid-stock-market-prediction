import { BaseTable } from "@/components/ui/base-table"
import { Card } from "@/components/ui/card"

export function ModelsBenchmarks() {
  const models = [
    { model: "Momentum baseline", accuracy: "0.51", auc: "0.51", rmse: "—", mape: "—" },
    { model: "Logistic Regression", accuracy: "0.54", auc: "0.53", rmse: "13.4", mape: "12.1%" },
    { model: "Random Forest", accuracy: "0.57", auc: "0.57", rmse: "12.8", mape: "10.6%" },
    { model: "XGBoost/LightGBM", accuracy: "0.52–0.56", auc: "0.56", rmse: "12.2", mape: "10.0%" },
    { model: "LSTM / Light Transformer", accuracy: "0.56–0.60", auc: "0.59–0.61", rmse: "12.0", mape: "9.8%" },
    { model: "Hybrid Ensemble (proposed)", accuracy: "0.58", auc: "0.62", rmse: "11.2", mape: "9.3%" },
  ]

  const ablation = ["Removing sequence block → AUC −0.03", "Simple averaging (no stacker) → AUC −0.02"]

  return (
    <div className="space-y-8">
      <p className="text-slate-400 text-sm">
        We compare single learners vs a stacked hybrid ensemble on out-of-sample, daily 2018–2024 data. Metrics are
        hardcoded from the paper to match result analysis.
      </p>

      {/* Performance Table */}
      <div>
        <h3 className="text-lg font-bold text-slate-50 mb-4">Predictive Performance (OOS)</h3>
        <BaseTable
          columns={["Model", "Accuracy ↑", "ROC–AUC ↑", "RMSE (×10⁻²) ↓", "MAPE ↓"]}
          rows={models.map((m) => [m.model, m.accuracy, m.auc, m.rmse, m.mape])}
          highlightLastRow
        />
      </div>

      {/* Model Stack */}
      <Card>
        <h3 className="font-bold text-slate-50 mb-3">Model Stack</h3>
        <ul className="text-sm text-slate-400 space-y-2">
          <li>
            • <span className="font-medium">GBDT</span> for tabular non-linear signals
          </li>
          <li>
            • <span className="font-medium">Shallow NN</span> for interaction effects
          </li>
          <li>
            • <span className="font-medium">Sequence block</span> for short-term temporal context
          </li>
          <li>
            • <span className="font-medium">Meta-learner</span> (ridge/logistic) on OOF preds
          </li>
        </ul>
      </Card>

      {/* Ablation Summary */}
      <Card>
        <h3 className="font-bold text-slate-50 mb-3">Ablation Summary</h3>
        <ul className="text-sm text-slate-400 space-y-2">
          {ablation.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
