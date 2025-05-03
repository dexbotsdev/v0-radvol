import { BaseStrategyService } from "../../../base-services"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import type { TradeParams, TradeSchedule } from "../../../interfaces"

export class PumpAndHoldStrategy extends BaseStrategyService {
  readonly platformId = "PUMPFUN"
  private phase: "pump" | "hold" = "pump"
  private pumpTradesLeft = 10
  private holdTradesLeft = 20

  getTradeSchedule(config: BotConfig): TradeSchedule {
    return {
      interval: config.intervalMinutes * 60 * 1000,
      tradesPerInterval: config.tradesPerInterval,
    }
  }

  calculateTradeParams(config: BotConfig): TradeParams {
    // Manage phases
    if (this.phase === "pump") {
      this.pumpTradesLeft--
      if (this.pumpTradesLeft <= 0) {
        this.phase = "hold"
        this.holdTradesLeft = 20
      }
    } else {
      this.holdTradesLeft--
      if (this.holdTradesLeft <= 0) {
        this.phase = "pump"
        this.pumpTradesLeft = 10
      }
    }

    if (this.phase === "pump") {
      // Pump phase: aggressive buying
      return {
        tradeType: "buy",
        amount: config.minTradeAmount * 2 + Math.random() * (config.maxTradeAmount * 2 - config.minTradeAmount * 2),
      }
    } else {
      // Hold phase: small buys and sells to maintain price
      const tradeType = Math.random() > 0.7 ? "sell" : "buy"
      return {
        tradeType,
        amount:
          config.minTradeAmount * 0.5 + Math.random() * (config.maxTradeAmount * 0.5 - config.minTradeAmount * 0.5),
      }
    }
  }

  getDefaultConfig(): Partial<BotConfig> {
    return {
      minTradeAmount: 0.1,
      maxTradeAmount: 0.5,
      tradesPerInterval: 8,
      intervalMinutes: 20,
      numberOfBuys: 6,
      numberOfSells: 2,
      strategyMode: "PUMP_AND_HOLD",
    }
  }
}
