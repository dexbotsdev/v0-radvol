import { BaseStrategyService } from "../../../base-services"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import type { TradeParams, TradeSchedule } from "../../../interfaces"

export class LiquidityBuilderStrategy extends BaseStrategyService {
  readonly platformId = "PUMPSWAP"
  private tradeCounter = 0

  getTradeSchedule(config: BotConfig): TradeSchedule {
    return {
      interval: config.intervalMinutes * 60 * 1000,
      tradesPerInterval: config.tradesPerInterval,
    }
  }

  calculateTradeParams(config: BotConfig): TradeParams {
    this.tradeCounter++

    // Liquidity Builder uses equal buys and sells
    const tradeType = this.tradeCounter % 2 === 0 ? "sell" : "buy"

    // Consistent amounts for liquidity building
    const amount = config.minTradeAmount + Math.random() * (config.maxTradeAmount - config.minTradeAmount) * 0.8

    return { tradeType, amount }
  }

  getDefaultConfig(): Partial<BotConfig> {
    return {
      minTradeAmount: 0.1,
      maxTradeAmount: 0.3,
      tradesPerInterval: 10,
      intervalMinutes: 30,
      numberOfBuys: 5,
      numberOfSells: 5,
      strategyMode: "LIQUIDITY_BUILDER",
    }
  }
}
