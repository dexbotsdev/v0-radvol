"use client"

import { useEffect, useRef } from "react"
import type { Trade, PairData } from "../types"
import { formatPrice, formatTime } from "../utils"

interface TradeTickerProps {
  trades: Trade[]
  pairData: PairData | null
  botRunning: boolean
}

export function TradeTicker({ trades, pairData, botRunning }: TradeTickerProps) {
  const tickerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll ticker when new trades are added
  useEffect(() => {
    if (tickerRef.current) {
      tickerRef.current.scrollLeft = 0
    }
  }, [trades])

  if (!botRunning) {
    return null
  }

  return (
    <div className="h-8 bg-[#0a0a0a] border-t border-[#222] overflow-hidden">
      <div ref={tickerRef} className="h-full flex items-center overflow-x-auto whitespace-nowrap px-2 scrollbar-hide">
        {trades.length === 0 ? (
          <div className="text-gray-500 text-xs">No trades yet</div>
        ) : (
          <>
            {[...trades]
              .reverse()
              .slice(0, 20)
              .map((trade) => (
                <div
                  key={trade.id}
                  className={`flex items-center mr-4 text-xs ${
                    trade.type === "buy" ? "text-green-500" : "text-[#f44336]"
                  }`}
                >
                  <span className="mr-1">{formatTime(new Date(trade.timestamp))}</span>
                  <span className="font-medium mr-1">{trade.type === "buy" ? "BUY" : "SELL"}</span>
                  <span className="text-gray-300 mr-1">
                    {trade.amount.toFixed(4)} {pairData?.quoteToken?.symbol || "SOL"}
                  </span>
                  <span className="text-gray-400">@</span>
                  <span className="text-gray-300 ml-1">${formatPrice(trade.price)}</span>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  )
}
