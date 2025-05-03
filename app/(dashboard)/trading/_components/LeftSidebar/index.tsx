"use client"
import { WalletsTab } from "./WalletsTab"
import { BotTab } from "./BotTab"
import type { Wallet, BotConfig, StrategyMode, Platform } from "../../types"

interface LeftSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  wallets: Wallet[]
  walletCount: number
  selectAll: boolean
  botConfig: BotConfig
  botRunning: boolean
  isLoading: boolean
  strategyModes: StrategyMode[]
  platforms: Platform[]
  selectedPlatform: string
  setWalletCount: (count: number) => void
  generateWallets: () => void
  fundWallets: () => void
  burnWallets: () => void
  toggleSelectAll: () => void
  toggleWalletSelection: (id: string) => void
  handleBotConfigChange: (field: keyof BotConfig, value: string | number) => void
  toggleBotRunning: (platform: string, strategyMode: string, config: BotConfig) => void
  saveBotConfig: () => void
  cycleStrategyMode: (direction: "next" | "prev") => void
  cyclePlatform: (direction: "next" | "prev") => void
}

export function LeftSidebar({
  activeTab,
  setActiveTab,
  wallets,
  walletCount,
  selectAll,
  botConfig,
  botRunning,
  isLoading,
  strategyModes,
  platforms = [], // Provide default empty array
  selectedPlatform,
  setWalletCount,
  generateWallets,
  fundWallets,
  burnWallets,
  toggleSelectAll,
  toggleWalletSelection,
  handleBotConfigChange,
  toggleBotRunning,
  saveBotConfig,
  cycleStrategyMode,
  cyclePlatform,
}: LeftSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-[#222]">
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "Wallets" ? "text-white border-b-2 border-blue-500" : "text-gray-400"
          } ${botRunning ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !botRunning && setActiveTab("Wallets")}
          disabled={botRunning}
          title={botRunning ? "Stop the bot to access wallets" : "Manage wallets"}
        >
          Wallets
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "Bot" ? "text-white border-b-2 border-blue-500" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("Bot")}
        >
          Bot
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "Wallets" ? (
          <WalletsTab
            wallets={wallets}
            walletCount={walletCount}
            selectAll={selectAll}
            botRunning={botRunning}
            setWalletCount={setWalletCount}
            generateWallets={generateWallets}
            fundWallets={fundWallets}
            burnWallets={burnWallets}
            toggleSelectAll={toggleSelectAll}
            toggleWalletSelection={toggleWalletSelection}
          />
        ) : (
          <BotTab
            botConfig={botConfig}
            botRunning={botRunning}
            isLoading={isLoading}
            strategyModes={strategyModes}
            platforms={platforms}
            selectedPlatform={selectedPlatform}
            handleBotConfigChange={handleBotConfigChange}
            toggleBotRunning={toggleBotRunning}
            saveBotConfig={saveBotConfig}
            cycleStrategyMode={cycleStrategyMode}
            cyclePlatform={cyclePlatform}
          />
        )}
      </div>
    </div>
  )
}
