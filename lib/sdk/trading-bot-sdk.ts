import { EventEmitter } from "events"
import type { Wallet } from "./types"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import { RaydiumAdapter } from "./platforms/raydium-adapter"
import { PumpFunAdapter } from "./platforms/pumpfun-adapter"
import { PumpSwapAdapter } from "./platforms/pumpswap-adapter"

export interface TransactionResult {
  success: boolean
  hash?: string
  error?: string
  timestamp: Date
  type: "buy" | "sell"
  amount: number
  tokenAddress: string
  walletAddress: string
}

export interface TradingBotStats {
  totalTrades: number
  successfulTrades: number
  failedTrades: number
  buyVolume: number
  sellVolume: number
  totalVolume: number
  startTime: number
  lastTradeTime: number | null
  uptime: number
}

export interface PlatformInfo {
  id: string
  name: string
  poolOwnerPublicKey?: string
}

export interface PoolInfo {
  poolAddress: string
  programId: string
  programName: string
}

export interface TradingBotConfig extends BotConfig {
  platformInfo: PlatformInfo
  poolInfo: PoolInfo
  devPrivateKey: string
  duration: number // in milliseconds
}

export type TradingBotStatus = "idle" | "initializing" | "running" | "paused" | "stopping" | "stopped" | "error"

export class TradingBotSDK extends EventEmitter {
  private status: TradingBotStatus = "idle"
  private config: TradingBotConfig | null = null
  private wallets: Wallet[] = []
  private stats: TradingBotStats = {
    totalTrades: 0,
    successfulTrades: 0,
    failedTrades: 0,
    buyVolume: 0,
    sellVolume: 0,
    totalVolume: 0,
    startTime: 0,
    lastTradeTime: null,
    uptime: 0,
  }
  private platformAdapter: any = null
  private tradeInterval: NodeJS.Timeout | null = null
  private statsInterval: NodeJS.Timeout | null = null
  private stopRequested = false
  private tradeQueue: Array<{ type: "buy" | "sell"; amount: number; walletIndex: number }> = []

  constructor() {
    super()
  }

  /**
   * Initialize the trading bot with configuration and wallets
   */
  public async initialize(config: TradingBotConfig, wallets: Wallet[]): Promise<boolean> {
    try {
      this.setStatus("initializing")
      this.config = config
      this.wallets = wallets.filter((wallet) => wallet.selected)

      if (this.wallets.length === 0) {
        throw new Error("No wallets selected for trading")
      }

      // Initialize the appropriate platform adapter
      this.platformAdapter = this.createPlatformAdapter(config.platformInfo.id)

      // Initialize the platform adapter with configuration
      await this.platformAdapter.initialize({
        tokenAddress: config.tokenAddress,
        poolAddress: config.poolInfo.poolAddress,
        programId: config.poolInfo.programId,
        devPrivateKey: config.devPrivateKey,
      })

      // Log initialization
      this.emit("log", {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "info",
        message: `Bot initialized for ${config.platformInfo.name} with ${this.wallets.length} wallets`,
      })

      this.setStatus("idle")
      return true
    } catch (error) {
      this.setStatus("error")
      this.emit("error", error)
      this.emit("log", {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "error",
        message: `Initialization error: ${error instanceof Error ? error.message : String(error)}`,
      })
      return false
    }
  }

  /**
   * Start the trading bot
   */
  public async start(): Promise<boolean> {
    try {
      if (!this.config || !this.platformAdapter) {
        throw new Error("Bot not initialized")
      }

      if (this.status === "running") {
        return true // Already running
      }

      this.stopRequested = false
      this.stats.startTime = Date.now()
      this.setStatus("running")

      // Generate trade queue based on configuration
      this.generateTradeQueue()

      // Start the trade execution loop
      this.startTradeLoop()

      // Start stats update interval
      this.startStatsInterval()

      // Log start
      this.emit("log", {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "success",
        message: "Bot started successfully",
      })

      return true
    } catch (error) {
      this.setStatus("error")
      this.emit("error", error)
      this.emit("log", {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "error",
        message: `Start error: ${error instanceof Error ? error.message : String(error)}`,
      })
      return false
    }
  }

  /**
   * Stop the trading bot
   */
  public async stop(): Promise<boolean> {
    try {
      if (this.status !== "running" && this.status !== "paused") {
        return true // Not running
      }

      this.setStatus("stopping")
      this.stopRequested = true

      // Clear intervals
      if (this.tradeInterval) {
        clearInterval(this.tradeInterval)
        this.tradeInterval = null
      }

      if (this.statsInterval) {
        clearInterval(this.statsInterval)
        this.statsInterval = null
      }

      // Wait for any pending transactions to complete
      await new Promise((resolve) => setTimeout(resolve, 1000))

      this.setStatus("stopped")

      // Log stop
      this.emit("log", {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "info",
        message: "Bot stopped",
      })

      return true
    } catch (error) {
      this.setStatus("error")
      this.emit("error", error)
      this.emit("log", {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "error",
        message: `Stop error: ${error instanceof Error ? error.message : String(error)}`,
      })
      return false
    }
  }

  /**
   * Pause the trading bot
   */
  public pause(): boolean {
    try {
      if (this.status !== "running") {
        return false // Not running
      }

      // Clear trade interval
      if (this.tradeInterval) {
        clearInterval(this.tradeInterval)
        this.tradeInterval = null
      }

      this.setStatus("paused")

      // Log pause
      this.emit("log", {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "info",
        message: "Bot paused",
      })

      return true
    } catch (error) {
      this.setStatus("error")
      this.emit("error", error)
      return false
    }
  }

  /**
   * Resume the trading bot
   */
  public resume(): boolean {
    try {
      if (this.status !== "paused") {
        return false // Not paused
      }

      // Restart trade loop
      this.startTradeLoop()
      this.setStatus("running")

      // Log resume
      this.emit("log", {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "info",
        message: "Bot resumed",
      })

      return true
    } catch (error) {
      this.setStatus("error")
      this.emit("error", error)
      return false
    }
  }

  /**
   * Get the current status of the trading bot
   */
  public getStatus(): TradingBotStatus {
    return this.status
  }

  /**
   * Get the current stats of the trading bot
   */
  public getStats(): TradingBotStats {
    // Update uptime
    if (this.stats.startTime > 0 && this.status === "running") {
      this.stats.uptime = Date.now() - this.stats.startTime
    }
    return { ...this.stats }
  }

  /**
   * Execute a manual trade
   */
  public async executeManualTrade(
    type: "buy" | "sell",
    amount: number,
    walletIndex = 0,
  ): Promise<TransactionResult | null> {
    try {
      if (!this.config || !this.platformAdapter) {
        throw new Error("Bot not initialized")
      }

      if (walletIndex >= this.wallets.length) {
        throw new Error("Invalid wallet index")
      }

      const wallet = this.wallets[walletIndex]

      // Execute trade through platform adapter
      const result = await this.executeTrade(type, amount, wallet)

      // Update stats
      this.updateStatsWithTrade(result)

      // Emit trade event
      this.emit("trade", result)

      // Log trade
      this.emit("log", {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: result.success ? "success" : "error",
        message: `Manual ${type} executed: ${amount} tokens for wallet ${wallet.address.substring(0, 8)}... ${result.success ? "succeeded" : "failed"}`,
      })

      return result
    } catch (error) {
      this.emit("error", error)
      this.emit("log", {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "error",
        message: `Manual trade error: ${error instanceof Error ? error.message : String(error)}`,
      })
      return null
    }
  }

  /**
   * Update the bot configuration
   */
  public updateConfig(config: Partial<TradingBotConfig>): boolean {
    try {
      if (!this.config) {
        throw new Error("Bot not initialized")
      }

      // Update config
      this.config = { ...this.config, ...config }

      // If running, regenerate trade queue
      if (this.status === "running") {
        this.generateTradeQueue()
      }

      // Log config update
      this.emit("log", {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "info",
        message: "Bot configuration updated",
      })

      return true
    } catch (error) {
      this.emit("error", error)
      return false
    }
  }

  /**
   * Update the wallets list
   */
  public updateWallets(wallets: Wallet[]): boolean {
    try {
      this.wallets = wallets.filter((wallet) => wallet.selected)

      // Log wallets update
      this.emit("log", {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "info",
        message: `Wallets updated: ${this.wallets.length} wallets selected`,
      })

      return true
    } catch (error) {
      this.emit("error", error)
      return false
    }
  }

  // Private methods

  private setStatus(status: TradingBotStatus): void {
    if (this.status !== status) {
      this.status = status
      this.emit("status-change", status)
    }
  }

  private createPlatformAdapter(platformId: string): any {
    // Create the appropriate platform adapter based on the platform ID
    switch (platformId.toUpperCase()) {
      case "RAYDIUM":
        return new RaydiumAdapter()
      case "PUMPFUN":
        return new PumpFunAdapter()
      case "PUMPSWAP":
        return new PumpSwapAdapter()
      default:
        throw new Error(`Unsupported platform: ${platformId}`)
    }
  }

  private generateTradeQueue(): void {
    if (!this.config) return

    // Clear existing queue
    this.tradeQueue = []

    const { numberOfBuys, numberOfSells, minTradeAmount, maxTradeAmount } = this.config
    const totalTrades = numberOfBuys + numberOfSells

    if (totalTrades <= 0) return

    // Calculate trade distribution
    for (let i = 0; i < totalTrades; i++) {
      const type = i < numberOfBuys ? "buy" : "sell"
      const amount = minTradeAmount + Math.random() * (maxTradeAmount - minTradeAmount)
      const walletIndex = Math.floor(Math.random() * this.wallets.length)

      this.tradeQueue.push({ type, amount, walletIndex })
    }

    // Shuffle the queue for more natural distribution
    this.shuffleTradeQueue()
  }

  private shuffleTradeQueue(): void {
    // Fisher-Yates shuffle algorithm
    for (let i = this.tradeQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.tradeQueue[i], this.tradeQueue[j]] = [this.tradeQueue[j], this.tradeQueue[i]]
    }
  }

  private startTradeLoop(): void {
    if (!this.config) return

    // Calculate interval between trades
    const { tradesPerInterval, intervalMinutes, duration } = this.config
    const totalTrades = this.tradeQueue.length

    if (totalTrades === 0) return

    // Calculate time between trades in milliseconds
    const tradeDuration = duration || intervalMinutes * 60 * 1000
    const tradeInterval = tradeDuration / totalTrades

    // Start trade execution loop
    let tradeIndex = 0
    this.tradeInterval = setInterval(async () => {
      if (this.stopRequested || tradeIndex >= totalTrades) {
        // Stop if requested or all trades executed
        if (this.tradeInterval) {
          clearInterval(this.tradeInterval)
          this.tradeInterval = null
        }

        if (tradeIndex >= totalTrades) {
          // All trades executed, stop the bot
          this.stop()
        }

        return
      }

      // Execute next trade in queue
      const trade = this.tradeQueue[tradeIndex++]
      const wallet = this.wallets[trade.walletIndex]

      try {
        const result = await this.executeTrade(trade.type, trade.amount, wallet)

        // Update stats
        this.updateStatsWithTrade(result)

        // Emit trade event
        this.emit("trade", result)

        // Log trade
        this.emit("log", {
          id: Date.now().toString(),
          timestamp: Date.now(),
          type: result.success ? "info" : "warning",
          message: `Bot executed ${trade.type}: ${trade.amount.toFixed(4)} tokens for wallet ${wallet.address.substring(0, 8)}... ${result.success ? "succeeded" : "failed"}`,
        })
      } catch (error) {
        this.emit("error", error)
        this.emit("log", {
          id: Date.now().toString(),
          timestamp: Date.now(),
          type: "error",
          message: `Trade execution error: ${error instanceof Error ? error.message : String(error)}`,
        })
      }
    }, tradeInterval)
  }

  private startStatsInterval(): void {
    // Update stats every 5 seconds
    this.statsInterval = setInterval(() => {
      // Update uptime
      if (this.stats.startTime > 0) {
        this.stats.uptime = Date.now() - this.stats.startTime
      }

      // Emit stats update
      this.emit("stats-update", this.getStats())
    }, 5000)
  }

  private async executeTrade(type: "buy" | "sell", amount: number, wallet: Wallet): Promise<TransactionResult> {
    if (!this.config || !this.platformAdapter) {
      throw new Error("Bot not initialized")
    }

    try {
      // Execute trade through platform adapter
      let result: TransactionResult

      if (type === "buy") {
        result = await this.platformAdapter.buyToken(
          this.config.tokenAddress,
          wallet,
          amount,
          0.5, // Default slippage
        )
      } else {
        result = await this.platformAdapter.sellToken(
          this.config.tokenAddress,
          wallet,
          amount,
          0.5, // Default slippage
        )
      }

      // Add additional information to result
      result.type = type
      result.amount = amount
      result.tokenAddress = this.config.tokenAddress
      result.walletAddress = wallet.address
      result.timestamp = new Date()

      return result
    } catch (error) {
      // Return failed transaction result
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
        type,
        amount,
        tokenAddress: this.config.tokenAddress,
        walletAddress: wallet.address,
      }
    }
  }

  private updateStatsWithTrade(result: TransactionResult): void {
    // Update stats
    this.stats.totalTrades++

    if (result.success) {
      this.stats.successfulTrades++

      if (result.type === "buy") {
        this.stats.buyVolume += result.amount
      } else {
        this.stats.sellVolume += result.amount
      }

      this.stats.totalVolume = this.stats.buyVolume + this.stats.sellVolume
    } else {
      this.stats.failedTrades++
    }

    this.stats.lastTradeTime = Date.now()
  }
}
