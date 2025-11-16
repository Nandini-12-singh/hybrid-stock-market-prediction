'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

const TickerInput = React.forwardRef<HTMLInputElement, TickerInputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-md border border-[#6E21D7] bg-background px-3 py-2 text-sm shadow-sm transition-colors",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3AB3F5] focus-visible:border-[#6E21D7]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:border-[#6E21D7]/80",
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && (
          <div className="absolute right-3 top-3 text-gray-400">
            {icon}
          </div>
        )}
      </div>
    )
  }
)
TickerInput.displayName = "TickerInput"

export { TickerInput }