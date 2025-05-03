import type React from "react"
import { BarChart2, ArrowUp, ArrowDown } from "lucide-react"
import type { BundlerStats, BundlerTransaction } from "../types"

interface MainContentProps {
  bundlerStats: BundlerStats
  bundlerRunning: boolean
  transactions: BundlerTransaction[]
  bundlerMode: string
}

export function MainContent({ bundlerStats, bundlerRunning, transactions, bundlerMode }: MainContentProps) {
  return (
    <div className="flex-1 flex flex-col bg-[#121212] h-full overflow-hidden">
      <BundlerHeader bundlerStats={bundlerStats} bundlerRunning={bundlerRunning} bundlerMode={bundlerMode} />

      {/* Main content area */}
      <div className="flex-1 p-2 md:p-4 overflow-hidden">
        {!bundlerRunning && bundlerStats.totalBundles === 0 ? (
          // Empty state
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="text-base md:text-xl mb-2">No Active Bundler Session</div>
            <div className="text-xs md:text-sm">Start the bundler to view transaction data and statistics</div>
          </div>
        ) : (
          // Active state with data
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-2 md:mb-4">
              <div className="text-lg md:text-2xl font-medium">Transaction Bundler</div>
              <div className="flex items-center">
                <div className="bg-[#1e1e1e] rounded px-2 py-1 flex items-center mr-2 text-xs md:text-sm">
                  <span className="text-green-500 font-medium mr-1">
                    {bundlerStats.successRate.toFixed(1)}% Success
                  </span>
                </div>
              </div>
            </div>

            {/* Bundler dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <StatCard
                title="Total Bundles"
                value={bundlerStats.totalBundles.toString()}
                icon={<BarChart2 size={20} className="text-blue-500" />}
              />
              <StatCard
                title="Transactions Processed"
                value={bundlerStats.totalTransactions.toString()}
                icon={<ArrowUp size={20} className="text-green-500" />}
              />
              <StatCard
                title="Fee Saved"
                value={`${bundlerStats.totalFeeSaved.toFixed(4)} SOL`}
                icon={<ArrowDown size={20} className="text-purple-500" />}
              />
            </div>

            {/* Recent bundles */}
            <div className="flex-1 bg-[#1a1a1a] border border-[#222] rounded p-4 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Recent Bundles</h3>
                <div className="text-xs text-gray-400">
                  Last updated:{" "}
                  {bundlerStats.lastBundleTime ? bundlerStats.lastBundleTime.toLocaleTimeString() : "Never"}
                </div>
              </div>

              {bundlerStats.totalBundles === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-sm">No bundles created yet</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Generate some mock bundles based on transactions */}
                  {Array.from(new Set(transactions.map((tx) => tx.bundleId)))
                    .slice(0, 4)
                    .map((bundleId, index) => {
                      const bundleTxs = transactions.filter((tx) => tx.bundleId === bundleId)
                      const successCount = bundleTxs.filter((tx) => tx.status === "completed").length
                      const timestamp = bundleTxs.length > 0 ? bundleTxs[0].timestamp : new Date()

                      return (
                        <div key={bundleId} className="bg-[#222] rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">{bundleId}</div>
                            <div
                              className={`text-xs px-2 py-0.5 rounded ${
                                successCount === bundleTxs.length
                                  ? "bg-green-500/20 text-green-500"
                                  : successCount === 0
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-yellow-500/20 text-yellow-500"
                              }`}
                            >
                              {successCount === bundleTxs.length
                                ? "Success"
                                : successCount === 0
                                  ? "Failed"
                                  : "Partial"}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mb-2">{timestamp.toLocaleString()}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-400">Transactions: </span>
                              <span>{bundleTxs.length}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Success Rate: </span>
                              <span>
                                {bundleTxs.length > 0 ? ((successCount / bundleTxs.length) * 100).toFixed(0) : 0}%
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Gas Used: </span>
                              <span>{bundleTxs.reduce((sum, tx) => sum + tx.gasUsed, 0).toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Fee: </span>
                              <span>{bundleTxs.reduce((sum, tx) => sum + tx.fee, 0).toFixed(4)} SOL</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BundlerHeader({
  bundlerStats,
  bundlerRunning,
  bundlerMode,
}: {
  bundlerStats: BundlerStats
  bundlerRunning: boolean
  bundlerMode: string
}) {
  // If bundler is not running, show empty header
  if (!bundlerRunning && bundlerStats.totalBundles === 0) {
    return (
      <div className="flex justify-between items-center px-4 py-2 border-b border-[#222]">
        <div className="flex items-center">
          <span className="text-lg font-medium text-gray-500">No active bundler</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-gray-600">
            <div>Start the bundler to view transaction data</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col border-b border-[#222]">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center">
          <span className="text-lg font-medium">Transaction Bundler</span>
          <span
            className={`ml-2 px-2 py-0.5 ${bundlerRunning ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-400"} rounded text-xs`}
          >
            {bundlerRunning ? "ACTIVE" : "INACTIVE"}
          </span>
          <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">Mode: {bundlerMode}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Bundles:</span>
              <span>{bundlerStats.totalBundles}</span>
            </div>
          </div>

          <div className="text-xs">
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
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#222] rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-gray-400 text-sm">{title}</div>
        <div className="bg-[#222] rounded-full p-2">{icon}</div>
      </div>
      <div className="text-2xl font-medium">{value}</div>
    </div>
  )
}
