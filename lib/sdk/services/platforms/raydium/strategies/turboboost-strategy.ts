import { BaseStrategyService } from "../../../base-services"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import type { TradeParams, TradeSchedule } from "../../../interfaces"

export class TurboBoostStrategy extends BaseStrategyService {
  readonly platformId = "RAYDIUM"
  private tradeCounter = 0

  getTradeSchedule(config: BotConfig): TradeSchedule {
    // TurboBoost uses faster intervals
    return {
      interval: (config.intervalMinutes * 60 * 1000) / 2, // Twice as fast
      tradesPerInterval: config.tradesPerInterval * 2, // Twice as many trades
    }
  }

  calculateTradeParams(config: BotConfig): TradeParams {
    // TurboBoost uses a 3:1 buy:sell ratio
    this.tradeCounter++
    const tradeType = this.tradeCounter % 4 === 0 ? "sell" : "buy"

    // Higher amounts for TurboBoost
    const minAmount = config.minTradeAmount * 1.5
    const maxAmount = config.maxTradeAmount * 1.5
    const amount = minAmount + Math.random() * (maxAmount - minAmount)

    return { tradeType, amount }
  }

  getDefaultConfig(): Partial<BotConfig> {
    return {
      minTradeAmount: 0.01,
      maxTradeAmount: 1.0,
      tradesPerInterval: 4,
      intervalMinutes: 15,
      numberOfBuys: 3,
      numberOfSells: 1,
      strategyMode: "TURBOBOOST",
    }
  }
}
