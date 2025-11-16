import type { ReactNode } from "react"

export function StatCard({
  label,
  value,
  change,
  icon,
  color = "teal",
}: {
  label: string
  value: string | number
  change?: { value: string; positive: boolean }
  icon?: ReactNode
  color?: "teal" | "green" | "amber" | "red" | "blue"
}) {
  const colorMap = {
    teal: "text-teal-400 bg-teal-500/10",
    green: "text-green-400 bg-green-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    red: "text-red-400 bg-red-500/10",
    blue: "text-blue-400 bg-blue-500/10",
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-50">{value}</p>
          {change && (
            <p className={`text-xs mt-2 ${change.positive ? "text-green-400" : "text-red-400"}`}>
              {change.positive ? "↑" : "↓"} {change.value}
            </p>
          )}
        </div>
        {icon && <div className={`text-2xl ${colorMap[color]} p-2 rounded`}>{icon}</div>}
      </div>
    </div>
  )
}
