"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal } from "lucide-react"
import { ChartHeader } from "./ChartHeader"
import { TradingChart } from "./TradingChart"
import { formatPrice } from "../../utils"
import type { MarketData, PairData } from "../../types"

interface ChartAreaProps {
  marketData: MarketData
  pairData: PairData | null
  botRunning: boolean
  priceHistory: Array<{ timestamp: number; price: number }>
  strategyMode?: string
}

export function ChartArea({ marketData, pairData, botRunning, priceHistory, strategyMode }: ChartAreaProps) {
  const [chartType, setChartType] = useState<"line" | "candlestick">("candlestick")
  const [timeframe, setTimeframe] = useState("1h")
  const [candlestickData, setCandlestickData] = useState<any[]>([])

  // Convert price history to candlestick data
  useEffect(() => {
    if (priceHistory.length === 0) return

    // Group price points into timeframe buckets
    const timeframeMs = timeframe === "1h" ? 3600000 : 300000 // 1h or 5m in milliseconds
    const buckets: Record<string, any[]> = {}

    priceHistory.forEach((point) => {
      // Round timestamp to nearest timeframe
      const bucketTime = Math.floor(point.timestamp / timeframeMs) * timeframeMs
      if (!buckets[bucketTime]) {
        buckets[bucketTime] = []
      }
      buckets[bucketTime].push(point)
    })

    // Convert buckets to candlestick data
    const candles = Object.entries(buckets)
      .map(([timestamp, points]) => {
        const prices = points.map((p) => p.price)
        return {
          timestamp: Number.parseInt(timestamp),
          open: prices[0],
          high: Math.max(...prices),
          low: Math.min(...prices),
          close: prices[prices.length - 1],
          volume: points.length * (Math.random() * 1000 + 500), // Simulate volume
          time: new Date(Number.parseInt(timestamp)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)

    setCandlestickData(candles)
  }, [priceHistory, timeframe])

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe)
  }

  // Handle chart type change
  const handleChartTypeChange = (type: "candlestick" | "line") => {
    setChartType(type)
  }

  return (
    <div className="flex-1 flex flex-col bg-[#121212] h-full overflow-hidden">
      <ChartHeader
        pairData={pairData}
        botRunning={botRunning}
        strategyMode={strategyMode}
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        chartType={chartType}
        onChartTypeChange={handleChartTypeChange}
      />

      {/* Chart area */}
      <div className="flex-1 p-2 md:p-4 overflow-hidden">
        {!botRunning && priceHistory.length === 0 ? (
          // Empty chart state
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="text-base md:text-xl mb-2">No Active Trading Session</div>
            <div className="text-xs md:text-sm">Start the bot to view market data and trading chart</div>
          </div>
        ) : (
          // Active chart with data
          <div className="h-full flex flex-col">
            
            {/* Trading chart - add animation for better visual feedback */}
            <div className="flex-1 bg-[#121212] border border-[#222] rounded relative min-h-[300px] animate-in fade-in duration-300">
               <iframe
          src="hhttps://dexscreener.com/solana/37iwfsqgntsafshobtbzqghwsttkwazw3yvzgjwkn6ik?embed=1&theme=dark&trades=0&info=0"
          width="100%"
          height="500px"
          loading="lazy"
          title="Dexscreener Chart"
          className="w-full"
        >
        </iframe> 
 
            </div>
 
          </div>
        )}
      </div>
    </div>
  )
}
