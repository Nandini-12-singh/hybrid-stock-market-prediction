"use client"

import { useMemo, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Papa from "papaparse"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import * as Recharts from "recharts"
import { Card } from "@/components/ui/card"
import { ViewportFade, StaggerContainer, StaggerItem } from "@/components/animations/viewport-fade"
import { ParallaxLayer } from "@/components/animations/parallax-scroll"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { AnimatedLoader } from "@/components/effects/animated-loader"
import { Footer } from "@/components/layout/footer"

type PredictResponse = {
  prediction: number
  meta?: { 
    normalizedPred?: number
    timesteps?: number
    lastClose?: number
  }
  series?: {
    close: number[]
    rsi: number[]
    macd: number[]
  }
  metrics?: {
    rmse?: number
    mae?: number
    directionalAccuracy?: number
  }
}

function parseCsvToNumbers(csv: string): number[] {
  return csv
    .split(/\s*,\s*/)
    .map((s) => parseFloat(s))
    .filter((n) => Number.isFinite(n))
}

export default function SimulationPage() {
  const [input, setInput] = useState<string>("")
  const [ticker, setTicker] = useState<string>("")
  const [series, setSeries] = useState<number[]>([])
  const [rsiSeries, setRsiSeries] = useState<number[]>([])
  const [macdSeries, setMacdSeries] = useState<number[]>([])
  const [predicted, setPredicted] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"manual" | "ticker">("manual")
  const [openPanel, setOpenPanel] = useState<null | "architecture" | "scaler" | "raw">(null)
  const [normalizedData, setNormalizedData] = useState<number[] | null>(null)
  const [chartView, setChartView] = useState<"price" | "macd">("price")
  const [soundPing, setSoundPing] = useState<number>(0)
  const [metrics, setMetrics] = useState<{ rmse?: number; mae?: number; directionalAccuracy?: number } | null>(null)

  const chipsContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }
  const chipVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0 },
  }

  const historicalData = useMemo(() => {
    return series.map((v, i) => ({ idx: i + 1, value: v }))
  }, [series])

  const predictedPoint = useMemo(() => {
    if (predicted == null || series.length === 0) return []
    return [{ idx: series.length + 1, value: predicted }]
  }, [predicted, series])

  async function runSimulation() {
    setError(null)
    setPredicted(null)
    setLoading(true)
    try {
      let requestBody;
      
      if (mode === "ticker") {
        if (!ticker.trim()) {
          throw new Error("Please enter a valid stock ticker symbol.")
        }
        requestBody = { ticker: ticker.trim().toUpperCase() }
      } else {
        const values = parseCsvToNumbers(input)
        if (values.length < 60) {
          throw new Error("Please provide at least 60 comma-separated price points.")
        }
        // Use the last 60 values if more were provided
        const last60 = values.slice(-60)
        setSeries(last60)
        requestBody = { data: last60 }
      }
      
      const res = await fetch("http://localhost:3001/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to get prediction")
      }

      const responseData = await res.json() as PredictResponse
      setPredicted(responseData.prediction)
      setMetrics(responseData.metrics ?? null)
      
      // Debug: Log received data
      console.log('Response Data:', {
        close: responseData.series?.close,
        rsi: responseData.series?.rsi,
        macd: responseData.series?.macd
      })
      
      // Update all series with the historical data
      if (responseData.series) {
        setSeries(responseData.series.close || [])
        setRsiSeries(responseData.series.rsi || [])
        setMacdSeries(responseData.series.macd || [])
      } else if (mode === "ticker") {
        setSeries(requestBody.data || [])
      }
    } catch (e: any) {
      setError(e?.message || "Failed to run simulation.")
    } finally {
      setLoading(false)
    }
  }

  const chartConfig = {
    historical: { label: "Historical", color: "hsl(var(--chart-1))" },
    predicted: { label: "Predicted", color: "#ef4444" },
  }

  const MIN = 50.694803
  const MAX = 199.957651
  function normalize(values: number[]) {
    const range = MAX - MIN
    return values.map((v) => (v - MIN) / range)
  }

  function handleToggle(panel: "architecture" | "scaler" | "raw") {
    setOpenPanel((prev) => (prev === panel ? null : panel))
    if (panel === "raw") {
      const values = parseCsvToNumbers(input)
      const last60 = (values.length >= 60 ? values.slice(-60) : values)
      setNormalizedData(normalize(last60))
    }
  }

  function SystemSwitch() {
    const isManual = mode === "manual"
    return (
      <div className="system-switch">
        <motion.div
          className="indicator"
          initial={false}
          animate={{ x: isManual ? 4 : '50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        />
        <button
          type="button"
          className={`segment ${isManual ? 'segment-active bg-[var(--color-neon-primary)]' : ''}`}
          onClick={() => { setMode('manual'); setSoundPing((p) => p + 1) }}
        >
          Manual
        </button>
        <button
          type="button"
          className={`segment ${!isManual ? 'segment-active bg-[var(--color-neon-primary)]' : ''}`}
          onClick={() => { setMode('ticker'); setSoundPing((p) => p + 1) }}
        >
          Ticker
        </button>
        {/* Visual placeholder for sound: quick glow ping */}
        <AnimatePresence>
          <motion.span
            key={soundPing}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-2 -right-2 h-2 w-2 rounded-full bg-[var(--color-neon-primary)] shadow-[0_0_12px_rgba(0,255,192,0.7)]"
          />
        </AnimatePresence>
      </div>
    )
  }

  return (
    <>
      <CursorGlow />
      <AnimatedLoader isLoading={loading} />
      <ViewportFade direction="scale" duration={0.8}>
        <div className="relative">
        {/* Enhanced Gradient Background Section with Parallax */}
        <section className="relative rounded-2xl overflow-hidden glass-card shadow-xl">
          {/* Multi-layered Gradient Background with Parallax */}
          <div className="absolute inset-0 gradient-bg-animated opacity-60 pointer-events-none" />
          <ParallaxLayer speed={-15} className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
          </ParallaxLayer>
          <ParallaxLayer speed={-25} className="absolute top-0 right-0 w-96 h-96 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-full blur-3xl" />
          </ParallaxLayer>
          <ParallaxLayer speed={-20} className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-tr from-fuchsia-500/20 to-purple-500/10 rounded-full blur-3xl" />
          </ParallaxLayer>
          
          <div className="relative p-8 lg:p-12">
            <div className="mx-auto w-full max-w-7xl space-y-8">
              {/* Page Title with Modern Typography */}
              <ViewportFade direction="down" delay={0.1}>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-50 text-center gradient-text-primary" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                  Model Simulation & Visualization
                </h1>
                <p className="text-center text-slate-400 mt-3 font-light tracking-wide">Run AI-powered stock predictions with real-time analysis</p>
              </ViewportFade>

              <div className="lg:flex lg:space-x-8 space-y-8 lg:space-y-0">
                <StaggerContainer className="lg:w-1/3 space-y-6" staggerDelay={0.15}>
                  {/* Input Card with Glassmorphism */}
                  <StaggerItem>
                    <Card className="glass-card p-6 space-y-4 shadow-xl glass-glow-cyan card-hover">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-slate-50 gradient-text-primary" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Simulation Input</h2>
            <div className="space-y-4">
              {/* Stylized System Switch */}
              <SystemSwitch />

              {mode === "ticker" ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Enter a stock ticker symbol (e.g., AAPL, MSFT, GOOGL)
                  </p>
                  <div className="neon-field">
                  <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="Enter stock ticker..."
                    className="neon-input font-mono w-full px-3 py-2 rounded-lg text-slate-200 placeholder-slate-500 shadow-inner outline-none transition-transform hover:scale-[1.01]"
                    maxLength={5}
                  />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Paste a comma-separated list of at least 60 historical price points or drop a CSV file.
                  </p>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onDrop={async (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      
                      const file = e.dataTransfer?.files?.[0]
                      if (file && file.type === "text/csv") {
                        const text = await file.text()
                        Papa.parse(text, {
                          header: true,
                          dynamicTyping: true,
                          complete: (results) => {
                            const closeValues = results.data
                              .map((row: any) => row.Close || row.close || row.CLOSE)
                              .filter((val: any) => typeof val === "number" && !isNaN(val))
                            
                            if (closeValues.length > 0) {
                              const last60 = closeValues.slice(-60).join(", ")
                              setInput(last60)
                              setError("CSV loaded successfully! 60 prices extracted from the 'Close' column.")
                            } else {
                              setError("No valid 'Close' price column found in the CSV file.")
                            }
                          },
                          error: (error: Error) => {
                            setError(`Failed to parse CSV: ${error.message}`)
                          }
                        })
                      } else {
                        setError("Please drop a valid CSV file.")
                      }
                    }}
                    className="neon-field relative w-full h-40 rounded-lg border border-slate-800 bg-slate-900/60 p-3 focus-within:ring-2 focus-within:ring-teal-500 transition-transform hover:scale-[1.01]"
                  >
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="e.g. 120.3, 121.0, 119.8, ... or drag & drop a CSV file here"
                      className="neon-input font-mono w-full h-full resize-none bg-transparent outline-none text-sm text-slate-200"
                    />
                    {!input && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-sm text-muted-foreground text-center">
                          <p>Drag & drop a CSV file here</p>
                          <p className="text-xs mt-1">or paste comma-separated values</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {error ? (
            <div className="system-alert mt-2 text-sm">{error}</div>
          ) : null}
          <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={runSimulation}
              disabled={loading}
              className="w-full py-4 text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl shadow-xl shadow-teal-600/30 backdrop-blur-md border border-white/20 btn-gradient-shift btn-ripple glow-on-hover disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {loading ? "Initializing • Processing" : "Run Prediction Simulation"}
            </button>
          </motion.div>
        </Card>
                  </StaggerItem>
                </StaggerContainer>

                <StaggerContainer className="lg:w-2/3 space-y-6" staggerDelay={0.15}>
                  {/* Output & Charts Card with Glassmorphism */}
                  <StaggerItem>
                    <Card className="glass-card p-6 lg:p-8 space-y-6 shadow-xl glass-glow-purple card-hover">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-slate-50 gradient-text-primary" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Prediction Output</h2>
                      {/* Central Result Card with modern glass effect */}
                      <div className="flex items-center justify-center">
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="w-full max-w-3xl glass-panel rounded-2xl border-2 border-teal-500/30 glass-glow-cyan p-10 min-h-[200px] flex items-center justify-center"
                        >
                          {predicted != null ? (
                            <div className="text-center">
                              <div className="text-5xl lg:text-6xl font-black tracking-tight neon-text" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                                ${predicted.toFixed(2)}
                              </div>
                              <div className="text-sm text-slate-400 mt-2 font-light">Predicted Stock Price</div>
                            </div>
                          ) : (
                            <div className="text-center text-slate-400 py-8">
                              <p className="text-lg font-medium mb-2">Run a simulation to see the predicted price</p>
                              <p className="text-sm text-slate-500">Enter ticker or manual data above</p>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </div>

          {/* Main Price Chart */}
          <ChartContainer className="h-[320px]" config={chartConfig}>
            <Recharts.LineChart 
              data={historicalData} 
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              style={{ background: 'transparent' }}
            >
              <Recharts.CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.22)" />
              <Recharts.XAxis 
                dataKey="idx" 
                tick={{ fontSize: 12, fill: '#94a3b8' }} 
                axisLine={{ stroke: '#334155' }}
                label={{ value: 'Time Period', position: 'bottom', offset: 0 }}
              />
              <Recharts.YAxis 
                tick={{ fontSize: 12, fill: '#94a3b8' }} 
                axisLine={{ stroke: '#334155' }}
                domain={['auto', 'auto']}
                label={{ 
                  value: 'Price ($)', 
                  angle: -90, 
                  position: 'left',
                  offset: 10
                }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />} 
                formatter={(value: number, name: string) => {
                  if (name === "Price") return [`$${value.toFixed(2)}`, name];
                  if (name === "Predicted") return [`$${value.toFixed(2)}`, name];
                  return [value, name];
                }}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Recharts.Line 
                type="monotone" 
                dataKey="value" 
                name="Price" 
                stroke="#00ffc0" 
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
              {predictedPoint.length > 0 && (
                <Recharts.Scatter 
                  data={predictedPoint} 
                  name="Predicted" 
                  fill="#ff00ff"
                  stroke="#ff00ff"
                  fillOpacity={1}
                />
              )}
            </Recharts.LineChart>
          </ChartContainer>

          {/* RSI Sub-Chart */}
          {rsiSeries.length > 0 && (
            <ChartContainer className="h-[180px]" config={chartConfig}>
              <Recharts.LineChart 
                data={historicalData.map((d, i) => ({ ...d, rsi: rsiSeries[i] }))}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                syncId="stockCharts"
                style={{ background: 'transparent' }}
              >
                <Recharts.CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.22)" />
                <Recharts.XAxis 
                  dataKey="idx" 
                  tick={{ fontSize: 12, fill: '#94a3b8' }} 
                  axisLine={{ stroke: '#334155' }}
                  label={{ value: 'Time Period', position: 'bottom', offset: 0 }}
                />
                <Recharts.YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={{ stroke: '#334155' }}
                  ticks={[0, 30, 50, 70, 100]} 
                  label={{ value: 'RSI', angle: -90, position: 'left', offset: 10 }}
                />
                <Recharts.ReferenceLine 
                  y={70} 
                  stroke="#ff3b3b" 
                  strokeDasharray="4 4" 
                  label={{ value: 'Overbought (70)', position: 'right', fill: '#ff3b3b' }}
                />
                <Recharts.ReferenceLine 
                  y={30} 
                  stroke="#ffd400" 
                  strokeDasharray="4 4" 
                  label={{ value: 'Oversold (30)', position: 'right', fill: '#ffd400' }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`${value.toFixed(2)}`, 'RSI']}
                />
                 <Recharts.Line 
                   type="monotone" 
                   dataKey="rsi" 
                   name="RSI" 
                   stroke="#00d9ff" 
                   strokeWidth={2}
                   dot={false}
                   isAnimationActive={true}
                 />
              </Recharts.LineChart>
            </ChartContainer>
          )}
        </Card>

                  </StaggerItem>
                </StaggerContainer>
              </div>
            </div>
          </div>
      
          {/* Model Features & Options as Data Chips */}
          <ViewportFade direction="up" delay={0.3}>
            <Card className="glass-card p-6 lg:p-8 space-y-4 shadow-xl glass-glow-purple mt-8">
              <h2 className="text-2xl font-bold text-slate-50 gradient-text-primary" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Model Features & Options</h2>
        <motion.div
          variants={chipsContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-3"
        >
          <motion.button
            variants={chipVariants}
            type="button"
            onClick={() => handleToggle("architecture")}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`glass-button rounded-xl px-5 py-3 text-sm font-semibold transition-all ${openPanel === "architecture" ? 'border-teal-500/60 shadow-lg shadow-teal-500/30' : ''}`}
          >
            <span className="neon-text">Model Architecture</span>
            <span className="ml-2 text-slate-400">(LSTM / 60 Steps)</span>
          </motion.button>
          <motion.button
            variants={chipVariants}
            type="button"
            onClick={() => handleToggle("scaler")}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`glass-button rounded-xl px-5 py-3 text-sm font-semibold transition-all ${openPanel === "scaler" ? 'border-purple-500/60 shadow-lg shadow-purple-500/30' : ''}`}
          >
            <span className="neon-text">Scaler Range</span>
            <span className="ml-2 text-slate-400">($50.69 - $199.95)</span>
          </motion.button>
          <motion.button
            variants={chipVariants}
            type="button"
            onClick={() => handleToggle("raw")}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`glass-button rounded-xl px-5 py-3 text-sm font-semibold transition-all ${openPanel === "raw" ? 'border-cyan-500/60 shadow-lg shadow-cyan-500/30' : ''}`}
          >
            <span className="neon-text">Show Raw Normalized Data</span>
          </motion.button>
        </motion.div>
        <AnimatePresence mode="wait">
          {openPanel === "architecture" && (
            <motion.div
              key="panel-architecture"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 rounded-md border border-slate-800 p-3 text-sm bg-slate-900/80 text-slate-200"
            >
              This model uses a Stacked LSTM network that processes 60 days of multivariate data:
              • Price: Historical closing prices
              • RSI (Relative Strength Index): Momentum indicator (0-100)
              • MACD: Trend indicator showing momentum shifts
              The model combines these features to generate a single-day price forecast.
            </motion.div>
          )}
          {openPanel === "scaler" && (
            <motion.div
              key="panel-scaler"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 rounded-md border border-slate-800 p-3 text-sm bg-slate-900/80 text-slate-200"
            >
              Normalization is applied using Min-Max scaling based on the training range: Min: 50.694803 and Max: 199.957651.
            </motion.div>
          )}
          {openPanel === "raw" && (
            <motion.div
              key="panel-raw"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 rounded-md border border-slate-800 p-3 text-sm bg-slate-900/80 text-slate-200"
            >
              <div className="mb-2">Normalized Input (last 60):</div>
              <pre className="text-xs whitespace-pre-wrap break-all">
                {JSON.stringify(normalizedData ?? [], null, 2)}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-xs text-muted-foreground">
          These controls are illustrative and do not affect backend inference.
        </p>
            </Card>
          </ViewportFade>
        </section>
        </div>
      </ViewportFade>
      <Footer />
    </>
  )
}