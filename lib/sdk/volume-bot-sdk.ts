import { EventEmitter } from "events"
import type { BotConfig, ActivityLog, Trade, MarketData, PairData } from "@/app/(dashboard)/trading/types"
import type { WalletSDK } from "./wallet-sdk"
import type { StrategyInfo } from "./services/interfaces"
import { fetchTokenPairByAddress, fetchPairByAddress } from "@/lib/services/dexscreener-api"

export type VolumeBotStatus = "idle" | "initializing" | "running" | "paused" | "stopped" | "error"

export interface PriceDataPoint {
  timestamp: number
  price: number
}

export interface VolumeBotStats {
  totalTrades: number
  totalVolume: number
  buyVolume: number
  sellVolume: number
  averageTradeSize: number
  lastTradeTime: number | null
  startTime: number
  uptime: number
  successRate: number
}

interface VolumeBotSDKOptions {
  rpcUrl: string
  walletSDK: WalletSDK
  storageNamespace?: string
}

export class VolumeBotSDK extends EventEmitter {
  private rpcUrl: string
  private walletSDK: WalletSDK
  private storageNamespace: string
  private status: VolumeBotStatus = "idle"
  private config: BotConfig | null = null
  private tokenAddress: string | null = null
  private pairAddress: string | null = null
  private chainId: string | null = null
  private stats: VolumeBotStats
  private priceHistory: PriceDataPoint[] = []
  private marketData: MarketData | null = null
  private pairData: PairData | null = null
  private updateInterval: NodeJS.Timeout | null = null
  private priceUpdateInterval: NodeJS.Timeout | null = null
  private tradeInterval: NodeJS.Timeout | null = null
  private pairDataInterval: NodeJS.Timeout | null = null
  private lastPrice = 0.0
  private availableStrategies: StrategyInfo[] = []

  constructor(options: VolumeBotSDKOptions) {
    super()
    this.rpcUrl = options.rpcUrl
    this.walletSDK = options.walletSDK
    this.storageNamespace = options.storageNamespace || "volume-bot"

    // Initialize stats
    this.stats = {
      totalTrades: 0,
      totalVolume: 0,
      buyVolume: 0,
      sellVolume: 0,
      averageTradeSize: 0,
      lastTradeTime: null,
      startTime: 0,
      uptime: 0,
      successRate: 100,
    }

    // Generate mock available strategies
    this.generateMockStrategies()
  }

  // Public methods
  public async initialize(tokenAddress: string, config: BotConfig): Promise<boolean> {
    try {
      console.log("SDK: Initializing bot with token:", tokenAddress, "and config:", config)
      this.setStatus("initializing")

      // Store token address and config
      this.tokenAddress = tokenAddress
      this.config = config

      // Log initialization
      this.addLog({
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "info",
        message: `Bot initialized for token ${tokenAddress}`,
      })

      // Fetch initial pair data from DEX Screener
      const pairData = await this.fetchInitialPairData(tokenAddress)

      if (pairData) {
        this.pairData = pairData
        this.pairAddress = pairData.pairAddress
        this.chainId = pairData.chainId
        this.lastPrice = Number.parseFloat(pairData.priceNative) || 0.0001

        // Initialize price history with current price
        this.priceHistory = [
          {
            timestamp: Date.now(),
            price: this.lastPrice,
          },
        ]

        // Generate market data from pair data
        this.generateMarketDataFromPair(pairData)

        this.addLog({
          id: Date.now().toString(),
          timestamp: Date.now(),
          type: "success",
          message: `Found token pair: ${pairData.baseToken.symbol}/${pairData.quoteToken.symbol} on ${pairData.dexId}`,
        })

        // Emit pair data
        this.emit("pair-data", pairData)
      } else {
        this.addLog({
          id: Date.now().toString(),
          timestamp: Date.now(),
          type: "warning",
          message: `No pair data found for token ${tokenAddress}. Using simulated data.`,
        })

        // Generate simulated data if no pair data found
        this.generateSimulatedPairData(tokenAddress)
      }

      // Set status to idle
      this.setStatus("idle")

      return true
    } catch (error) {
      console.error("SDK: Initialization error:", error)
      this.setStatus("error")
      this.emit("error", error instanceof Error ? error : new Error(String(error)))
      return false
    }
  }

  public async start(): Promise<boolean> {
    try {
      console.log("SDK: Starting bot")
      if (!this.tokenAddress || !this.config) {
        throw new Error("Bot not initialized")
      }

      // Set start time
      this.stats.startTime = Date.now()

      // Start update intervals
      this.startUpdateIntervals()

      // Set status to running
      this.setStatus("running")

      // Log start
      this.addLog({
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "success",
        message: "Bot started successfully",
      })

      return true
    } catch (error) {
      console.error("SDK: Start error:", error)
      this.setStatus("error")
      this.emit("error", error instanceof Error ? error : new Error(String(error)))
      return false
    }
  }

  public stop(): boolean {
    try {
      console.log("SDK: Stopping bot")
      // Stop update intervals
      this.stopUpdateIntervals()

      // Set status to stopped
      this.setStatus("stopped")

      // Log stop
      this.addLog({
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "info",
        message: "Bot stopped",
      })

      return true
    } catch (error) {
      console.error("SDK: Stop error:", error)
      this.setStatus("error")
      this.emit("error", error instanceof Error ? error : new Error(String(error)))
      return false
    }
  }

  public pause(): boolean {
    try {
      // Stop update intervals
      this.stopUpdateIntervals()

      // Set status to paused
      this.setStatus("paused")

      // Log pause
      this.addLog({
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "info",
        message: "Bot paused",
      })

      return true
    } catch (error) {
      this.setStatus("error")
      this.emit("error", error instanceof Error ? error : new Error(String(error)))
      return false
    }
  }

  public resume(): boolean {
    try {
      if (!this.tokenAddress || !this.config) {
        throw new Error("Bot not initialized")
      }

      // Start update intervals
      this.startUpdateIntervals()

      // Set status to running
      this.setStatus("running")

      // Log resume
      this.addLog({
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "info",
        message: "Bot resumed",
      })

      return true
    } catch (error) {
      this.setStatus("error")
      this.emit("error", error instanceof Error ? error : new Error(String(error)))
      return false
    }
  }

  public updateConfig(config: Partial<BotConfig>): boolean {
    try {
      if (!this.config) {
        throw new Error("Bot not initialized")
      }

      // Update config
      this.config = { ...this.config, ...config }

      // Log config update
      this.addLog({
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "info",
        message: "Bot configuration updated",
      })

      return true
    } catch (error) {
      this.emit("error", error instanceof Error ? error : new Error(String(error)))
      return false
    }
  }

  public async executeManualTrade(type: "buy" | "sell", amount: number): Promise<Trade | null> {
    try {
      if (!this.tokenAddress || !this.config) {
        throw new Error("Bot not initialized")
      }

      // Generate mock trade
      const trade: Trade = {
        id: `trade-${Date.now()}`,
        timestamp: Date.now(),
        type,
        amount,
        price: this.lastPrice,
        total: amount * this.lastPrice,
        fee: amount * this.lastPrice * 0.001,
        status: "completed",
        txHash: `0x${Math.random().toString(16).substring(2, 10)}`,
      }

      // Update stats
      this.updateStatsWithTrade(trade)

      // Emit trade
      this.emit("trade", trade)

      // Log trade
      this.addLog({
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "success",
        message: `Manual ${type} executed: ${amount} tokens at ${this.lastPrice.toFixed(6)}`,
      })

      return trade
    } catch (error) {
      this.emit("error", error instanceof Error ? error : new Error(String(error)))
      return null
    }
  }

  // Get methods
  public getStatus(): VolumeBotStatus {
    return this.status
  }

  public getStats(): VolumeBotStats {
    return this.stats
  }

  public getPriceHistory(): PriceDataPoint[] {
    return this.priceHistory
  }

  public getMarketData(): MarketData | null {
    return this.marketData
  }

  public getPairData(): PairData | null {
    return this.pairData
  }

  public getAvailableStrategies(): StrategyInfo[] {
    return this.availableStrategies
  }

  // Private methods
  private setStatus(status: VolumeBotStatus): void {
    if (this.status !== status) {
      this.status = status
      console.log("SDK: Status changed to", status)
      this.emit("status-change", status)
    }
  }

  private addLog(log: ActivityLog): void {
    this.emit("log", log)
  }

  private startUpdateIntervals(): void {
    // Stop existing intervals if any
    this.stopUpdateIntervals()

    // Start stats update interval (every 5 seconds)
    this.updateInterval = setInterval(() => {
      this.updateStats()
    }, 5000)

    // Start price update interval (every 1 second for more real-time feel)
    this.priceUpdateInterval = setInterval(() => {
      this.updatePrice()
    }, 1000)

    // Start trade interval (random trades every 5-15 seconds)
    this.tradeInterval = setInterval(
      () => {
        this.generateRandomTrade()
      },
      Math.random() * 10000 + 5000,
    )

    // Start pair data update interval (every 30 seconds)
    if (this.pairAddress && this.chainId) {
      this.pairDataInterval = setInterval(() => {
        this.updatePairData()
      }, 30000) // Update pair data every 30 seconds
    }
  }

  private stopUpdateIntervals(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }

    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval)
      this.priceUpdateInterval = null
    }

    if (this.tradeInterval) {
      clearInterval(this.tradeInterval)
      this.tradeInterval = null
    }

    if (this.pairDataInterval) {
      clearInterval(this.pairDataInterval)
      this.pairDataInterval = null
    }
  }

  private updateStats(): void {
    if (this.status === "running") {
      // Update uptime
      this.stats.uptime = Date.now() - this.stats.startTime

      // Emit stats update
      this.emit("stats-update", this.stats)
    }
  }

  private updatePrice(): void {
    if (this.status === "running") {
      let newPrice: number

      if (this.pairData) {
        // Use real price data with small random fluctuations
        // More realistic price movement with occasional larger moves
        const baseVolatility = 0.002 // 0.2% base volatility
        const randomFactor = Math.random()

        // Occasionally generate larger price moves (5% chance)
        const volatility = randomFactor > 0.95 ? baseVolatility * 5 : baseVolatility

        // Generate price movement with slight bias based on recent trend
        const recentPrices = this.priceHistory.slice(-5)
        let trend = 0

        if (recentPrices.length >= 2) {
          // Calculate recent trend direction
          const priceChanges = recentPrices.slice(1).map((p, i) => p.price - recentPrices[i].price)

          trend = priceChanges.reduce((sum, change) => sum + change, 0) > 0 ? 0.3 : -0.3
        }

        // Apply trend bias to random movement (70% random, 30% trend)
        const randomMove = Math.random() * 2 - 1 // -1 to 1
        const biasedMove = randomMove * 0.7 + trend * 0.3

        const change = biasedMove * volatility * this.lastPrice
        newPrice = Math.max(0.000000001, this.lastPrice + change)
      } else {
        // Use simulated price data with higher volatility
        const volatility = 0.01 // 1% volatility for simulated data
        const change = (Math.random() * 2 - 1) * volatility * this.lastPrice
        newPrice = Math.max(0.000000001, this.lastPrice + change)
      }

      // Update last price
      this.lastPrice = newPrice

      // Create price data point
      const pricePoint: PriceDataPoint = {
        timestamp: Date.now(),
        price: this.lastPrice,
      }

      // Add to price history
      this.priceHistory.push(pricePoint)

      // Keep only the last 1000 price points
      if (this.priceHistory.length > 1000) {
        this.priceHistory = this.priceHistory.slice(-1000)
      }

      // Emit price update
      this.emit("price-update", pricePoint)

      // Update market data with new price
      if (this.marketData) {
        const now = Date.now()
        const recentPrices = this.priceHistory.filter((p) => now - p.timestamp < 3600000) // Last hour

        if (recentPrices.length > 1) {
          const prices = recentPrices.map((p) => p.price)
          const high = Math.max(...prices)
          const low = Math.min(...prices)
          const open = recentPrices[0].price
          const close = this.lastPrice

          this.marketData = {
            ...this.marketData,
            time: new Date().toLocaleTimeString(),
            high: high.toFixed(9),
            low: low.toFixed(9),
            open: open.toFixed(9),
            close: close.toFixed(9),
            lastUpdate: now,
          }

          // Emit market data update
          this.emit("market-data", this.marketData)
        }
      }
    }
  }

  private async updatePairData(): Promise<void> {
    if (this.status !== "running" || !this.pairAddress || !this.chainId) return

    try {
      // Fetch updated pair data from DEX Screener
      const updatedPairData = await fetchPairByAddress(this.pairAddress, this.chainId)

      if (updatedPairData) {
        // Update pair data
        this.pairData = updatedPairData

        // Update last price if available
        if (updatedPairData.priceNative) {
          const newPrice = Number.parseFloat(updatedPairData.priceNative)
          if (newPrice > 0) {
            this.lastPrice = newPrice
          }
        }

        // Update market data
        this.generateMarketDataFromPair(updatedPairData)

        // Emit pair data update
        this.emit("pair-data", updatedPairData)

        this.addLog({
          id: Date.now().toString(),
          timestamp: Date.now(),
          type: "info",
          message: `Updated pair data: ${updatedPairData.baseToken.symbol}/${updatedPairData.quoteToken.symbol} price: ${updatedPairData.priceNative}`,
        })
      }
    } catch (error) {
      console.error("Error updating pair data:", error)
      this.addLog({
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "error",
        message: `Failed to update pair data: ${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  private generateRandomTrade(): void {
    if (this.status === "running") {
      // Get trade configuration
      const { minTradeAmount, maxTradeAmount, numberOfBuys, numberOfSells } = this.config || {
        minTradeAmount: 0.01,
        maxTradeAmount: 1.0,
        numberOfBuys: 1,
        numberOfSells: 1,
      }

      // Calculate buy probability based on numberOfBuys and numberOfSells
      const totalTrades = (numberOfBuys || 1) + (numberOfSells || 1)
      const buyProbability = (numberOfBuys || 1) / totalTrades

      // Generate random trade
      const type = Math.random() < buyProbability ? "buy" : "sell"
      const amount = minTradeAmount + Math.random() * (maxTradeAmount - minTradeAmount)
      const price = this.lastPrice
      const total = amount * price

      const trade: Trade = {
        id: `trade-${Date.now()}`,
        timestamp: Date.now(),
        type,
        amount,
        price,
        total,
        fee: total * 0.001,
        status: "completed",
        txHash: `0x${Math.random().toString(16).substring(2, 10)}`,
      }

      // Update stats
      this.updateStatsWithTrade(trade)

      // Emit trade
      this.emit("trade", trade)

      // Log trade
      this.addLog({
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: "info",
        message: `Bot executed ${type}: ${amount.toFixed(2)} tokens at ${price.toFixed(6)}`,
      })
    }
  }

  private updateStatsWithTrade(trade: Trade): void {
    // Update stats
    this.stats.totalTrades += 1
    this.stats.totalVolume += trade.total

    if (trade.type === "buy") {
      this.stats.buyVolume += trade.total
    } else {
      this.stats.sellVolume += trade.total
    }

    this.stats.averageTradeSize = this.stats.totalVolume / this.stats.totalTrades
    this.stats.lastTradeTime = trade.timestamp

    // Emit stats update
    this.emit("stats-update", this.stats)
  }

  private async fetchInitialPairData(tokenAddress: string): Promise<PairData | null> {
    try {
      // Try to fetch pair data from DEX Screener
      const pairData = await fetchTokenPairByAddress(tokenAddress)
      return pairData
    } catch (error) {
      console.error("Error fetching initial pair data:", error)
      return null
    }
  }

  private generateMarketDataFromPair(pairData: PairData): void {
    // Create market data from pair data
    this.marketData = {
      time: new Date().toLocaleTimeString(),
      high: (Number.parseFloat(pairData.priceNative) * 1.01).toFixed(9), // Simulate high as 1% above current price
      low: (Number.parseFloat(pairData.priceNative) * 0.99).toFixed(9), // Simulate low as 1% below current price
      open: (Number.parseFloat(pairData.priceNative) * (1 - (pairData.priceChange?.h24 || 0) / 100)).toFixed(9), // Estimate open price based on 24h change
      close: pairData.priceNative,
      lastUpdate: Date.now(),
      psar: (Number.parseFloat(pairData.priceNative) * 1.005).toFixed(9), // Simulate PSAR
      trend: (pairData.priceChange?.h1 || 0).toFixed(2), // Use 1h price change as trend
      rsi: (50 + (pairData.priceChange?.h1 || 0) * 2).toFixed(2), // Simulate RSI based on price change
    }

    // Emit market data update
    this.emit("market-data", this.marketData)
  }

  private generateSimulatedPairData(tokenAddress: string): void {
    // Create simulated pair data when real data is not available
    this.pairData = {
      chainId: "solana",
      dexId: "raydium",
      url: `https://dexscreener.com/solana/${tokenAddress}`,
      pairAddress: tokenAddress,
      baseToken: {
        address: tokenAddress,
        name: "Unknown Token",
        symbol: "UNKNOWN",
      },
      quoteToken: {
        address: "So11111111111111111111111111111111111111112",
        name: "Wrapped SOL",
        symbol: "SOL",
      },
      priceNative: "0.00001",
      priceUsd: "0.0002",
      txns: {
        m5: { buys: 1, sells: 1 },
        h1: { buys: 5, sells: 3 },
        h6: { buys: 15, sells: 10 },
        h24: { buys: 50, sells: 30 },
      },
      volume: {
        h24: 10000,
        h6: 3000,
        h1: 500,
        m5: 100,
      },
      priceChange: {
        m5: 0.1,
        h1: 0.5,
        h6: 1.2,
        h24: 2.5,
      },
      liquidity: {
        usd: 50000,
        base: 1000000,
        quote: 50,
      },
      fdv: 1000000,
      marketCap: 500000,
      pairCreatedAt: Date.now() - 86400000, // 1 day ago
    }

    // Set initial price
    this.lastPrice = 0.00001

    // Initialize price history with current price
    this.priceHistory = [
      {
        timestamp: Date.now(),
        price: this.lastPrice,
      },
    ]

    // Generate market data
    this.marketData = {
      time: new Date().toLocaleTimeString(),
      high: "0.000011",
      low: "0.000009",
      open: "0.00001",
      close: "0.00001",
      lastUpdate: Date.now(),
      psar: "0.0000105",
      trend: "0.5",
      rsi: "55",
    }

    // Emit pair data
    this.emit("pair-data", this.pairData)

    // Emit market data
    this.emit("market-data", this.marketData)
  }

  private generateMockStrategies(): void {
    this.availableStrategies = [
      {
        id: "RAYDIUM_MICROBUY",
        name: "Microbuy",
        description: "Execute small buys at regular intervals",
        platform: "RAYDIUM",
        configOptions: [
          { name: "interval", type: "number", default: 60, description: "Interval between buys in seconds" },
          { name: "amount", type: "number", default: 0.1, description: "Amount to buy in SOL" },
        ],
      },
      {
        id: "RAYDIUM_BUMP",
        name: "Bump",
        description: "Execute larger buys to bump the price",
        platform: "RAYDIUM",
        configOptions: [
          { name: "interval", type: "number", default: 300, description: "Interval between bumps in seconds" },
          { name: "amount", type: "number", default: 0.5, description: "Amount to buy in SOL" },
        ],
      },
      {
        id: "PUMPFUN_GRADUAL_ACCUMULATION",
        name: "Gradual Accumulation",
        description: "Gradually accumulate tokens over time",
        platform: "PUMPFUN",
        configOptions: [
          { name: "duration", type: "number", default: 3600, description: "Duration of accumulation in seconds" },
          { name: "totalAmount", type: "number", default: 1.0, description: "Total amount to accumulate in SOL" },
        ],
      },
      {
        id: "PUMPSWAP_MEMECOIN_BOOST",
        name: "Memecoin Boost",
        description: "Boost memecoin price with strategic buys",
        platform: "PUMPSWAP",
        configOptions: [
          { name: "boostInterval", type: "number", default: 1800, description: "Interval between boosts in seconds" },
          { name: "boostAmount", type: "number", default: 0.3, description: "Amount for each boost in SOL" },
        ],
      },
    ]

    this.emit("strategies-update", this.availableStrategies)
  }
}
