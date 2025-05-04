"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { TopNavigation } from "./_components/TopNavigation"
import { LeftSidebar } from "./_components/LeftSidebar"
import { RightSidebar } from "./_components/RightSidebar"
import { ChartArea } from "./_components/ChartArea"
import { Dialogs } from "./_components/Dialogs"
import type { Wallet, BotConfig, StrategyMode, Platform } from "./types"
import { TradeTicker } from "./_components/TradeTicker"
import { GeneralSettingsDialog } from "./_components/Dialogs/GeneralSettingsDialog"
import { RiskManagementDialog } from "./_components/Dialogs/RiskManagementDialog"
import { useVolumeBotSDK } from "@/lib/sdk/use-volume-bot-sdk"
import { WalletSDK } from "@/lib/sdk/wallet-sdk"

export default function TradingPage() {
  const [activeTab, setActiveTab] = useState("Wallets")
  const [activeRightTab, setActiveRightTab] = useState("Stats")
  const [walletCount, setWalletCount] = useState(5)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const dialogRef = useRef<HTMLDivElement>(null)
  const [walletKeys, setWalletKeys] = useState({
    mainWalletKey: "",
    fundingWalletKey: "",
  })

  // Add state for settings dialogs
  const [activeSettingsDialog, setActiveSettingsDialog] = useState<string | null>(null)

  // Load wallet keys on mount
  useEffect(() => {
    const mainWalletKey = localStorage.getItem("mainWalletPrivateKey") || ""
    const fundingWalletKey = localStorage.getItem("fundingWalletPrivateKey") || ""

    setWalletKeys({
      mainWalletKey,
      fundingWalletKey,
    })
  }, [])

  // Initialize WalletSDK with the main wallet key if available
  const walletSDK = useRef(
    new WalletSDK("https://api.mainnet-beta.solana.com", "trading-wallets", walletKeys.mainWalletKey || undefined),
  ).current

  // Update the botConfig state to include strategyMode
  const [botConfig, setBotConfig] = useState<BotConfig>({
    tokenAddress: "So11111111111111111111111111111111111111112", // Default to SOL token address
    minTradeAmount: 0.0001,
    maxTradeAmount: 0.0001,
    tradesPerInterval: 20,
    intervalMinutes: 15,
    numberOfBuys: 1,
    numberOfSells: 0,
    strategyMode: "MICROBUY", // Default strategy
    platform: "RAYDIUM", // Default platform
  })

  // Add a new state for available strategy modes with their specific configurations
  const [strategyModes] = useState<StrategyMode[]>([
    {
      id: "MICROBUY",
      name: "MicroBuy",
      description: "Small frequent buys to accumulate position",
      color: "#4caf50",
      config: {
        minTradeAmount: { value: 0.0001, editable: false },
        maxTradeAmount: { value: 0.0001, editable: false },
        tradesPerInterval: { value: 20, editable: false },
        intervalMinutes: { value: 15, editable: true },
        numberOfBuys: { value: 1, editable: false },
        numberOfSells: { value: 0, editable: false },
      },
    },
    {
      id: "BUMP",
      name: "Bump",
      description: "Equal buys and sells to create market activity",
      color: "#2196f3",
      config: {
        minTradeAmount: { value: 0.01, editable: true },
        maxTradeAmount: { value: 1.0, editable: true },
        tradesPerInterval: { value: 5, editable: true },
        intervalMinutes: { value: 15, editable: true },
        numberOfBuys: { value: 1, editable: false },
        numberOfSells: { value: 1, editable: false },
      },
    },
    {
      id: "TURBOBOOST",
      name: "Turbo Boost",
      description: "Rapid trading to boost volume",
      color: "#ff9800",
      config: {
        minTradeAmount: { value: 0.01, editable: true },
        maxTradeAmount: { value: 1.0, editable: true },
        tradesPerInterval: { value: 4, editable: false },
        intervalMinutes: { value: 15, editable: true },
        numberOfBuys: { value: 1, editable: false },
        numberOfSells: { value: 1, editable: false },
      },
    },
    {
      id: "PATTERNTRADE",
      name: "Pattern Trade",
      description: "Multiple buys followed by sells",
      color: "#f44336",
      config: {
        minTradeAmount: { value: 0.01, editable: true },
        maxTradeAmount: { value: 1.0, editable: true },
        tradesPerInterval: { value: 4, editable: false },
        intervalMinutes: { value: 15, editable: true },
        numberOfBuys: { value: 3, editable: false },
        numberOfSells: { value: 1, editable: false },
      },
    },
  ])

  // Add platforms state after the strategyModes state
  const [platforms] = useState<Platform[]>([
    {
      id: "RAYDIUM",
      name: "Raydium AMM",
      description: "Solana's leading AMM & liquidity provider",
      color: "#00C2FF",
    },
    {
      id: "PUMPFUN",
      name: "PumpFun",
      description: "Fun & gamified trading experience",
      color: "#FF5CAA",
    },
    {
      id: "PUMPSWAP",
      name: "PumpSwap",
      description: "Specialized for meme tokens & high volume",
      color: "#FFB800",
    },
  ])

  // Initialize the Volume Bot SDK with wallet keys
  const {
    isInitialized,
    status: botStatus,
    stats: botStats,
    logs: botLogs,
    trades: botTrades,
    marketData: botMarketData,
    pairData: botPairData,
    priceHistory: botPriceHistory,
    error: botError,
    isLoading,
    initializeBot,
    startBot,
    stopBot,
    updateConfig,
    clearLogs,
  } = useVolumeBotSDK({
    rpcUrl: "https://api.mainnet-beta.solana.com",
    walletSDK,
    walletKeys: {
      mainWalletKey: walletKeys.mainWalletKey,
      fundingWalletKey: walletKeys.fundingWalletKey,
    },
  })

  // Update wallet SDK when wallet keys change
  useEffect(() => {
    if (walletKeys.mainWalletKey) {
      walletSDK.setMainWalletKey?.(walletKeys.mainWalletKey)
    }
  }, [walletKeys.mainWalletKey, walletSDK])

  // Derived state
  const botRunning = botStatus === "running"
  const activityLogs = botLogs
  const recentTrades = botTrades
  const marketData = botMarketData || {
    time: "00:00:00",
    high: "0",
    low: "0",
    open: "0",
    close: "0",
    lastUpdate: Date.now(),
    psar: "0",
    trend: "0",
    rsi: "50",
  }
  const pairData = botPairData
  const priceHistory = botPriceHistory

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Load wallets on mount
  useEffect(() => {
    const loadWallets = async () => {
      try {
        const loadedWallets = await walletSDK.fetchWallets()
        setWallets(
          loadedWallets.map((w) => ({
            id: w.id,
            address: w.address,
            balance: w.balance || 0,
            selected: false,
          })),
        )
      } catch (error) {
        console.error("Failed to load wallets:", error)
      }
    }

    loadWallets()
  }, [walletSDK])

  // Handle bot errors
  useEffect(() => {
    if (botError) {
      console.error("Bot error:", botError)
    }
  }, [botError])

  // Log bot status changes
  useEffect(() => {
    console.log("Bot status changed:", botStatus)
  }, [botStatus])

  // Log price history changes
  useEffect(() => {
    console.log("Price history updated, length:", priceHistory.length)
  }, [priceHistory])

  // Inside the TradingPage component, add this state:

  // Add state for candlestick data
  const [candlestickData, setCandlestickData] = useState<any[]>([])

  // Add this effect to convert price history to candlestick data
  useEffect(() => {
    if (priceHistory.length === 0) return

    // Group price points into 5-minute buckets
    const timeframeMs = 5 * 60 * 1000 // 5 minutes in milliseconds
    const buckets: Record<string, any[]> = {}

    priceHistory.forEach((point) => {
      // Round timestamp to nearest 5 minutes
      const bucketTime = Math.floor(point.timestamp / timeframeMs) * timeframeMs
      if (!buckets[bucketTime]) {
        buckets[bucketTime] = []
      }
      buckets[bucketTime].push(point)
    })

    // Convert buckets to candlestick data
    const candles = Object.entries(buckets)
      .map(([timestamp, points]) => {
        const prices = points.map((p) => p.price)
        return {
          timestamp: Number.parseInt(timestamp),
          open: prices[0],
          high: Math.max(...prices),
          low: Math.min(...prices),
          close: prices[prices.length - 1],
          volume: points.length * (Math.random() * 1000 + 500), // Simulate volume
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)

    setCandlestickData(candles)
  }, [priceHistory])

  const generateWallets = async () => {
    // Ensure minimum of 5 wallets
    const count = Math.max(5, walletCount)
    try {
      const newWallets = walletSDK.generateWallets(count)
      setWallets((prev) => [
        ...prev,
        ...newWallets.map((w) => ({
          id: w.id,
          address: w.address,
          balance: w.balance || 0,
          selected: false,
        })),
      ])
    } catch (error) {
      console.error("Failed to generate wallets:", error)
    }
  }

  const fundWallets = async () => {
    // Get the fund amount from the input field
    const fundAmountInput = document.getElementById("fundAmount") as HTMLInputElement
    const amount = Math.max(0.01, Number.parseFloat(fundAmountInput?.value || "0.01"))

    try {
      const selectedWalletAddresses = wallets.filter((w) => w.selected).map((w) => w.address)

      if (selectedWalletAddresses.length === 0) return

      // Update wallet balances in the UI directly since we don't have a real funding mechanism in the demo
      setWallets(wallets.map((wallet) => (wallet.selected ? { ...wallet, balance: wallet.balance + amount } : wallet)))
    } catch (error) {
      console.error("Failed to fund wallets:", error)
    }
  }

  const burnWallets = async () => {
    try {
      const selectedWalletIds = wallets.filter((w) => w.selected).map((w) => w.id)

      if (selectedWalletIds.length === 0) return

      // Remove selected wallets from the UI
      setWallets(wallets.filter((wallet) => !wallet.selected))
      setSelectAll(false)
    } catch (error) {
      console.error("Failed to burn wallets:", error)
    }
  }

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setWallets(wallets.map((wallet) => ({ ...wallet, selected: newSelectAll })))
  }

  const toggleWalletSelection = (id: string) => {
    const updatedWallets = wallets.map((wallet) =>
      wallet.id === id ? { ...wallet, selected: !wallet.selected } : wallet,
    )
    setWallets(updatedWallets)
    setSelectAll(updatedWallets.every((wallet) => wallet.selected) && updatedWallets.length > 0)
  }

  const handleMenuClick = (menu: string, e: React.MouseEvent) => {
    e.preventDefault()
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    })
    setActiveMenu(activeMenu === menu ? null : menu)
  }

  // Add handler for settings dialog
  const handleSettingsDialogOpen = (dialogName: string) => {
    setActiveSettingsDialog(dialogName)
    // Close any open menu
    setActiveMenu(null)
  }

  const handleSettingsDialogClose = () => {
    setActiveSettingsDialog(null)
  }

  const handleBotConfigChange = (field: keyof BotConfig, value: string | number | object) => {
    const newConfig = {
      ...botConfig,
      [field]: value,
    }

    setBotConfig(newConfig)

    // If the bot is already running, update its configuration
    if (botRunning) {
      updateConfig({ [field]: value })
    }
  }

  // Add a function to cycle through strategy modes and update form values
  const cycleStrategyMode = (direction: "next" | "prev") => {
    const currentIndex = strategyModes.findIndex((mode) => mode.id === botConfig.strategyMode)
    let newIndex

    if (direction === "next") {
      newIndex = (currentIndex + 1) % strategyModes.length
    } else {
      newIndex = (currentIndex - 1 + strategyModes.length) % strategyModes.length
    }

    const newStrategy = strategyModes[newIndex]

    // Update the bot config with the new strategy's default values
    const newConfig = {
      ...botConfig,
      strategyMode: newStrategy.id,
      minTradeAmount: newStrategy.config.minTradeAmount.value,
      maxTradeAmount: newStrategy.config.maxTradeAmount.value,
      tradesPerInterval: newStrategy.config.tradesPerInterval.value,
      intervalMinutes: newStrategy.config.intervalMinutes.value,
      numberOfBuys: newStrategy.config.numberOfBuys.value,
      numberOfSells: newStrategy.config.numberOfSells.value,
    }

    setBotConfig(newConfig)

    // If the bot is already running, update its configuration
    if (botRunning) {
      updateConfig(newConfig)
    }
  }

  // Add the cyclePlatform function after the cycleStrategyMode function
  const cyclePlatform = (direction: "next" | "prev") => {
    const currentIndex = platforms.findIndex((platform) => platform.id === botConfig.platform)
    let newIndex

    if (direction === "next") {
      newIndex = (currentIndex + 1) % platforms.length
    } else {
      newIndex = (currentIndex - 1 + platforms.length) % platforms.length
    }

    const newPlatform = platforms[newIndex]

    // Update the bot config with the new platform
    const newConfig = {
      ...botConfig,
      platform: newPlatform.id,
    }

    setBotConfig(newConfig)

    // If the bot is already running, update its configuration
    if (botRunning) {
      updateConfig({ platform: newPlatform.id })
    }
  }

  // Simplified toggleBotRunning function to reduce complexity
  const toggleBotRunning = useCallback(
    async (platform: string, strategyMode: string, config: BotConfig) => {
      if (botRunning) {
        console.log("Stopping bot...")
        stopBot()
        return
      }

      // Switch to Bot tab when starting the bot
      setActiveTab("Bot")

      // Ensure we have a token address
      if (!config.tokenAddress.trim()) {
        config.tokenAddress = "So11111111111111111111111111111111111111112" // Default to SOL token
      }

      try {
        console.log("Starting bot with config:", config)

        // Always initialize the bot with fresh config
        await initializeBot(config.tokenAddress, {
          ...config,
          platform: platform.toUpperCase(),
          strategyMode: strategyMode.toUpperCase(),
        })

        console.log("Bot initialized, starting...")
        const success = await startBot()
        console.log("Bot start result:", success)

        if (!success) {
          console.error("Failed to start bot")
        }
      } catch (error) {
        console.error("Error in toggleBotRunning:", error)
      }
    },
    [botRunning, initializeBot, startBot, stopBot],
  )

  const saveBotConfig = useCallback(() => {
    // Update the bot configuration
    updateConfig(botConfig)
  }, [botConfig, updateConfig])

  // Update the main layout to be responsive
  return (
    <div className="flex flex-col h-screen text-white font-poppins">
      {/* Top navigation bar */}
      <TopNavigation activeMenu={activeMenu} handleMenuClick={handleMenuClick} />

      {/* Menu Dialogs */}
      <Dialogs
        activeMenu={activeMenu}
        menuPosition={menuPosition}
        dialogRef={dialogRef}
        onClose={() => setActiveMenu(null)}
        onOpenSettings={handleSettingsDialogOpen}
      />

      {/* Settings Dialogs - rendered at the root level */}
      {activeSettingsDialog === "generalSettings" && <GeneralSettingsDialog onClose={handleSettingsDialogClose} />}

      {activeSettingsDialog === "riskManagement" && <RiskManagementDialog onClose={handleSettingsDialogClose} />}

      {/* Mobile sidebar toggle buttons - only visible on small screens */}
      <div className="md:hidden flex justify-between px-2 py-1 border-b border-[#222]">
        <button
          className="px-3 py-1 bg-[#222] rounded text-xs"
          onClick={() => setActiveTab(activeTab === "Wallets" ? "Bot" : "Wallets")}
        >
          {activeTab === "Wallets" ? "Show Bot" : "Show Wallets"}
        </button>
        <button
          className="px-3 py-1 bg-[#222] rounded text-xs"
          onClick={() => setActiveRightTab(activeRightTab === "Stats" ? "Logs" : "Stats")}
        >
          {activeRightTab === "Stats" ? "Show Logs" : "Show Stats"}
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative" style={{ height: "calc(100vh - 80px)" }}>
        {/* Left sidebar - responsive */}
        <div className="w-[300px] border-r border-[#222]">
          <LeftSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            wallets={wallets}
            walletCount={walletCount}
            selectAll={selectAll}
            botConfig={botConfig}
            botRunning={botRunning}
            isLoading={isLoading}
            strategyModes={strategyModes}
            platforms={platforms}
            selectedPlatform={botConfig.platform}
            setWalletCount={setWalletCount}
            generateWallets={generateWallets}
            fundWallets={fundWallets}
            burnWallets={burnWallets}
            toggleSelectAll={toggleSelectAll}
            toggleWalletSelection={toggleWalletSelection}
            handleBotConfigChange={handleBotConfigChange}
            toggleBotRunning={toggleBotRunning}
            saveBotConfig={saveBotConfig}
            cycleStrategyMode={cycleStrategyMode}
            cyclePlatform={cyclePlatform}
          />
        </div>

        {/* Main content area - responsive */}
        <div className="flex-1 overflow-hidden">
            <iframe
          src="https://dexscreener.com/solana/37iwfsqgntsafshobtbzqghwsttkwazw3yvzgjwkn6ik?embed=1&theme=dark&trades=0&info=0"
          width="100%"
          height="500px"
          loading="lazy"
          title="Dexscreener Chart"
          className="w-full"
        >
        </iframe> 
        </div>

        {/* Right sidebar - responsive */}
        <div className="w-[300px] border-l border-[#222]">
          <RightSidebar
            activeTab={activeRightTab}
            setActiveTab={setActiveRightTab}
            marketData={marketData}
            activityLogs={activityLogs}
            pairData={pairData}
            botRunning={botRunning}
            clearLogs={clearLogs}
            botStats={botStats || { totalBuys: 0, totalSells: 0, totalVolume: 0, avgPrice: 0 }}
          />
        </div>
      </div>

      {/* Trade Ticker */}
      <TradeTicker trades={recentTrades} pairData={pairData} botRunning={botRunning} />
    </div>
  )
}
