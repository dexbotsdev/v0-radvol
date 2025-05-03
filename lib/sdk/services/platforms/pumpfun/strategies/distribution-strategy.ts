import { BaseStrategyService } from "../../../base-services"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import type { TradeParams, TradeSchedule } from "../../../interfaces"

export class DistributionStrategy extends BaseStrategyService {
  readonly platformId = "PUMPFUN"
  private tradeCounter = 0

  getTradeSchedule(config: BotConfig): TradeSchedule {
    return {
      interval: config.intervalMinutes * 60 * 1000,
      tradesPerInterval: config.tradesPerInterval,
    }
  }

  calculateTradeParams(config: BotConfig): TradeParams {
    this.tradeCounter++

    // Distribution strategy: 1 buy followed by 3 sells
    const tradeType = this.tradeCounter % 4 === 0 ? "buy" : "sell"

    // Buy with larger amounts, sell with smaller amounts
    let amount
    if (tradeType === "buy") {
      amount = config.minTradeAmount * 3 + Math.random() * (config.maxTradeAmount * 3 - config.minTradeAmount * 3)
    } else {
      amount = config.minTradeAmount * 0.8 + Math.random() * (config.maxTradeAmount * 0.8 - config.minTradeAmount * 0.8)
    }

    return { tradeType, amount }
  }

  getDefaultConfig(): Partial<BotConfig> {
    return {
      minTradeAmount: 0.05,
      maxTradeAmount: 0.2,
      tradesPerInterval: 15,
      intervalMinutes: 45,
      numberOfBuys: 5,
      numberOfSells: 10,
      strategyMode: "DISTRIBUTION",
    }
  }
}
