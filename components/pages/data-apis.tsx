import { BaseTable } from "@/components/ui/base-table"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"

export function DataApis() {
  const sources = [
    { source: "Alpha Vantage", type: "intraday/daily OHLCV", freq: "1–5 min/daily", limit: "5 req/min free" },
    { source: "yfinance", type: "historical OHLCV", freq: "daily", limit: "no real-time push" },
    { source: "Finnhub", type: "intraday + sentiment", freq: "1 min/daily", limit: "limited free quota" },
    { source: "Twelve Data", type: "intraday & fundamentals", freq: "1 min/daily", limit: "freemium tier" },
    { source: "Kaggle", type: "backfills + sentiment", freq: "multi-year", limit: "offline only" },
  ]

  const features = [
    { category: "Price/Technical", items: "returns (multi-horizon), RSI, MACD, SMA/EMA, Bollinger" },
    { category: "Volume", items: "rel volume, spikes" },
    { category: "Fundamentals", items: "EPS, dividend yield, P/E" },
    { category: "Sentiment proxies", items: "news counts, FinancialPhraseBank sentiment" },
  ]

  return (
    <div className="space-y-8">
      {/* Sources Table */}
      <div>
        <h3 className="text-lg font-bold text-slate-50 mb-4">Data Sources (Simulated)</h3>
        <BaseTable
          columns={["Source", "Data type", "Freq", "Limitation"]}
          rows={sources.map((s) => [s.source, s.type, s.freq, s.limit])}
        />
      </div>

      {/* Alert */}
      <Alert
        title="Rate-limit strategy"
        message="Use caching + provider rotation + missing-bar imputation. Required when using only free tiers."
      />

      {/* Features */}
      <div>
        <h3 className="text-lg font-bold text-slate-50 mb-4">Feature Set (live-safe)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <Card key={i}>
              <h4 className="font-semibold text-slate-50 mb-2">{f.category}</h4>
              <p className="text-sm text-slate-400">{f.items}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
