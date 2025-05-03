import { BaseStrategyService } from "../../../base-services"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import type { TradeParams, TradeSchedule } from "../../../interfaces"

export class WhaleSimulationStrategy extends BaseStrategyService {
  readonly platformId = "PUMPFUN"
  private whaleMode = false
  private tradeCounter = 0

  getTradeSchedule(config: BotConfig): TradeSchedule {
    return {
      interval: config.intervalMinutes * 60 * 1000,
      tradesPerInterval: config.tradesPerInterval,
    }
  }

  calculateTradeParams(config: BotConfig): TradeParams {
    this.tradeCounter++

    // Every 10 trades, enter "whale mode" for 3 trades
    if (this.tradeCounter % 10 === 0) {
      this.whaleMode = true
    }

    // Exit whale mode after 3 trades
    if (this.whaleMode && this.tradeCounter % 10 >= 3) {
      this.whaleMode = false
    }

    // Whale mode always buys with large amounts
    if (this.whaleMode) {
      return {
        tradeType: "buy",
        amount: config.maxTradeAmount * (1.5 + Math.random()),
      }
    }

    // Normal mode buys with regular amounts
    return {
      tradeType: "buy",
      amount: config.minTradeAmount + Math.random() * (config.maxTradeAmount - config.minTradeAmount),
    }
  }

  getDefaultConfig(): Partial<BotConfig> {
    return {
      minTradeAmount: 0.5,
      maxTradeAmount: 2.0,
      tradesPerInterval: 3,
      intervalMinutes: 60,
      numberOfBuys: 3,
      numberOfSells: 0,
      strategyMode: "WHALE_SIMULATION",
    }
  }
}
