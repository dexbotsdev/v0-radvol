import EventEmitter from "events"
import type { ActivityLog, MarketData, PairData, Trade } from "@/app/(dashboard)/trading/types"
import type { PlatformService, StrategyInfo, StrategyService } from "./interfaces"
import type { PriceDataPoint, VolumeBotStats } from "../volume-bot-sdk"

export interface BotConfig {
  intervalMinutes: number
  tradesPerInterval: number
}

export abstract class BasePlatformService extends EventEmitter implements PlatformService {
  protected rpcUrl: string
  protected tokenAddress = ""
  protected priceHistory: PriceDataPoint[] = []
  protected stats: VolumeBotStats = {
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

  constructor(rpcUrl: string) {
    super()
    this.rpcUrl = rpcUrl
  }

  abstract initialize(tokenAddress: string): Promise<void>
  abstract connectToExchange(): Promise<void>
  abstract fetchPairData(tokenAddress: string): Promise<PairData | null>
  abstract fetchMarketData(): Promise<MarketData | null>
  abstract executeTrade(type: "buy" | "sell", amount: number): Promise<Trade>
  abstract getAvailableStrategies(): StrategyInfo[]
  abstract createStrategy(strategyId: string): StrategyService

  getStats(): VolumeBotStats {
    // Update uptime
    if (this.stats.startTime > 0) {
      this.stats.uptime = Date.now() - this.stats.startTime
    }
    return { ...this.stats }
  }

  getPriceHistory(): PriceDataPoint[] {
    return [...this.priceHistory]
  }

  protected emitLog(log: ActivityLog): void {
    this.emit("log", log)
  }

  protected emitPriceUpdate(pricePoint: PriceDataPoint): void {
    this.emit("price-update", pricePoint)
  }
}

// Base strategy implementations
export abstract class BaseStrategyService implements StrategyService {
  abstract getTradeSchedule(config: any): { interval: number; tradesPerInterval: number }
  abstract calculateTradeParams(config: any): { tradeType: "buy" | "sell"; amount: number; timing: number }
  abstract getDefaultConfig(): any
}
