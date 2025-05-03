"use client"
import { StatsTab } from "./StatsTab"
import { LogsTab } from "./LogsTab"
import type { MarketData, ActivityLog, PairData } from "../../types"

interface RightSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  marketData: MarketData
  activityLogs?: ActivityLog[]
  pairData: PairData | null
  botRunning: boolean
  clearLogs: () => void
  botStats?: {
    totalBuys: number
    totalSells: number
    totalVolume: number
    avgPrice: number
  }
}

export function RightSidebar({
  activeTab,
  setActiveTab,
  marketData,
  activityLogs = [],
  pairData,
  botRunning,
  clearLogs,
  botStats = { totalBuys: 0, totalSells: 0, totalVolume: 0, avgPrice: 0 },
}: RightSidebarProps) {
  return (
    <div className="flex flex-col h-full rightsidebar">
      <div className="p-3 border-b border-[#222]">
        <h2 className="text-lg font-medium">Market Data</h2>
      </div>

      {/* Tabs - removed History tab */}
      <div className="flex border-b border-[#222]">
        {["Stats", "Logs"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === tab ? "bg-[#1e1e1e] text-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "Stats" && (
          <StatsTab marketData={marketData} pairData={pairData} botRunning={botRunning} botStats={botStats} />
        )}
        {activeTab === "Logs" && <LogsTab activityLogs={activityLogs} clearLogs={clearLogs} />}
      </div>
    </div>
  )
}
