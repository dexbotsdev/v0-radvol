import type {
  PlatformType,
  SubPlatformType,
  TokenMetadata,
  Token,
  Wallet,
  TransactionResult,
  BundlerStrategy,
  BundlerConfig,
  BundlerStatus,
  ApiResponse,
  PlatformSettings,
} from "./types"

export interface BundlerSDK {
  // Platform info
  readonly platform: PlatformType
  readonly subPlatform?: SubPlatformType

  // Token operations
  createToken(metadata: TokenMetadata): Promise<ApiResponse<Token>>
  uploadTokenMetadata(tokenAddress: string, metadata: TokenMetadata): Promise<ApiResponse<boolean>>
  getToken(tokenAddress: string): Promise<ApiResponse<Token>>
  searchToken(query: string): Promise<ApiResponse<Token[]>>

  // Wallet operations
  generateWallets(count: number): Promise<ApiResponse<Wallet[]>>
  saveWallets(wallets: Wallet[]): Promise<ApiResponse<boolean>>
  getWallets(): Promise<ApiResponse<Wallet[]>>
  fundWallet(walletId: string, amount: number): Promise<ApiResponse<TransactionResult>>
  fundWallets(walletIds: string[], amount: number): Promise<ApiResponse<TransactionResult[]>>

  // Trading operations
  buyToken(
    tokenAddress: string,
    walletIds: string[],
    amount: number,
    slippage?: number,
  ): Promise<ApiResponse<TransactionResult[]>>
  sellToken(
    tokenAddress: string,
    walletIds: string[],
    percentage: number,
    slippage?: number,
  ): Promise<ApiResponse<TransactionResult[]>>

  // Bundler operations
  configureBundler(config: BundlerConfig): Promise<ApiResponse<boolean>>
  startBundler(strategy: BundlerStrategy): Promise<ApiResponse<boolean>>
  stopBundler(): Promise<ApiResponse<boolean>>
  getBundlerStatus(): Promise<ApiResponse<BundlerStatus>>

  // Platform Settings operations
  getPlatformSettings(): Promise<ApiResponse<PlatformSettings>>
  updatePlatformSettings(settings: PlatformSettings): Promise<ApiResponse<boolean>>
  validateLicenseKey(licenseKey: string): Promise<ApiResponse<boolean>>
  getLicenseExpiry(): Promise<ApiResponse<Date | null>>
  isLicenseValid(): Promise<ApiResponse<boolean>>
}
