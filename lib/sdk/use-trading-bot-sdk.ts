"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Wallet } from "./types"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import {
  TradingBotSDK,
  type TradingBotConfig,
  type TradingBotStatus,
  type TradingBotStats,
  type TransactionResult,
} from "./trading-bot-sdk"

interface UseTradingBotSDKOptions {
  devPrivateKey?: string
}

interface UseTradingBotSDKResult {
  isInitialized: boolean
  status: TradingBotStatus
  stats: TradingBotStats
  logs: Array<{
    id: string
    timestamp: number
    type: "info" | "warning" | "error" | "success"
    message: string
  }>
  trades: TransactionResult[]
  error: Error | null
  isLoading: boolean
  initializeBot: (config: BotConfig, wallets: Wallet[], platformInfo: any, poolInfo: any) => Promise<boolean>
  startBot: () => Promise<boolean>
  stopBot: () => Promise<boolean>
  pauseBot: () => boolean
  resumeBot: () => boolean
  updateConfig: (config: Partial<BotConfig>) => boolean
  updateWallets: (wallets: Wallet[]) => boolean
  executeManualTrade: (type: "buy" | "sell", amount: number, walletIndex?: number) => Promise<TransactionResult | null>
  clearLogs: () => void
}

export function useTradingBotSDK(options: UseTradingBotSDKOptions = {}): UseTradingBotSDKResult {
  const [isInitialized, setIsInitialized] = useState(false)
  const [status, setStatus] = useState<TradingBotStatus>("idle")
  const [stats, setStats] = useState<TradingBotStats>({
    totalTrades: 0,
    successfulTrades: 0,
    failedTrades: 0,
    buyVolume: 0,
    sellVolume: 0,
    totalVolume: 0,
    startTime: 0,
    lastTradeTime: null,
    uptime: 0,
  })
  const [logs, setLogs] = useState<
    Array<{
      id: string
      timestamp: number
      type: "info" | "warning" | "error" | "success"
      message: string
    }>
  >([])
  const [trades, setTrades] = useState<TransactionResult[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Use a ref to store the SDK instance to prevent it from being recreated on each render
  const sdkRef = useRef<TradingBotSDK | null>(null)

  // Initialize the SDK on mount
  useEffect(() => {
    // Only create a new SDK instance if one doesn't exist
    if (!sdkRef.current) {
      sdkRef.current = new TradingBotSDK()
    }

    // Set up event listeners
    const sdk = sdkRef.current

    const handleStatusChange = (newStatus: TradingBotStatus) => {
      console.log("Hook: Status changed to", newStatus)
      setStatus(newStatus)
    }

    const handleStatsUpdate = (newStats: TradingBotStats) => {
      setStats(newStats)
    }

    const handleLog = (log: any) => {
      setLogs((prevLogs) => [...prevLogs, log])
    }

    const handleTrade = (trade: TransactionResult) => {
      setTrades((prevTrades) => [...prevTrades, trade])
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
    sdk.on("error", handleError)

    return () => {
      // Remove event listeners
      sdk.off("status-change", handleStatusChange)
      sdk.off("stats-update", handleStatsUpdate)
      sdk.off("log", handleLog)
      sdk.off("trade", handleTrade)
      sdk.off("error", handleError)
    }
  }, [])

  // Initialize the bot
  const initializeBot = useCallback(
    async (config: BotConfig, wallets: Wallet[], platformInfo: any, poolInfo: any): Promise<boolean> => {
      if (!sdkRef.current) return false

      setIsLoading(true)
      setError(null)

      try {
        console.log("Hook: Initializing bot with config:", config, "platform:", platformInfo, "pool:", poolInfo)

        // Create full trading bot config
        const tradingBotConfig: TradingBotConfig = {
          ...config,
          platformInfo,
          poolInfo,
          devPrivateKey: options.devPrivateKey || "",
          duration: config.intervalMinutes * 60 * 1000, // Convert minutes to milliseconds
        }

        const success = await sdkRef.current.initialize(tradingBotConfig, wallets)
        setIsInitialized(success)
        setIsLoading(false)
        return success
      } catch (err) {
        console.error("Hook: Bot initialization error:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
        setIsLoading(false)
        return false
      }
    },
    [options.devPrivateKey],
  )

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
  const stopBot = useCallback(async (): Promise<boolean> => {
    if (!sdkRef.current) return false

    try {
      console.log("Hook: Stopping bot")
      return await sdkRef.current.stop()
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
      return sdkRef.current.updateConfig(config as Partial<TradingBotConfig>)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return false
    }
  }, [])

  // Update the wallets
  const updateWallets = useCallback((wallets: Wallet[]): boolean => {
    if (!sdkRef.current) return false

    try {
      return sdkRef.current.updateWallets(wallets)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return false
    }
  }, [])

  // Execute a manual trade
  const executeManualTrade = useCallback(
    async (type: "buy" | "sell", amount: number, walletIndex = 0): Promise<TransactionResult | null> => {
      if (!sdkRef.current) return null

      try {
        return await sdkRef.current.executeManualTrade(type, amount, walletIndex)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
        return null
      }
    },
    [],
  )

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
    error,
    isLoading,
    initializeBot,
    startBot,
    stopBot,
    pauseBot,
    resumeBot,
    updateConfig,
    updateWallets,
    executeManualTrade,
    clearLogs,
  }
}
