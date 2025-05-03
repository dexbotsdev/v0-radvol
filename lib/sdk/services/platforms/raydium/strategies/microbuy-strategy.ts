import { BaseStrategyService } from "../../../base-services"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import type { TradeParams, TradeSchedule } from "../../../interfaces"

export class MicroBuyStrategy extends BaseStrategyService {
  readonly platformId = "RAYDIUM"

  getTradeSchedule(config: BotConfig): TradeSchedule {
    return {
      interval: config.intervalMinutes * 60 * 1000,
      tradesPerInterval: config.tradesPerInterval,
    }
  }

  calculateTradeParams(config: BotConfig): TradeParams {
    // MicroBuy strategy always buys
    const tradeType = "buy"

    // Fixed small amount for microbuy
    const amount = config.minTradeAmount

    return { tradeType, amount }
  }

  getDefaultConfig(): Partial<BotConfig> {
    return {
      minTradeAmount: 0.0001,
      maxTradeAmount: 0.0001,
      tradesPerInterval: 20,
      intervalMinutes: 15,
      numberOfBuys: 1,
      numberOfSells: 0,
      strategyMode: "MICROBUY",
    }
  }
}
