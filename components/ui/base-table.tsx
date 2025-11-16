interface BaseTableProps {
  columns: string[]
  rows: (string | number)[][]
  highlightLastRow?: boolean
}

export function BaseTable({ columns, rows, highlightLastRow }: BaseTableProps) {
  return (
    <div className="overflow-x-auto border border-slate-700 rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 border-b border-slate-700">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-3 text-left font-medium text-slate-300 whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-slate-700 transition-colors ${
                highlightLastRow && i === rows.length - 1
                  ? "bg-teal-900 bg-opacity-20"
                  : i % 2 === 0
                    ? "bg-slate-800 bg-opacity-40"
                    : "bg-slate-800 bg-opacity-20"
              } hover:bg-slate-700 hover:bg-opacity-50`}
            >
              {row.map((cell, j) => (
                <td key={j} className="px-6 py-4 text-slate-300 font-mono">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
