import { BaseStrategyService } from "../../base-services"

export class PumpSwapPatternTradeStrategy extends BaseStrategyService {
  name = "Pattern Trade"
  description = "Multiple buys followed by sells optimized for PumpSwap"
  color = "#f44336"
  private tradeCounter = 0

  calculateTradeParams(config: any): {
    tradeType: "buy" | "sell"
    amount: number
    timing: number
  } {
    // PatternTrade strategy follows a pattern of multiple buys followed by sells
    this.tradeCounter = (this.tradeCounter + 1) % (config.numberOfBuys + config.numberOfSells)

    // If counter is less than numberOfBuys, do a buy, otherwise do a sell
    const tradeType = this.tradeCounter < config.numberOfBuys ? "buy" : "sell"

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
      minTradeAmount: 0.03,
      maxTradeAmount: 1.5,
      tradesPerInterval: 6,
      intervalMinutes: 10,
      numberOfBuys: 5,
      numberOfSells: 1,
    }
  }
}
