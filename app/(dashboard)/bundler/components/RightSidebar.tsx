"use client"
import { useRef, useEffect, useState } from "react"
import { X, ArrowUp, RefreshCw, DollarSign, Snowflake } from "lucide-react"
import type { BundlerStats, BundlerTransaction, ActivityLog } from "../types"

interface RightSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  bundlerStats: BundlerStats
  transactions: BundlerTransaction[]
  activityLogs: ActivityLog[]
  bundlerRunning: boolean
  clearLogs: () => void
}

export function RightSidebar({
  activeTab,
  setActiveTab,
  bundlerStats,
  transactions,
  activityLogs,
  bundlerRunning,
  clearLogs,
}: RightSidebarProps) {
  // Add state for main tabs (Stats and Actions)
  const [mainTab, setMainTab] = useState<"Stats" | "Actions">("Stats")
  // State for action tabs
  const [actionTab, setActionTab] = useState<"Reclaim" | "Sell" | "Freezer">("Reclaim")

  return (
    <div className="flex flex-col h-full rightsidebar">
      <div className="p-3 border-b border-[#222]">
        <h2 className="text-lg font-medium">Bundler Data</h2>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-[#222]">
        {["Stats", "Actions"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 text-sm font-medium ${
              mainTab === tab ? "bg-[#1e1e1e] text-white" : "text-gray-400"
            }`}
            onClick={() => setMainTab(tab as "Stats" | "Actions")}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content based on main tab selection */}
      <div className="flex-1 overflow-hidden">
        {mainTab === "Stats" && (
          <>
            {/* Sub-tabs for Stats */}
            <div className="flex border-b border-[#222]">
              {["Stats", "Logs", "History"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-2 text-xs font-medium ${
                    activeTab === tab ? "bg-[#1e1e1e] text-white" : "text-gray-400"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Stats content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "Stats" && <StatsTab bundlerStats={bundlerStats} bundlerRunning={bundlerRunning} />}
              {activeTab === "Logs" && <LogsTab activityLogs={activityLogs} clearLogs={clearLogs} />}
              {activeTab === "History" && <HistoryTab transactions={transactions} bundlerRunning={bundlerRunning} />}
            </div>
          </>
        )}

        {mainTab === "Actions" && (
          <>
            {/* Sub-tabs for Actions */}
            <div className="flex border-b border-[#222]">
              {["Reclaim", "Sell", "Freezer"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-2 text-xs font-medium ${
                    actionTab === tab ? "bg-[#1e1e1e] text-white" : "text-gray-400"
                  }`}
                  onClick={() => setActionTab(tab as "Reclaim" | "Sell" | "Freezer")}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Actions content */}
            <div className="flex-1 overflow-hidden">
              {actionTab === "Reclaim" && <ReclaimTab />}
              {actionTab === "Sell" && <SellTab />}
              {actionTab === "Freezer" && <FreezerTab />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StatsTab({ bundlerStats, bundlerRunning }: { bundlerStats: BundlerStats; bundlerRunning: boolean }) {
  if (!bundlerRunning && bundlerStats.totalBundles === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center text-gray-500 py-8">
          <div className="text-lg mb-2">No Bundler Data</div>
          <div className="text-sm">Start the bundler to view real-time statistics</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 border-b border-[#222]">
        <div className="text-xs text-gray-400 mb-2">Bundler Performance</div>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Bundles:</span>
            <span>{bundlerStats.totalBundles}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Transactions:</span>
            <span>{bundlerStats.totalTransactions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Success Rate:</span>
            <span
              className={
                bundlerStats.successRate > 95
                  ? "text-green-500"
                  : bundlerStats.successRate > 80
                    ? "text-yellow-500"
                    : "text-red-500"
              }
            >
              {bundlerStats.successRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 border-b border-[#222]">
        <div className="text-xs text-gray-400 mb-2">Gas & Fees</div>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Average Gas Used:</span>
            <span>{bundlerStats.averageGasUsed.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Fee Saved:</span>
            <span className="text-green-500">{bundlerStats.totalFeeSaved.toFixed(4)} SOL</span>
          </div>
        </div>
      </div>

      <div className="p-3 border-b border-[#222]">
        <div className="text-xs text-gray-400 mb-2">Activity</div>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Status:</span>
            <span className={bundlerRunning ? "text-green-500" : "text-gray-500"}>
              {bundlerRunning ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Bundle:</span>
            <span>{bundlerStats.lastBundleTime ? bundlerStats.lastBundleTime.toLocaleTimeString() : "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function LogsTab({ activityLogs, clearLogs }: { activityLogs: ActivityLog[]; clearLogs: () => void }) {
  const logContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll logs to top when new logs are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0
    }
  }, [activityLogs])

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-2 border-b border-[#222] bg-[#1a1a1a] flex justify-between items-center">
        <h3 className="text-xs font-medium text-gray-300">Activity Logs</h3>
        <div className="flex space-x-1">
          <button className="text-gray-400 hover:text-white p-1" title="Clear logs" onClick={clearLogs}>
            <X size={12} />
          </button>
        </div>
      </div>
      <div
        className="flex-1 overflow-y-auto p-2 text-xs bg-[#0a0a0a] max-h-[calc(100vh-200px)] md:max-h-none"
        ref={logContainerRef}
      >
        {activityLogs.length === 0 ? (
          <div className="text-gray-500 text-center py-2">No activity logs</div>
        ) : (
          <div className="space-y-1">
            {[...activityLogs].reverse().map((log) => (
              <div key={log.id} className="flex items-start">
                <div
                  className={`
                    w-2 h-2 rounded-full mt-1 mr-2 flex-shrink-0
                    ${log.type === "info" ? "bg-blue-500" : ""}
                    ${log.type === "warning" ? "bg-yellow-500" : ""}
                    ${log.type === "error" ? "bg-red-500" : ""}
                    ${log.type === "success" ? "bg-green-500" : ""}
                  `}
                ></div>
                <div className="flex-1">
                  <div className="text-gray-400">{log.timestamp.toLocaleTimeString()}</div>
                  <div className="text-gray-200">{log.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HistoryTab({ transactions, bundlerRunning }: { transactions: BundlerTransaction[]; bundlerRunning: boolean }) {
  if (!bundlerRunning && transactions.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center text-gray-500 py-8">
          <div className="text-lg mb-2">No Transaction History</div>
          <div className="text-sm">Start the bundler to view transaction history</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 border-b border-[#222]">
        <div className="text-xs text-gray-400 mb-2 flex justify-between items-center">
          <span>Recent Transactions</span>
          <span className="text-[10px] text-gray-500">Last {transactions.length} transactions</span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <div className="text-sm">No transactions recorded yet</div>
        </div>
      ) : (
        <div className="divide-y divide-[#222]">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-3 hover:bg-[#1a1a1a]">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                      tx.status === "completed"
                        ? "bg-green-500/20"
                        : tx.status === "failed"
                          ? "bg-red-500/20"
                          : "bg-blue-500/20"
                    }`}
                  >
                    {tx.status === "completed" ? (
                      <ArrowUp size={14} className="text-green-500" />
                    ) : tx.status === "failed" ? (
                      <X size={14} className="text-red-500" />
                    ) : (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-medium ${
                        tx.status === "completed"
                          ? "text-green-500"
                          : tx.status === "failed"
                            ? "text-red-500"
                            : "text-blue-500"
                      }`}
                    >
                      {tx.status.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-400">Bundle: {tx.bundleId}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs">{tx.hash.substring(0, 10)}...</div>
                  <div className="text-xs text-gray-400">{tx.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// New Action Tab Components
function ReclaimTab() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 border-b border-[#222]">
        <div className="text-xs text-gray-400 mb-2">Reclaim Tokens</div>
      </div>

      <div className="p-4">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 mb-4">
          <div className="flex items-center mb-3">
            <RefreshCw size={16} className="text-blue-400 mr-2" />
            <h3 className="text-sm font-medium">Reclaim Unused Tokens</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Reclaim tokens from inactive or expired bundles to optimize your resources.
          </p>
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Available to reclaim:</span>
              <span className="text-white">0.0045 SOL</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Bundles to process:</span>
              <span className="text-white">3</span>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-xs font-medium mt-2">
              Reclaim Tokens
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">Last reclaim: Never</div>
      </div>
    </div>
  )
}

function SellTab() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 border-b border-[#222]">
        <div className="text-xs text-gray-400 mb-2">Sell Tokens</div>
      </div>

      <div className="p-4">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 mb-4">
          <div className="flex items-center mb-3">
            <DollarSign size={16} className="text-green-400 mr-2" />
            <h3 className="text-sm font-medium">Sell Bundled Tokens</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Sell tokens from your bundles directly to the market at the current price.
          </p>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs text-gray-400">Amount to sell</label>
              <input
                type="text"
                placeholder="0.00"
                className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-xs"
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Current market price:</span>
              <span className="text-white">1.24 SOL</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Estimated return:</span>
              <span className="text-green-500">0.00 SOL</span>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-xs font-medium mt-2">
              Sell Tokens
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">Market data updated: Just now</div>
      </div>
    </div>
  )
}

function FreezerTab() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 border-b border-[#222]">
        <div className="text-xs text-gray-400 mb-2">Token Freezer</div>
      </div>

      <div className="p-4">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 mb-4">
          <div className="flex items-center mb-3">
            <Snowflake size={16} className="text-blue-300 mr-2" />
            <h3 className="text-sm font-medium">Freeze Token Transfers</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Temporarily freeze token transfers for security or maintenance purposes.
          </p>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs text-gray-400">Token Address</label>
              <input
                type="text"
                placeholder="Enter token address"
                className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-gray-400">Freeze Duration</label>
              <select className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-xs">
                <option>1 hour</option>
                <option>6 hours</option>
                <option>24 hours</option>
                <option>Until manually unfrozen</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button className="w-[48%] bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-xs font-medium mt-2">
                Freeze Token
              </button>
              <button className="w-[48%] bg-[#333] hover:bg-[#444] text-white rounded py-2 text-xs font-medium mt-2">
                Unfreeze Token
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400 mb-2">Currently Frozen Tokens</div>
        <div className="text-center text-xs text-gray-500 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg">
          No tokens currently frozen
        </div>
      </div>
    </div>
  )
}
