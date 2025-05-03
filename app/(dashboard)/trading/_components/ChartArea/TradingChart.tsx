"use client"

import { useEffect, useRef } from "react"

interface CandlestickData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

interface TradingChartProps {
  priceHistory: Array<{ timestamp: number; price: number }>
  candlestickData?: CandlestickData[]
  isCandlestick?: boolean
}

export function TradingChart({ priceHistory, candlestickData = [], isCandlestick = true }: TradingChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Draw the chart whenever price history changes
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharper rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw grid lines
    ctx.strokeStyle = "#222"
    ctx.lineWidth = 1

    // Horizontal grid lines - fewer on mobile
    const horizontalLines = window.innerWidth < 768 ? 5 : 10
    for (let i = 0; i < horizontalLines; i++) {
      const y = i * (rect.height / (horizontalLines - 1))
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(rect.width, y)
      ctx.stroke()
    }

    // Vertical grid lines - fewer on mobile
    const verticalLines = window.innerWidth < 768 ? 4 : 8
    for (let i = 0; i < verticalLines; i++) {
      const x = i * (rect.width / (verticalLines - 1))
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, rect.height)
      ctx.stroke()
    }

    // If we have price history, draw the chart
    if (priceHistory.length >= 2) {
      if (isCandlestick && candlestickData.length >= 2) {
        // Draw candlestick chart
        drawCandlestickChart(ctx, candlestickData, rect)
      } else {
        // Draw line chart
        drawLineChart(ctx, priceHistory, rect)
      }
    } else {
      // Draw placeholder text if no data
      ctx.fillStyle = "#555"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Waiting for price data...", rect.width / 2, rect.height / 2)
    }
  }, [priceHistory, candlestickData, isCandlestick])

  // Function to draw candlestick chart
  const drawCandlestickChart = (ctx: CanvasRenderingContext2D, data: CandlestickData[], rect: DOMRect) => {
    // Calculate min and max prices for scaling
    const allPrices = data.flatMap((candle) => [candle.high, candle.low])
    const minPrice = Math.min(...allPrices) * 0.99 // Add 1% padding
    const maxPrice = Math.max(...allPrices) * 1.01 // Add 1% padding
    const priceRange = maxPrice - minPrice

    // Calculate candle width based on number of candles
    const candleWidth = Math.min((rect.width / data.length) * 0.8, 15)
    const spacing = Math.min((rect.width / data.length) * 0.2, 4)

    // Draw price axis on the right
    ctx.fillStyle = "#888"
    ctx.font = "10px Arial"
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (priceRange * i) / 5
      const y = rect.height - ((price - minPrice) / priceRange) * rect.height
      ctx.fillText(price.toFixed(6), rect.width - 5, y + 3)
    }

    // Draw time axis at the bottom
    ctx.textAlign = "center"
    const timeLabels = Math.min(data.length, window.innerWidth < 768 ? 3 : 5)
    for (let i = 0; i < timeLabels; i++) {
      const index = Math.floor((i * (data.length - 1)) / (timeLabels - 1))
      const x = (index / (data.length - 1)) * rect.width
      const date = new Date(data[index].timestamp)
      const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      ctx.fillText(timeStr, x, rect.height - 5)
    }

    // Draw volume bars at the bottom if volume data exists
    const volumeHeight = rect.height * 0.1
    const volumeBottom = rect.height - 20 // Leave space for time labels

    if (data[0].volume !== undefined) {
      const volumes = data.map((candle) => candle.volume || 0)
      const maxVolume = Math.max(...volumes)

      data.forEach((candle, i) => {
        if (candle.volume === undefined) return

        const x = (i / (data.length - 1)) * rect.width
        const volumeRatio = candle.volume / maxVolume
        const barHeight = volumeHeight * volumeRatio

        ctx.fillStyle = candle.close >= candle.open ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)"

        ctx.fillRect(x - candleWidth / 2, volumeBottom - barHeight, candleWidth, barHeight)
      })
    }

    // Draw each candlestick
    data.forEach((candle, i) => {
      const x = (i / (data.length - 1)) * rect.width

      // Calculate y positions
      const openY = rect.height - ((candle.open - minPrice) / priceRange) * rect.height
      const closeY = rect.height - ((candle.close - minPrice) / priceRange) * rect.height
      const highY = rect.height - ((candle.high - minPrice) / priceRange) * rect.height
      const lowY = rect.height - ((candle.low - minPrice) / priceRange) * rect.height

      // Determine if candle is up or down
      const isUp = candle.close >= candle.open

      // Set colors based on direction
      const wickColor = isUp ? "#4caf50" : "#f44336"
      const bodyColor = isUp ? "rgba(76, 175, 80, 0.8)" : "rgba(244, 67, 54, 0.8)"

      // Draw the wick (high to low line)
      ctx.strokeStyle = wickColor
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, highY)
      ctx.lineTo(x, lowY)
      ctx.stroke()

      // Draw the body (open to close rectangle)
      ctx.fillStyle = bodyColor
      const bodyTop = Math.min(openY, closeY)
      const bodyBottom = Math.max(openY, closeY)
      const bodyHeight = bodyBottom - bodyTop

      // Ensure minimum body height for visibility
      const minBodyHeight = 1
      const adjustedBodyHeight = Math.max(bodyHeight, minBodyHeight)

      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, adjustedBodyHeight)
    })
  }

  // Function to draw line chart
  const drawLineChart = (
    ctx: CanvasRenderingContext2D,
    data: Array<{ timestamp: number; price: number }>,
    rect: DOMRect,
  ) => {
    // Calculate min and max prices for scaling
    const prices = data.map((p) => p.price)
    const minPrice = Math.min(...prices) * 0.99 // Add 1% padding
    const maxPrice = Math.max(...prices) * 1.01 // Add 1% padding
    const priceRange = maxPrice - minPrice

    // Draw price line
    ctx.strokeStyle = "#4caf50"
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((point, i) => {
      const x = (i / (data.length - 1)) * rect.width
      const y = rect.height - ((point.price - minPrice) / priceRange) * rect.height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(rect.width, rect.height)
    ctx.lineTo(0, rect.height)
    ctx.closePath()

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, rect.height)
    gradient.addColorStop(0, "rgba(76, 175, 80, 0.3)")
    gradient.addColorStop(1, "rgba(76, 175, 80, 0.0)")
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw price points
    ctx.fillStyle = "#fff"
    data.forEach((point, i) => {
      if (i % (window.innerWidth < 768 ? 10 : 5) === 0 || i === data.length - 1) {
        // Draw every 5th point and the last point
        const x = (i / (data.length - 1)) * rect.width
        const y = rect.height - ((point.price - minPrice) / priceRange) * rect.height

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    })
  }

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
