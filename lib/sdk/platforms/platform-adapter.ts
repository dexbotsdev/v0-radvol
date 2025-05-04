import type { Wallet } from "../types"
import type { TransactionResult } from "../trading-bot-sdk"

export interface PlatformAdapterConfig {
  tokenAddress: string
  poolAddress: string
  programId: string
  devPrivateKey: string
}

export abstract class PlatformAdapter {
  protected config: PlatformAdapterConfig | null = null

  /**
   * Initialize the platform adapter with configuration
   */
  public async initialize(config: PlatformAdapterConfig): Promise<void> {
    this.config = config
  }

  /**
   * Buy tokens
   */
  public abstract buyToken(
    tokenAddress: string,
    wallet: Wallet,
    amount: number,
    slippage?: number,
  ): Promise<TransactionResult>

  /**
   * Sell tokens
   */
  public abstract sellToken(
    tokenAddress: string,
    wallet: Wallet,
    amount: number,
    slippage?: number,
  ): Promise<TransactionResult>

  /**
   * Get token price
   */
  public abstract getTokenPrice(tokenAddress: string): Promise<number>

  /**
   * Get token balance
   */
  public abstract getTokenBalance(tokenAddress: string, walletAddress: string): Promise<number>
}
