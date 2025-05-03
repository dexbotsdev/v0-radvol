export interface StrategyInfo {
  id: string
  name: string
  description: string
  platformId: string
  strategyType?: string
  defaultConfig?: any
}

export interface ActivityLog {
  timestamp: number
  message: string
  level: "info" | "warn" | "error"
}

export interface PlatformService {
  initialize(tokenAddress: string): Promise<void>
  connectToExchange(): Promise<void>
  fetchPairData(tokenAddress: string): Promise<any>
  fetchMarketData(): Promise<any>
  executeTrade(type: string, amount: number): Promise<any>
  getStats(): any
  getPriceHistory(): any
  getAvailableStrategies(): StrategyInfo[]
  createStrategy(strategyType: string): StrategyService
}

export interface TradeParams {
  tradeType: "buy" | "sell"
  amount: number
}

export interface TradeSchedule {
  interval: number
  tradesPerInterval: number
}

export interface StrategyService {
  getTradeSchedule(config: any): TradeSchedule
  calculateTradeParams(config: any): TradeParams
  getDefaultConfig(): any
}
