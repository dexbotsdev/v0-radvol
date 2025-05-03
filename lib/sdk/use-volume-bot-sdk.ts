"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { BotConfig, ActivityLog, Trade, MarketData, PairData } from "@/app/(dashboard)/trading/types"
import { VolumeBotSDK, type PriceDataPoint, type VolumeBotStats, type VolumeBotStatus } from "./volume-bot-sdk"
import type { WalletSDK } from "./wallet-sdk"
import type { StrategyInfo } from "./services/interfaces"

interface UseVolumeBotSDKOptions {
  rpcUrl: string
  walletSDK: WalletSDK
  storageNamespace?: string
  walletKeys?: {
    mainWalletKey?: string
    fundingWalletKey?: string
  }
}

interface UseVolumeBotSDKResult {
  isInitialized: boolean
  status: VolumeBotStatus
  stats: VolumeBotStats
  logs: ActivityLog[]
  trades: Trade[]
  marketData: MarketData | null
  pairData: PairData | null
  priceHistory: PriceDataPoint[]
  availableStrategies: StrategyInfo[]
  error: Error | null
  isLoading: boolean
  initializeBot: (tokenAddress: string, config: BotConfig) => Promise<boolean>
  startBot: () => Promise<boolean>
  stopBot: () => boolean
  pauseBot: () => boolean
  resumeBot: () => boolean
  updateConfig: (config: Partial<BotConfig>) => boolean
  executeManualTrade: (type: "buy" | "sell", amount: number) => Promise<Trade | null>
  clearLogs: () => void
}

export function useVolumeBotSDK(options: UseVolumeBotSDKOptions): UseVolumeBotSDKResult {
  const [isInitialized, setIsInitialized] = useState(false)
  const [status, setStatus] = useState<VolumeBotStatus>("idle")
  const [stats, setStats] = useState<VolumeBotStats>({
    totalTrades: 0,
    totalVolume: 0,
    buyVolume: 0,
    sellVolume: 0,
    averageTradeSize: 0,
    lastTradeTime: null,
    startTime: 0,
    uptime: 0,
    successRate: 100,
  })
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [pairData, setPairData] = useState<PairData | null>(null)
  const [priceHistory, setPriceHistory] = useState<PriceDataPoint[]>([])
  const [availableStrategies, setAvailableStrategies] = useState<StrategyInfo[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Use a ref to store the SDK instance to prevent it from being recreated on each render
  const sdkRef = useRef<VolumeBotSDK | null>(null)
  // Use a ref to track if initial price history has been set
  const initializedRef = useRef(false)
  // Use a ref to store the current wallet keys to compare with new ones
  const walletKeysRef = useRef(options.walletKeys || { mainWalletKey: undefined, fundingWalletKey: undefined })

  // Initialize the SDK on mount
  useEffect(() => {
    console.log("Initializing SDK with options:", options)

    // Only create a new SDK instance if one doesn't exist
    if (!sdkRef.current) {
      sdkRef.current = new VolumeBotSDK({
        rpcUrl: options.rpcUrl,
        walletSDK: options.walletSDK,
        storageNamespace: options.storageNamespace,
      })

      // Set initial price history only once during initialization
      if (!initializedRef.current) {
        const initialPriceHistory = sdkRef.current.getPriceHistory()
        setPriceHistory(initialPriceHistory)
        initializedRef.current = true
      }
    }

    // Set up event listeners
    const sdk = sdkRef.current

    const handleStatusChange = (newStatus: VolumeBotStatus) => {
      console.log("Hook: Status changed to", newStatus)
      setStatus(newStatus)
    }

    const handleStatsUpdate = (newStats: VolumeBotStats) => {
      setStats(newStats)
    }

    const handleLog = (log: ActivityLog) => {
      setLogs((prevLogs) => [...prevLogs, log])
    }

    const handleTrade = (trade: Trade) => {
      setTrades((prevTrades) => [...prevTrades, trade])
    }

    const handleMarketData = (data: MarketData) => {
      setMarketData(data)
    }

    const handlePairData = (data: PairData) => {
      setPairData(data)
    }

    const handlePriceUpdate = (pricePoint: PriceDataPoint) => {
      console.log("Hook: Price update received", pricePoint)
      setPriceHistory((prev) => [...prev, pricePoint].slice(-100))
    }

    const handleStrategiesUpdate = (strategies: StrategyInfo[]) => {
      setAvailableStrategies(strategies)
    }

    const handleError = (err: Error) => {
      console.error("Hook: Error from SDK", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      setIsLoading(false)
    }

    // Add event listeners
    sdk.on("status-change", handleStatusChange)
    sdk.on("stats-update", handleStatsUpdate)
    sdk.on("log", handleLog)
    sdk.on("trade", handleTrade)
    sdk.on("market-data", handleMarketData)
    sdk.on("pair-data", handlePairData)
    sdk.on("price-update", handlePriceUpdate)
    sdk.on("strategies-update", handleStrategiesUpdate)
    sdk.on("error", handleError)

    return () => {
      // Remove event listeners
      sdk.off("status-change", handleStatusChange)
      sdk.off("stats-update", handleStatsUpdate)
      sdk.off("log", handleLog)
      sdk.off("trade", handleTrade)
      sdk.off("market-data", handleMarketData)
      sdk.off("pair-data", handlePairData)
      sdk.off("price-update", handlePriceUpdate)
      sdk.off("strategies-update", handleStrategiesUpdate)
      sdk.off("error", handleError)
    }
  }, [options.rpcUrl, options.storageNamespace]) // Only depend on these stable props

  // Handle wallet key updates separately to avoid infinite loops
  useEffect(() => {
    // Skip if SDK is not initialized or wallet keys haven't changed
    if (!sdkRef.current || !options.walletKeys) return

    const currentKeys = walletKeysRef.current
    const newKeys = options.walletKeys

    // Only update if keys have actually changed
    if (
      currentKeys.mainWalletKey !== newKeys.mainWalletKey ||
      currentKeys.fundingWalletKey !== newKeys.fundingWalletKey
    ) {
      console.log("Wallet keys changed, updating SDK configuration")

      // Update the ref with new values
      walletKeysRef.current = {
        mainWalletKey: newKeys.mainWalletKey,
        fundingWalletKey: newKeys.fundingWalletKey,
      }

      // Update the wallet SDK with new keys if needed
      if (newKeys.mainWalletKey && options.walletSDK) {
        options.walletSDK.setMainWalletKey?.(newKeys.mainWalletKey)
      }

      // No need to call updateConfig here as it will be called explicitly when needed
    }
  }, [options.walletKeys, options.walletSDK])

  // Initialize the bot
  const initializeBot = useCallback(async (tokenAddress: string, config: BotConfig): Promise<boolean> => {
    if (!sdkRef.current) return false

    setIsLoading(true)
    setError(null)

    try {
      console.log("Hook: Initializing bot with token:", tokenAddress, "and config:", config)

      const success = await sdkRef.current.initialize(tokenAddress, config)
      setIsInitialized(success)
      setIsLoading(false)
      return success
    } catch (err) {
      console.error("Hook: Bot initialization error:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      setIsLoading(false)
      return false
    }
  }, [])

  // Start the bot
  const startBot = useCallback(async (): Promise<boolean> => {
    if (!sdkRef.current) return false

    setIsLoading(true)
    setError(null)

    try {
      console.log("Hook: Starting bot")
      const success = await sdkRef.current.start()
      setIsLoading(false)
      return success
    } catch (err) {
      console.error("Hook: Bot start error:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      setIsLoading(false)
      return false
    }
  }, [])

  // Stop the bot
  const stopBot = useCallback((): boolean => {
    if (!sdkRef.current) return false

    try {
      console.log("Hook: Stopping bot")
      return sdkRef.current.stop()
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return false
    }
  }, [])

  // Pause the bot
  const pauseBot = useCallback((): boolean => {
    if (!sdkRef.current) return false

    try {
      return sdkRef.current.pause()
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return false
    }
  }, [])

  // Resume the bot
  const resumeBot = useCallback((): boolean => {
    if (!sdkRef.current) return false

    try {
      return sdkRef.current.resume()
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return false
    }
  }, [])

  // Update the bot configuration
  const updateConfig = useCallback((config: Partial<BotConfig>): boolean => {
    if (!sdkRef.current) return false

    try {
      return sdkRef.current.updateConfig(config)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return false
    }
  }, [])

  // Execute a manual trade
  const executeManualTrade = useCallback(async (type: "buy" | "sell", amount: number): Promise<Trade | null> => {
    if (!sdkRef.current) return null

    try {
      return await sdkRef.current.executeManualTrade(type, amount)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }, [])

  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  return {
    isInitialized,
    status,
    stats,
    logs,
    trades,
    marketData,
    pairData,
    priceHistory,
    availableStrategies,
    error,
    isLoading,
    initializeBot,
    startBot,
    stopBot,
    pauseBot,
    resumeBot,
    updateConfig,
    executeManualTrade,
    clearLogs,
  }
}
