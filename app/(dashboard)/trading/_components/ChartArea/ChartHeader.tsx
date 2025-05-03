"use client"

import { BarChart2, LineChart } from "lucide-react"
import type { PairData } from "../../types"

interface ChartHeaderProps {
  pairData: PairData | null
  botRunning: boolean
  strategyMode?: string
  timeframe?: string
  onTimeframeChange?: (timeframe: string) => void
  chartType?: "line" | "candlestick"
  onChartTypeChange?: (type: "line" | "candlestick") => void
}

export function ChartHeader({
  pairData,
  botRunning,
  strategyMode,
  timeframe = "1h",
  onTimeframeChange,
  chartType = "candlestick",
  onChartTypeChange,
}: ChartHeaderProps) {
  // Get strategy color based on strategy mode
  const getStrategyColor = () => {
    switch (strategyMode) {
      case "MICROBUY":
        return "#4caf50"
      case "BUMP":
        return "#2196f3"
      case "TURBOBOOST":
        return "#ff9800"
      case "PATTERNTRADE":
        return "#f44336"
      default:
        return "#888"
    }
  }

  // Get strategy name based on strategy mode
  const getStrategyName = () => {
    switch (strategyMode) {
      case "MICROBUY":
        return "MicroBuy"
      case "BUMP":
        return "Bump"
      case "TURBOBOOST":
        return "Turbo Boost"
      case "PATTERNTRADE":
        return "Pattern Trade"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="flex items-center justify-between p-2 md:p-4 border-b border-[#222]">
      <div className="flex items-center">
        <div className="mr-4">
          <div className="text-sm md:text-base font-medium">
            {pairData ? `${pairData.baseToken.symbol}/${pairData.quoteToken.symbol}` : "---/---"}
          </div>
          <div className="text-xs text-gray-400">{pairData ? pairData.dexId : "Unknown DEX"}</div>
        </div>

        {botRunning && strategyMode && (
          <div
            className="px-2 py-1 rounded text-xs"
            style={{ backgroundColor: `${getStrategyColor()}20`, color: getStrategyColor() }}
          >
            {getStrategyName()} Strategy
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {/* Timeframe selector */}
        <div className="flex items-center bg-[#1a1a1a] rounded overflow-hidden">
          <button
            className={`px-2 py-1 text-xs ${timeframe === "5m" ? "bg-[#333] text-white" : "text-gray-400"}`}
            onClick={() => onTimeframeChange && onTimeframeChange("5m")}
          >
            5m
          </button>
          <button
            className={`px-2 py-1 text-xs ${timeframe === "15m" ? "bg-[#333] text-white" : "text-gray-400"}`}
            onClick={() => onTimeframeChange && onTimeframeChange("15m")}
          >
            15m
          </button>
          <button
            className={`px-2 py-1 text-xs ${timeframe === "1h" ? "bg-[#333] text-white" : "text-gray-400"}`}
            onClick={() => onTimeframeChange && onTimeframeChange("1h")}
          >
            1h
          </button>
          <button
            className={`px-2 py-1 text-xs ${timeframe === "4h" ? "bg-[#333] text-white" : "text-gray-400"}`}
            onClick={() => onTimeframeChange && onTimeframeChange("4h")}
          >
            4h
          </button>
        </div>

        {/* Chart type selector */}
        <div className="flex items-center bg-[#1a1a1a] rounded overflow-hidden">
          <button
            className={`px-2 py-1 text-xs ${chartType === "candlestick" ? "bg-[#333] text-white" : "text-gray-400"}`}
            onClick={() => onChartTypeChange && onChartTypeChange("candlestick")}
            title="Candlestick Chart"
          >
            <BarChart2 size={16} />
          </button>
          <button
            className={`px-2 py-1 text-xs ${chartType === "line" ? "bg-[#333] text-white" : "text-gray-400"}`}
            onClick={() => onChartTypeChange && onChartTypeChange("line")}
            title="Line Chart"
          >
            <LineChart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
