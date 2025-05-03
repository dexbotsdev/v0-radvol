import { ArrowUp, ArrowDown } from "lucide-react"
import type { Trade, PairData } from "../../types"

interface HistoryTabProps {
  recentTrades: Trade[]
  pairData: PairData | null
  botRunning: boolean
}

export function HistoryTab({ recentTrades, pairData, botRunning }: HistoryTabProps) {
  // If bot is not running, show empty history
  if (!botRunning || !pairData) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center text-gray-500 py-8">
          <div className="text-lg mb-2">No Trading History</div>
          <div className="text-sm">Start the bot to view trading history</div>
        </div>
      </div>
    )
  }

  // Update the HistoryTab component to ensure scrollability
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 border-b border-[#222]">
        <div className="text-xs text-gray-400 mb-2 flex justify-between items-center">
          <span>Recent Trades</span>
          <span className="text-[10px] text-gray-500">Last {recentTrades.length} trades</span>
        </div>
      </div>

      {recentTrades.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <div className="text-sm">No trades recorded yet</div>
        </div>
      ) : (
        <div className="divide-y divide-[#222]">
          {recentTrades.map((trade) => (
            <div key={trade.id} className="p-3 hover:bg-[#1a1a1a]">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                      trade.type === "buy" ? "bg-green-500/20" : "bg-red-500/20"
                    }`}
                  >
                    {trade.type === "buy" ? (
                      <ArrowUp size={14} className="text-green-500" />
                    ) : (
                      <ArrowDown size={14} className="text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className={`font-medium ${trade.type === "buy" ? "text-green-500" : "text-red-500"}`}>
                      {trade.type.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {trade.amount.toFixed(2)} {pairData.baseToken.symbol}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono">${trade.price.toFixed(9)}</div>
                  <div className="text-xs text-gray-400">{trade.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
