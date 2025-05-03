"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"

interface StatsTabProps {
  pairData: any
  botRunning: boolean
  botStats?: {
    totalBuys: number
    totalSells: number
    totalVolume: number
    avgPrice: number
  }
}

export function StatsTab({
  pairData,
  botRunning,
  botStats = { totalBuys: 0, totalSells: 0, totalVolume: 0, avgPrice: 0 },
}: StatsTabProps) {
  const [timeframe, setTimeframe] = useState<string>("h24")

  // Safely get price change with null checks
  const getPriceChange = (tf: string) => {
    if (!pairData || !pairData.priceChange) return null
    return pairData.priceChange[tf]
  }

  const priceChange = getPriceChange(timeframe)
  const priceChangeClass = priceChange > 0 ? "text-green-400" : priceChange < 0 ? "text-red-400" : "text-gray-400"
  const PriceChangeIcon = priceChange > 0 ? ArrowUp : priceChange < 0 ? ArrowDown : Minus

  // Safe formatting functions
  const safeToFixed = (value: any, decimals: number) => {
    if (value === undefined || value === null || typeof value.toFixed !== "function") {
      return "0." + "0".repeat(decimals)
    }
    return value.toFixed(decimals)
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium text-gray-300">Market Stats</div>
        <Badge variant="outline" className="bg-gray-800/50">
          {botRunning ? "Bot Active" : "Bot Inactive"}
        </Badge>
      </div>

      {/* Price and Market Data */}
      <Card className="mb-3 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="p-3 space-y-3">
          <div>
            <div className="text-xs text-gray-400 mb-1">Current Price</div>
            <div className="flex items-baseline">
              <div className="text-sm font-medium">
                ${pairData?.priceUsd ? Number(pairData.priceUsd).toFixed(8) : "0.00000000"}
              </div>
              {priceChange !== null && (
                <div className={`ml-2 text-xs flex items-center ${priceChangeClass}`}>
                  <PriceChangeIcon size={12} className="mr-0.5" />
                  {Math.abs(priceChange).toFixed(2)}%
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-400 mb-1">24h Volume</div>
              <div className="text-xs">
                ${pairData?.volume?.h24 ? Number(pairData.volume.h24).toLocaleString() : "0"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Liquidity</div>
              <div className="text-xs">
                ${pairData?.liquidity?.usd ? Number(pairData.liquidity.usd).toLocaleString() : "0"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1">
            <button
              className={`text-xs px-1 py-0.5 rounded ${
                timeframe === "h1" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800/50"
              }`}
              onClick={() => setTimeframe("h1")}
            >
              1H
            </button>
            <button
              className={`text-xs px-1 py-0.5 rounded ${
                timeframe === "h24" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800/50"
              }`}
              onClick={() => setTimeframe("h24")}
            >
              24H
            </button>
            <button
              className={`text-xs px-1 py-0.5 rounded ${
                timeframe === "h6" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800/50"
              }`}
              onClick={() => setTimeframe("h6")}
            >
              6H
            </button>
          </div>
        </div>
      </Card>

      {/* Bot Statistics */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="p-3 space-y-3">
          <div className="text-xs font-medium text-gray-300 mb-1">Bot Statistics</div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-400 mb-1">Total Buys</div>
              <div className="text-xs text-green-400">{botStats?.totalBuys || 0}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Total Sells</div>
              <div className="text-xs text-red-400">{botStats?.totalSells || 0}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-400 mb-1">Total Volume</div>
              <div className="text-xs">{safeToFixed(botStats?.totalVolume, 4)} SOL</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Avg Price</div>
              <div className="text-xs">${safeToFixed(botStats?.avgPrice, 8)}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
