import { BaseStrategyService } from "../../../base-services"
import type { BotConfig } from "@/app/(dashboard)/trading/types"
import type { TradeParams, TradeSchedule } from "../../../interfaces"

export class VolumeAmplifierStrategy extends BaseStrategyService {
  readonly platformId = "PUMPSWAP"
  private tradeCounter = 0
  private volumePhase: "low" | "medium" | "high" = "low"
  private phaseCounter = 0

  getTradeSchedule(config: BotConfig): TradeSchedule {
    // Volume Amplifier uses faster intervals
    return {
      interval: (config.intervalMinutes * 60 * 1000) / 2, // Twice as fast
      tradesPerInterval: config.tradesPerInterval * 1.5, // 50% more trades
    }
  }

  calculateTradeParams(config: BotConfig): TradeParams {
    this.tradeCounter++
    this.phaseCounter++

    // Change volume phase every 20 trades
    if (this.phaseCounter >= 20) {
      this.phaseCounter = 0

      // Cycle through phases
      if (this.volumePhase === "low") this.volumePhase = "medium"
      else if (this.volumePhase === "medium") this.volumePhase = "high"
      else this.volumePhase = "low"
    }

    // Equal buys and sells
    const tradeType = this.tradeCounter % 2 === 0 ? "sell" : "buy"

    // Amount depends on volume phase
    let amount
    switch (this.volumePhase) {
      case "low":
        amount = config.minTradeAmount + Math.random() * (config.maxTradeAmount - config.minTradeAmount) * 0.3
        break
      case "medium":
        amount = config.minTradeAmount + Math.random() * (config.maxTradeAmount - config.minTradeAmount) * 0.7
        break
      case "high":
        amount = config.minTradeAmount + Math.random() * (config.maxTradeAmount - config.minTradeAmount) * 1.5
        break
    }

    return { tradeType, amount }
  }

  getDefaultConfig(): Partial<BotConfig> {
    return {
      minTradeAmount: 0.01,
      maxTradeAmount: 0.5,
      tradesPerInterval: 30,
      intervalMinutes: 15,
      numberOfBuys: 15,
      numberOfSells: 15,
      strategyMode: "VOLUME_AMPLIFIER",
    }
  }
}
