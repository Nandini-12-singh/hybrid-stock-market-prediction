import { Card } from "./card"

interface MetricCardProps {
  label: string
  value: string
  detail: string
}

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <Card>
      <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-bold text-slate-50 mb-1">{value}</p>
      <p className="text-xs text-slate-500">{detail}</p>
    </Card>
  )
}
