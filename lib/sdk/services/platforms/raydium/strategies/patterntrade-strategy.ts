import { BaseStrategyService } from "../../../base-services"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import type { TradeParams, TradeSchedule } from "../../../interfaces"

export class PatternTradeStrategy extends BaseStrategyService {
  readonly platformId = "RAYDIUM"
  private tradeCounter = 0
  private patternPhase = 0
  private readonly pattern = [
    { type: "buy", sizeMultiplier: 0.5 },
    { type: "buy", sizeMultiplier: 1.0 },
    { type: "buy", sizeMultiplier: 1.5 },
    { type: "sell", sizeMultiplier: 2.0 },
  ]

  getTradeSchedule(config: BotConfig): TradeSchedule {
    return {
      interval: config.intervalMinutes * 60 * 1000,
      tradesPerInterval: config.tradesPerInterval,
    }
  }

  calculateTradeParams(config: BotConfig): TradeParams {
    // PatternTrade follows a specific pattern of buys and sells
    this.tradeCounter++

    // Update pattern phase
    this.patternPhase = (this.patternPhase + 1) % this.pattern.length

    // Get current pattern step
    const currentStep = this.pattern[this.patternPhase]

    // Calculate amount based on pattern
    const baseAmount = config.minTradeAmount + Math.random() * (config.maxTradeAmount - config.minTradeAmount)
    const amount = baseAmount * currentStep.sizeMultiplier

    return {
      tradeType: currentStep.type as "buy" | "sell",
      amount,
    }
  }

  getDefaultConfig(): Partial<BotConfig> {
    return {
      minTradeAmount: 0.01,
      maxTradeAmount: 1.0,
      tradesPerInterval: 4,
      intervalMinutes: 15,
      numberOfBuys: 3,
      numberOfSells: 1,
      strategyMode: "PATTERNTRADE",
    }
  }
}
