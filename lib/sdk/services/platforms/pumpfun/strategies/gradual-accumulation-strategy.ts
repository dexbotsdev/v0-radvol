import { BaseStrategyService } from "../../../base-services"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import type { TradeParams, TradeSchedule } from "../../../interfaces"

export class GradualAccumulationStrategy extends BaseStrategyService {
  readonly platformId = "PUMPFUN"

  getTradeSchedule(config: BotConfig): TradeSchedule {
    return {
      interval: config.intervalMinutes * 60 * 1000,
      tradesPerInterval: config.tradesPerInterval,
    }
  }

  calculateTradeParams(config: BotConfig): TradeParams {
    // Gradual Accumulation always buys
    const tradeType = "buy"

    // Small random amount for gradual accumulation
    const amount = config.minTradeAmount + Math.random() * (config.maxTradeAmount - config.minTradeAmount) * 0.5

    return { tradeType, amount }
  }

  getDefaultConfig(): Partial<BotConfig> {
    return {
      minTradeAmount: 0.005,
      maxTradeAmount: 0.02,
      tradesPerInterval: 10,
      intervalMinutes: 30,
      numberOfBuys: 10,
      numberOfSells: 0,
      strategyMode: "GRADUAL_ACCUMULATION",
    }
  }
}
