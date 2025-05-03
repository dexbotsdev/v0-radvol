import { BaseStrategyService } from "../base-services"

export class BumpStrategy extends BaseStrategyService {
  name = "Bump"
  description = "Equal buys and sells to create market activity"
  color = "#2196f3"

  calculateTradeParams(config: any): {
    tradeType: "buy" | "sell"
    amount: number
    timing: number
  } {
    // Bump strategy alternates between buys and sells
    const tradeType = Math.random() < 0.5 ? "buy" : "sell"

    // Random amount between min and max
    const amount = config.minTradeAmount + Math.random() * (config.maxTradeAmount - config.minTradeAmount)

    return {
      tradeType,
      amount,
      timing: (config.intervalMinutes * 60 * 1000) / config.tradesPerInterval,
    }
  }

  getTradeSchedule(config: any): {
    interval: number
    tradesPerInterval: number
  } {
    return {
      interval: config.intervalMinutes * 60 * 1000,
      tradesPerInterval: config.tradesPerInterval,
    }
  }

  validateConfig(config: any): boolean {
    return (
      config.minTradeAmount > 0 &&
      config.maxTradeAmount >= config.minTradeAmount &&
      config.tradesPerInterval > 0 &&
      config.intervalMinutes > 0 &&
      config.numberOfBuys > 0 &&
      config.numberOfSells > 0
    )
  }

  getDefaultConfig(): any {
    return {
      minTradeAmount: 0.01,
      maxTradeAmount: 1.0,
      tradesPerInterval: 5,
      intervalMinutes: 15,
      numberOfBuys: 1,
      numberOfSells: 1,
    }
  }
}
