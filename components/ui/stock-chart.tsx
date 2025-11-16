'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
  ReferenceLine,
} from 'recharts'
import { cn } from '@/lib/utils'

interface StockChartProps {
  data: any[]
  predictedPoint?: {
    date: string
    value: number
  }
  className?: string
}

export function StockChart({
  data,
  predictedPoint,
  className,
}: StockChartProps) {
  const darkModeColors = {
    background: 'rgba(0, 0, 0, 0.5)',
    grid: 'rgba(255, 255, 255, 0.1)',
    axis: 'rgba(255, 255, 255, 0.5)',
    line: '#6E21D7', // Electric Violet
    prediction: '#3AB3F5', // Neon Blue
    rsiLine: '#3AB3F5',
    macdLine: '#6E21D7',
    signalLine: '#3AB3F5',
    overbought: 'rgba(239, 68, 68, 0.5)', // Red
    oversold: 'rgba(234, 179, 8, 0.5)', // Yellow
  }

  return (
    <div className={cn(
      "rounded-lg border border-[#6E21D7]/30 bg-background/50 p-4",
      "backdrop-blur-sm shadow-lg",
      className
    )}>
      {/* Main Price Chart */}
      <div className="h-[300px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6E21D7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6E21D7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkModeColors.grid}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke={darkModeColors.axis}
              tick={{ fill: darkModeColors.axis }}
            />
            <YAxis
              stroke={darkModeColors.axis}
              tick={{ fill: darkModeColors.axis }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(110, 33, 215, 0.3)',
                borderRadius: '6px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={darkModeColors.line}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
            {predictedPoint && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={6}
                  fill={darkModeColors.prediction}
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(58, 179, 245, 0.5))',
                  }}
                />
              </motion.g>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* RSI Chart */}
      <div className="h-[150px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkModeColors.grid}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke={darkModeColors.axis}
              tick={{ fill: darkModeColors.axis }}
            />
            <YAxis
              stroke={darkModeColors.axis}
              tick={{ fill: darkModeColors.axis }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(110, 33, 215, 0.3)',
                borderRadius: '6px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <ReferenceLine
              y={70}
              stroke={darkModeColors.overbought}
              strokeDasharray="3 3"
            />
            <ReferenceLine
              y={30}
              stroke={darkModeColors.oversold}
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="rsi"
              stroke={darkModeColors.rsiLine}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* MACD Chart */}
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkModeColors.grid}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke={darkModeColors.axis}
              tick={{ fill: darkModeColors.axis }}
            />
            <YAxis
              stroke={darkModeColors.axis}
              tick={{ fill: darkModeColors.axis }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(110, 33, 215, 0.3)',
                borderRadius: '6px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="macd"
              stroke={darkModeColors.macdLine}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="signal"
              stroke={darkModeColors.signalLine}
              strokeDasharray="3 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}