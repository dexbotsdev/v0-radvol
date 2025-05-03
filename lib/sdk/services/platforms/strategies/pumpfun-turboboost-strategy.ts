import { BaseStrategyService } from "../../base-services"

export class PumpFunTurboBoostStrategy extends BaseStrategyService {
  name = "Turbo Boost"
  description = "Rapid trading to boost volume on PumpFun"
  color = "#ff9800"

  calculateTradeParams(config: any): {
    tradeType: "buy" | "sell"
    amount: number
    timing: number
  } {
    // TurboBoost strategy uses larger amounts and alternates buy/sell
    const tradeType = Math.random() < 0.5 ? "buy" : "sell"

    // Use higher amounts on average
    const amount = config.minTradeAmount * 2 + Math.random() * (config.maxTradeAmount - config.minTradeAmount * 2)

    return {
      tradeType,
      amount,
      // Faster timing for turbo boost
      timing: (config.intervalMinutes * 60 * 1000) / (config.tradesPerInterval * 2),
    }
  }

  getTradeSchedule(config: any): {
    interval: number
    tradesPerInterval: number
  } {
    return {
      interval: config.intervalMinutes * 60 * 1000,
      // Double the trades for turbo boost
      tradesPerInterval: config.tradesPerInterval * 2,
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
      minTradeAmount: 0.02,
      maxTradeAmount: 1.2,
      tradesPerInterval: 6,
      intervalMinutes: 10,
      numberOfBuys: 1,
      numberOfSells: 1,
    }
  }
}
