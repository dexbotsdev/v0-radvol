import type { PlatformService, StrategyService, StrategyInfo } from "./interfaces"
import { EventEmitter } from "events"
import type { PriceDataPoint } from "../volume-bot-sdk"

// Mock implementation of PlatformService
class MockPlatformService extends EventEmitter implements PlatformService {
  private rpcUrl: string
  private strategies: StrategyInfo[] = []
  private priceHistory: PriceDataPoint[] = []
  private stats = {
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

  constructor(rpcUrl: string, platformName: string) {
    super()
    this.rpcUrl = rpcUrl

    // Initialize with mock strategies
    this.strategies = [
      {
        id: `${platformName}_MICROBUY`,
        name: "MicroBuy",
        description: "Small frequent buys to accumulate position",
        platformId: platformName,
      },
      {
        id: `${platformName}_BUMP`,
        name: "Bump",
        description: "Equal buys and sells to create market activity",
        platformId: platformName,
      },
      {
        id: `${platformName}_TURBOBOOST`,
        name: "Turbo Boost",
        description: "Rapid trading to boost volume",
        platformId: platformName,
      },
      {
        id: `${platformName}_PATTERNTRADE`,
        name: "Pattern Trade",
        description: "Multiple buys followed by sells",
        platformId: platformName,
      },
    ]
  }

  async initialize(tokenAddress: string): Promise<void> {
    // Mock initialization
    return Promise.resolve()
  }

  async connectToExchange(): Promise<void> {
    // Mock connection
    return Promise.resolve()
  }

  async fetchPairData(tokenAddress: string): Promise<any> {
    // Return mock pair data
    return Promise.resolve({})
  }

  async fetchMarketData(): Promise<any> {
    // Return mock market data
    return Promise.resolve({})
  }

  async executeTrade(type: string, amount: number): Promise<any> {
    // Return mock trade
    return Promise.resolve({
      id: Date.now().toString(),
      timestamp: Date.now(),
      type,
      amount,
      price: 0.01,
      value: amount * 0.01,
      fee: amount * 0.01 * 0.003,
      status: "completed",
      txHash: `0x${Math.random().toString(16).substring(2, 10)}`,
    })
  }

  getStats(): any {
    return this.stats
  }

  getPriceHistory(): PriceDataPoint[] {
    return this.priceHistory
  }

  getAvailableStrategies(): StrategyInfo[] {
    return this.strategies
  }

  createStrategy(strategyType: string): StrategyService {
    return new MockStrategyService(strategyType)
  }
}

// Mock implementation of StrategyService
class MockStrategyService implements StrategyService {
  private strategyType: string

  constructor(strategyType: string) {
    this.strategyType = strategyType
  }

  getTradeSchedule(config: any): { interval: number; tradesPerInterval: number } {
    return {
      interval: config.intervalMinutes * 60 * 1000,
      tradesPerInterval: config.tradesPerInterval,
    }
  }

  calculateTradeParams(config: any): { tradeType: "buy" | "sell"; amount: number } {
    const isBuy = Math.random() < 0.5
    return {
      tradeType: isBuy ? "buy" : "sell",
      amount: config.minTradeAmount + Math.random() * (config.maxTradeAmount - config.minTradeAmount),
    }
  }
}

export class ServiceFactory {
  /**
   * Creates a platform service based on the platform ID
   */
  static createPlatformService(platformId: string, rpcUrl: string): PlatformService {
    // Make sure platformId is uppercase and remove any whitespace
    const normalizedPlatformId = platformId.trim().toUpperCase()

    console.log(`Creating platform service for: ${normalizedPlatformId}`)

    // Return a mock platform service for now
    return new MockPlatformService(rpcUrl, normalizedPlatformId)
  }
}
