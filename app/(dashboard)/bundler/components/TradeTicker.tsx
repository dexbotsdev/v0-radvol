"use client"

import { useEffect, useRef } from "react"
import { ArrowUp, ArrowDown, Clock, BarChart2 } from "lucide-react"
import type { BundlerTransaction } from "../types"

interface TradeTickerProps {
  transactions: BundlerTransaction[]
  bundlerRunning: boolean
}

export function TradeTicker({ transactions, bundlerRunning }: TradeTickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll the ticker
  useEffect(() => {
    if (!scrollRef.current || !bundlerRunning) return

    const scrollContainer = scrollRef.current
    const scrollWidth = scrollContainer.scrollWidth
    const clientWidth = scrollContainer.clientWidth

    // Only scroll if content is wider than container
    if (scrollWidth <= clientWidth) return

    let scrollPos = 0
    const scrollSpeed = 1 // pixels per frame

    const scroll = () => {
      scrollPos += scrollSpeed

      // Reset position when we've scrolled through all items
      if (scrollPos >= scrollWidth / 2) {
        scrollPos = 0
      }

      scrollContainer.scrollLeft = scrollPos
    }

    const intervalId = setInterval(scroll, 30)

    return () => clearInterval(intervalId)
  }, [transactions, bundlerRunning])

  if (!bundlerRunning || transactions.length === 0) {
    return (
      <div className="w-full bg-[#1a1a1a] border-t border-[#222] py-2 px-4 text-xs text-gray-500 flex items-center">
        <Clock size={12} className="mr-1" />
        <span>No active transactions. Start the bundler to see live transaction updates.</span>
      </div>
    )
  }

  // Calculate some stats for the ticker header
  const completedTxs = transactions.filter((tx) => tx.status === "completed")
  const failedTxs = transactions.filter((tx) => tx.status === "failed")
  const pendingTxs = transactions.filter((tx) => tx.status === "pending")
  const successRate = transactions.length > 0 ? (completedTxs.length / transactions.length) * 100 : 0

  // Duplicate transactions array to create a seamless loop effect
  const duplicatedTxs = [...transactions, ...transactions]

  return (
    <div className="w-full bg-[#1a1a1a] border-t border-[#222]">
      {/* Ticker header with stats */}
      <div className="flex items-center justify-between px-4 py-1 border-b border-[#222] bg-[#202227] text-xs">
        <div className="flex items-center">
          <BarChart2 size={12} className="mr-1 text-gray-400" />
          <span className="text-gray-400 mr-2">Live Transactions:</span>
          <span className="font-medium">Bundler</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock size={12} className="mr-1 text-gray-400" />
            <span className="text-gray-400 mr-1">Status:</span>
            <span className="text-green-500 mr-1">{completedTxs.length} completed</span>
            <span className="text-red-500">{failedTxs.length} failed</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 mr-1">Success Rate:</span>
            <div className="w-20 h-2 bg-[#333] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
            <span className="ml-1 text-[10px]">{Math.round(successRate)}%</span>
          </div>
        </div>
      </div>

      {/* Scrolling ticker */}
      <div ref={scrollRef} className="flex items-center space-x-6 whitespace-nowrap overflow-x-hidden py-2 px-4">
        {duplicatedTxs.map((tx, index) => (
          <div key={`${tx.id}-${index}`} className="flex items-center">
            <div
              className={`flex items-center ${
                tx.status === "completed" ? "text-green-500" : tx.status === "failed" ? "text-red-500" : "text-blue-500"
              }`}
            >
              {tx.status === "completed" ? (
                <ArrowUp size={12} className="mr-1" />
              ) : tx.status === "failed" ? (
                <ArrowDown size={12} className="mr-1" />
              ) : (
                <Clock size={12} className="mr-1" />
              )}
              <span className="font-medium mr-1">{tx.status.toUpperCase()}</span>
              <span className="mr-1">{tx.hash.substring(0, 8)}...</span>
              <span className="text-gray-400 mr-1">Bundle: {tx.bundleId}</span>
              <span className="font-mono">{tx.fee.toFixed(4)} SOL</span>
              <span className="text-gray-500 ml-1 text-[10px]">
                {tx.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>
            {index < duplicatedTxs.length - 1 && <span className="mx-3 text-gray-600">|</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
