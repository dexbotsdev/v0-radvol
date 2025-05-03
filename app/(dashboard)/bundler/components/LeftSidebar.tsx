"use client"
import { Play, Pause, Loader2, Plus, DollarSign, Trash2, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import type { BundlerConfig, Wallet, BundlerMode } from "../types"

interface LeftSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  bundlerConfig: BundlerConfig
  bundlerRunning: boolean
  isLoading: boolean
  wallets: Wallet[]
  walletCount: number
  selectAll: boolean
  bundlerModes: BundlerMode[]
  setWalletCount: (count: number) => void
  generateWallets: () => void
  fundWallets: () => void
  burnWallets: () => void
  toggleSelectAll: () => void
  toggleWalletSelection: (id: string) => void
  fundWallet: (id: string) => void
  handleBundlerConfigChange: (field: keyof BundlerConfig, value: string | number) => void
  toggleBundlerRunning: () => void
  cycleBundlerMode: (direction: "next" | "prev") => void
  openTokenWizard: () => void
}

export function LeftSidebar({
  activeTab,
  setActiveTab,
  bundlerConfig,
  bundlerRunning,
  isLoading,
  handleBundlerConfigChange,
  toggleBundlerRunning,
  wallets,
  walletCount,
  selectAll,
  bundlerModes,
  setWalletCount,
  generateWallets,
  fundWallets,
  burnWallets,
  toggleSelectAll,
  toggleWalletSelection,
  fundWallet,
  cycleBundlerMode,
  openTokenWizard,
}: LeftSidebarProps) {
  return (
    <div className="flex flex-col h-full leftsidebar">
      <div className="px-2  border-b border-[#222] flex items-center">
        <div className="flex items-center">
          <img src="/images/freedom-logo.png" alt="Freedom Logo" className="h-[48px]" />
          <span className="font-bold text-md tracking-tight">Freedom</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#222]">
        {["Wallets", "Settings"].map((tab) => (
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
        {activeTab === "Wallets" && (
          <WalletsTab
            wallets={wallets}
            walletCount={walletCount}
            selectAll={selectAll}
            setWalletCount={setWalletCount}
            generateWallets={generateWallets}
            fundWallets={fundWallets}
            burnWallets={burnWallets}
            toggleSelectAll={toggleSelectAll}
            toggleWalletSelection={toggleWalletSelection}
            fundWallet={fundWallet}
          />
        )}
        {activeTab === "Settings" && (
          <SettingsTab
            bundlerConfig={bundlerConfig}
            bundlerRunning={bundlerRunning}
            isLoading={isLoading}
            bundlerModes={bundlerModes}
            handleBundlerConfigChange={handleBundlerConfigChange}
            toggleBundlerRunning={toggleBundlerRunning}
            cycleBundlerMode={cycleBundlerMode}
            openTokenWizard={openTokenWizard}
          />
        )}
      </div>
    </div>
  )
}

function WalletsTab({
  wallets,
  walletCount,
  selectAll,
  setWalletCount,
  generateWallets,
  fundWallets,
  burnWallets,
  toggleSelectAll,
  toggleWalletSelection,
  fundWallet,
}: {
  wallets: Wallet[]
  walletCount: number
  selectAll: boolean
  setWalletCount: (count: number) => void
  generateWallets: () => void
  fundWallets: () => void
  burnWallets: () => void
  toggleSelectAll: () => void
  toggleWalletSelection: (id: string) => void
  fundWallet: (id: string) => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Wallet controls */}
      <div className="p-3 border-b border-[#222]">
        <div className="flex items-center mb-3 w-full">
          <input
            type="number"
            value={walletCount}
            onChange={(e) => setWalletCount(Math.max(1, Number.parseInt(e.target.value) || 0))}
            className="bg-[#1e1e1e] border border-[#333] rounded px-2 py-1 flex-1 text-sm"
            min="1"
          />
          <div className="flex ml-2">
            <button
              onClick={generateWallets}
              className="iconButton text-white rounded h-7 w-7 flex items-center justify-center"
              title="Generate Wallets"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={fundWallets}
              className="iconButton text-white rounded h-7 w-7 flex items-center justify-center mx-1"
              title="Fund Selected Wallets"
              disabled={!wallets.some((w) => w.selected)}
            >
              <DollarSign size={16} />
            </button>
            <button
              onClick={burnWallets}
              className="iconButton text-white rounded h-7 w-7 flex items-center justify-center"
              title="Burn Selected Wallets"
              disabled={!wallets.some((w) => w.selected)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input type="checkbox" id="select-all" checked={selectAll} onChange={toggleSelectAll} className="mr-2" />
          <label htmlFor="select-all" className="text-sm">
            Select All
          </label>
        </div>
      </div>

      {/* Wallet list */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-250px)] md:max-h-none">
        {wallets.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No wallets generated. Click Generate to create wallets.
          </div>
        ) : (
          <div className="divide-y divide-[#222]">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="p-3 hover:bg-[#1a1a1a]">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={wallet.selected}
                    onChange={() => toggleWalletSelection(wallet.id)}
                    className="mr-2"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-medium truncate">{wallet.address}</div>
                    <div className="text-xs text-gray-400 flex justify-between">
                      <span>Balance:</span>
                      <span>{wallet.balance} SOL</span>
                    </div>
                  </div>
                  <button
                    onClick={() => fundWallet(wallet.id)}
                    className="ml-2 iconButton text-white rounded h-6 w-6 flex items-center justify-center"
                    title="Fund Wallet"
                  >
                    <DollarSign size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SettingsTab({
  bundlerConfig,
  bundlerRunning,
  isLoading,
  bundlerModes,
  handleBundlerConfigChange,
  toggleBundlerRunning,
  cycleBundlerMode,
  openTokenWizard,
}: {
  bundlerConfig: BundlerConfig
  bundlerRunning: boolean
  isLoading: boolean
  bundlerModes: BundlerMode[]
  handleBundlerConfigChange: (field: keyof BundlerConfig, value: string | number) => void
  toggleBundlerRunning: () => void
  cycleBundlerMode: (direction: "next" | "prev") => void
  openTokenWizard: () => void
}) {
  // Find the current bundler mode
  const currentMode = bundlerModes.find((mode) => mode.id === bundlerConfig.bundlerMode) || bundlerModes[0]

  return (
    <div className="text-sm flex flex-col h-full overflow-y-auto">
      {/* Strategy Mode Switcher */}
      <div className="mb-4 border border-[#333] rounded rightsidebar p-2 mx-3 mt-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-md font-bold text-gray-400">{currentMode.name}</span>
          <div className="flex items-center">
            <button
              className={`w-7 h-7 flex items-center justify-center rounded mr-2 ${
                bundlerRunning ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"
              } hover:bg-opacity-30`}
              onClick={toggleBundlerRunning}
              disabled={isLoading}
              title={bundlerRunning ? "Stop Bundler" : "Start Bundler"}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : bundlerRunning ? (
                <Pause size={16} />
              ) : (
                <Play size={16} />
              )}
            </button>
            <button
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#333] text-gray-400 hover:text-white"
              onClick={() => cycleBundlerMode("prev")}
              disabled={bundlerRunning}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#333] text-gray-400 hover:text-white ml-1"
              onClick={() => cycleBundlerMode("next")}
              disabled={bundlerRunning}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-2 text-center">{currentMode.description}</div>
      </div>

      {/* Token Metadata Wizard Button */}
      <div className="mb-4 mx-3">
        <button
          onClick={openTokenWizard}
          className="w-full bg-[#333] hover:bg-[#444] text-white rounded-md py-2 px-3 flex items-center justify-center"
        >
          <FileText size={16} className="mr-2" />
          <span>Open Token Metadata Wizard</span>
        </button>
      </div>

      {/* Bundler Configuration */}
      <div className="p-3 space-y-2">
        <label className="block text-gray-400 text-xs">RPC URL</label>
        <input
          type="text"
          value={bundlerConfig.rpcUrl}
          onChange={(e) => handleBundlerConfigChange("rpcUrl", e.target.value)}
          className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-sm"
          disabled={bundlerRunning}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 px-3">
        <div className="space-y-2">
          <label className="block text-gray-400 text-xs">Max Tx Per Bundle</label>
          <input
            type="number"
            value={bundlerConfig.maxTransactionsPerBundle}
            onChange={(e) => handleBundlerConfigChange("maxTransactionsPerBundle", Number.parseInt(e.target.value))}
            className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-sm"
            disabled={bundlerRunning}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-400 text-xs">Priority Fee (SOL)</label>
          <input
            type="number"
            step="0.000001"
            value={bundlerConfig.priorityFee}
            onChange={(e) => handleBundlerConfigChange("priorityFee", Number.parseFloat(e.target.value))}
            className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-sm"
            disabled={bundlerRunning}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-3 pt-2">
        <div className="space-y-2">
          <label className="block text-gray-400 text-xs">Bundle Interval (sec)</label>
          <input
            type="number"
            value={bundlerConfig.bundleInterval}
            onChange={(e) => handleBundlerConfigChange("bundleInterval", Number.parseInt(e.target.value))}
            className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-sm"
            disabled={bundlerRunning}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-400 text-xs">Gas Limit</label>
          <input
            type="number"
            value={bundlerConfig.gasLimit}
            onChange={(e) => handleBundlerConfigChange("gasLimit", Number.parseInt(e.target.value))}
            className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-sm"
            disabled={bundlerRunning}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-3 pt-3">
        <span className="text-sm">Auto Bundle</span>
        <div
          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
            bundlerConfig.autoBundle ? "bg-[#FF8C00]" : "bg-[#333]"
          }`}
          onClick={() => !bundlerRunning && handleBundlerConfigChange("autoBundle", !bundlerConfig.autoBundle)}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              bundlerConfig.autoBundle ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    </div>
  )
}

// Make sure to export the LeftSidebar component as the default export as well
export default LeftSidebar
