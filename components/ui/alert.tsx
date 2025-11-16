interface AlertProps {
  title: string
  message: string
}

export function Alert({ title, message }: AlertProps) {
  return (
    <div className="bg-amber-900 bg-opacity-30 border border-amber-700 border-opacity-50 rounded-lg p-4">
      <h4 className="font-semibold text-amber-200 mb-1">{title}</h4>
      <p className="text-sm text-amber-100">{message}</p>
    </div>
  )
}
