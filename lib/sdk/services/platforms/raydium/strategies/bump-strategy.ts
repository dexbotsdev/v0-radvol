import { BaseStrategyService } from "../../../base-services"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import type { TradeParams, TradeSchedule } from "../../../interfaces"

export class BumpStrategy extends BaseStrategyService {
  readonly platformId = "RAYDIUM"
  private tradeCounter = 0

  getTradeSchedule(config: BotConfig): TradeSchedule {
    return {
      interval: config.intervalMinutes * 60 * 1000,
      tradesPerInterval: config.tradesPerInterval,
    }
  }

  calculateTradeParams(config: BotConfig): TradeParams {
    // Bump strategy alternates between buy and sell
    this.tradeCounter++
    const tradeType = this.tradeCounter % 2 === 0 ? "sell" : "buy"

    // Random amount between min and max
    const amount = config.minTradeAmount + Math.random() * (config.maxTradeAmount - config.minTradeAmount)

    return { tradeType, amount }
  }

  getDefaultConfig(): Partial<BotConfig> {
    return {
      minTradeAmount: 0.01,
      maxTradeAmount: 1.0,
      tradesPerInterval: 5,
      intervalMinutes: 15,
      numberOfBuys: 1,
      numberOfSells: 1,
      strategyMode: "BUMP",
    }
  }
}
