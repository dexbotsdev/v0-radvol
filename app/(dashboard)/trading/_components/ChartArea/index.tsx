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
            <div className="flex justify-between items-center mb-2 md:mb-4">
              <div className="text-lg md:text-2xl font-medium">
                ${pairData ? formatPrice(pairData.priceUsd) : "0.00"}
              </div>
              <div className="flex items-center">
                <div className="bg-[#1e1e1e] rounded px-2 py-1 flex items-center mr-2 text-xs md:text-sm">
                  <span
                    className={`${
                      // Add null check for priceChange and h24
                      pairData?.priceChange?.h24 && pairData.priceChange.h24 >= 0 ? "text-green-500" : "text-[#f44336]"
                    } font-medium mr-1`}
                  >
                    {/* Add null check for priceChange and h24 */}
                    {Number(pairData?.priceChange?.h24 || 0) >= 0 ? "+" : ""}
                    {Number(pairData?.priceChange?.h24 || 0).toFixed(2)}%
                  </span>
                  <div className="bg-gray-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {/* Add null check for priceChange and h24 */}
                    {(pairData?.priceChange?.h24 || 0) >= 0 ? "B" : "S"}
                  </div>
                </div>
              </div>
            </div>

            {/* Trading chart - add animation for better visual feedback */}
            <div className="flex-1 bg-[#121212] border border-[#222] rounded relative min-h-[300px] animate-in fade-in duration-300">
              <TradingChart
                priceHistory={priceHistory}
                candlestickData={candlestickData}
                isCandlestick={chartType === "candlestick"}
              />

              {/* Price labels */}
              <div className="absolute top-2 right-2 text-xs space-y-1">
                {priceHistory.length > 0 && (
                  <>
                    {Array.from({ length: 5 }).map((_, i) => {
                      const maxPrice = Math.max(...priceHistory.map((p) => p.price)) * 1.1
                      const minPrice = Math.min(...priceHistory.map((p) => p.price)) * 0.9
                      const range = maxPrice - minPrice
                      const price = maxPrice - (range / 4) * i
                      return <div key={i}>{formatPrice(price)}</div>
                    })}
                  </>
                )}
              </div>

              {/* Time labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-400">
                {priceHistory.length > 0 && (
                  <>
                    {Array.from({ length: 4 }).map((_, i) => {
                      if (priceHistory.length < 4)
                        return (
                          <div key={i}>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                        )

                      const index = Math.floor((priceHistory.length - 1) * (i / 3))
                      const timestamp = priceHistory[index]?.timestamp
                      return (
                        <div key={i}>
                          {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Chart controls */}
            <div className="flex justify-end mt-2 md:mt-4">
              <button className="text-gray-400 hover:text-white">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
