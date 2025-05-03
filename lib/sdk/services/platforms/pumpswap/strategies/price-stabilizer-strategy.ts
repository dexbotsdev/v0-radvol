import { BaseStrategyService } from "../../../base-services"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import type { TradeParams, TradeSchedule } from "../../../interfaces"

export class PriceStabilizerStrategy extends BaseStrategyService {
  readonly platformId = "PUMPSWAP"
  private lastTradeType: "buy" | "sell" = "buy"
  private consecutiveCount = 0
  private maxConsecutive = 3

  getTradeSchedule(config: BotConfig): TradeSchedule {
    return {
      interval: config.intervalMinutes * 60 * 1000,
      tradesPerInterval: config.tradesPerInterval,
    }
  }

  calculateTradeParams(config: BotConfig): TradeParams {
    // Price Stabilizer alternates between buys and sells
    // but limits consecutive trades of the same type

    let tradeType: "buy" | "sell"

    if (this.consecutiveCount >= this.maxConsecutive) {
      // Force a switch after max consecutive trades of same type
      tradeType = this.lastTradeType === "buy" ? "sell" : "buy"
      this.consecutiveCount = 1
    } else {
      // Slightly favor continuing the same trade type
      tradeType = Math.random() < 0.6 ? this.lastTradeType : this.lastTradeType === "buy" ? "sell" : "buy"

      if (tradeType === this.lastTradeType) {
        this.consecutiveCount++
      } else {
        this.consecutiveCount = 1
      }
    }

    this.lastTradeType = tradeType

    // Consistent amounts for price stability
    const amount = config.minTradeAmount + Math.random() * (config.maxTradeAmount - config.minTradeAmount) * 0.7

    return { tradeType, amount }
  }

  getDefaultConfig(): Partial<BotConfig> {
    return {
      minTradeAmount: 0.05,
      maxTradeAmount: 0.15,
      tradesPerInterval: 15,
      intervalMinutes: 20,
      numberOfBuys: 8,
      numberOfSells: 7,
      strategyMode: "PRICE_STABILIZER",
    }
  }
}
