import { BaseStrategyService } from "../../../base-services"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import type { TradeParams, TradeSchedule } from "../../../interfaces"

export class MemeCoinBoostStrategy extends BaseStrategyService {
  readonly platformId = "PUMPSWAP"
  private tradeCounter = 0

  getTradeSchedule(config: BotConfig): TradeSchedule {
    // Memecoin Boost uses very fast intervals
    return {
      interval: (config.intervalMinutes * 60 * 1000) / 3, // Three times as fast
      tradesPerInterval: config.tradesPerInterval * 1.5, // 50% more trades
    }
  }

  calculateTradeParams(config: BotConfig): TradeParams {
    this.tradeCounter++

    // Memecoin Boost uses a 4:1 buy:sell ratio
    const tradeType = this.tradeCounter % 5 === 0 ? "sell" : "buy"

    // Random amount with occasional spikes
    let amount
    if (Math.random() < 0.1) {
      // 10% chance of a spike
      amount = config.maxTradeAmount * (1 + Math.random() * 2)
    } else {
      amount = config.minTradeAmount + Math.random() * (config.maxTradeAmount - config.minTradeAmount)
    }

    return { tradeType, amount }
  }

  getDefaultConfig(): Partial<BotConfig> {
    return {
      minTradeAmount: 0.02,
      maxTradeAmount: 0.1,
      tradesPerInterval: 25,
      intervalMinutes: 10,
      numberOfBuys: 20,
      numberOfSells: 5,
      strategyMode: "MEMECOIN_BOOST",
    }
  }
}
