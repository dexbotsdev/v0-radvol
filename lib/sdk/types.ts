// Platform types
export type PlatformType = "bnb" | "pump" | "raydium"

export type BnbSubPlatformType = "Four.meme" | "BNB"
export type PumpSubPlatformType = "Pump.Fun" | "PumpSwap"
export type RaydiumSubPlatformType = "AMM" | "CLMM" | "CPMM" | "JustLaunch" | "LaunchLab"

export type SubPlatformType = BnbSubPlatformType | PumpSubPlatformType | RaydiumSubPlatformType

// Token types
export interface TokenMetadata {
  name: string
  symbol: string
  description?: string
  website?: string
  twitter?: string
  telegram?: string
  discord?: string
  logoUrl: string
  metadataUri?: string // Added metadata URI
  imageUri?: string // Added image URI
}

export interface Token {
  address: string
  symbol: string
  name: string
  imageUrl?: string
  balance?: number
  price?: number
  priceChange?: number
  marketCap?: number
  volume24h?: number
  high24h?: number
  low24h?: number
  tokenType: "SPL" | "2020" // Added token type
}

export interface TokenData extends Token {
  lastUpdated?: number
}

export interface UserPosition {
  id: string
  tokenAddress: string
  amount: number
  entryPrice: number
  currentPrice?: number
  timestamp: number
  chainId: string // Added chain ID
  walletAddress: string // Added wallet address
}

export interface Wallet {
  id: string
  address: string
  privateKey?: string
  balance: number
  selected: boolean
  platform: PlatformType
}

export interface TransactionResult {
  success: boolean
  hash?: string
  error?: string
  timestamp: Date
}

export interface BundlerConfig {
  rpcUrl: string
  maxTransactionsPerBundle: number
  priorityFee: number
  bundleInterval: number
  autoBundle: boolean
  gasLimit: number
  bundlerMode: string
  chainId: string
  platformName: string
  subPlatformName: string
  Token: Token | null
  devWalletAmount: number
  customWalletAmounts: Record<string, number>
  sameBuyEnabled: boolean
  randomBuyEnabled: boolean
  minBuy: number
  maxBuy: number
  launchDelay: number
  walletsPerBundle: number
}

export interface BundlerStats {
  running: boolean
  strategy: string
  startTime?: Date
  totalBundles: number
  totalTransactions: number
  successRate: number
}

export type BundlerStrategy = "BLOCK0" | "DELAYED" | "STAGGERED" | "SNIPER_KILLER" | "QUICK_PROFITS"

export type BundlerStatus = "active" | "inactive" | "error"

export interface PlatformSettings {
  rpcUrl: string
  developerWalletPrivateKey: string
  developerWalletAddress: string
  fundingWalletPrivateKey: string
  fundingWalletAddress: string
  licenseKeySignerPrivateKey: string
  licenseKeySignerAddress: string
  licenseKey: string
  licenseExpiry?: Date | null
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface TransactionRecord {
  txHash: string
  tokenAddress: string
  type: "buy" | "sell" | "approve" | "other"
  amount: number
  price: number
  timestamp: number
  status: "pending" | "confirmed" | "failed"
  blockNumber?: number
  gasUsed?: number
  gasPrice?: number
}

// Backup related types
export interface BackupMetadata {
  version: string
  timestamp: number
  tables: {
    tokens: number
    positions: number
    transactions: number
    settings: number
    wallets: number
  }
}

export interface BackupData {
  metadata: BackupMetadata
  tokens: TokenData[]
  positions: UserPosition[]
  transactions: TransactionRecord[]
  settings: Array<{ id: string; value: any }>
  wallets: Wallet[]
}
