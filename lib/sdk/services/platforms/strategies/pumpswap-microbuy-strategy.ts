import { BaseStrategyService } from "../../base-services"

export class PumpSwapMicroBuyStrategy extends BaseStrategyService {
  name = "MicroBuy"
  description = "Small frequent buys to accumulate position on PumpSwap"
  color = "#4caf50"

  calculateTradeParams(config: any): {
    tradeType: "buy" | "sell"
    amount: number
    timing: number
  } {
    // MicroBuy strategy always buys
    return {
      tradeType: "buy",
      amount: config.minTradeAmount, // Always use the minimum amount
      timing: 60000 / config.tradesPerInterval, // Evenly distribute trades
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
      config.minTradeAmount > 0 && config.tradesPerInterval > 0 && config.intervalMinutes > 0 && config.numberOfBuys > 0
    )
  }

  getDefaultConfig(): any {
    return {
      minTradeAmount: 0.0003,
      maxTradeAmount: 0.001,
      tradesPerInterval: 30,
      intervalMinutes: 8,
      numberOfBuys: 1,
      numberOfSells: 0,
    }
  }
}
