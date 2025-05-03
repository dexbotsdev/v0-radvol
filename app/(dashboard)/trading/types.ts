export type Wallet = {
  id: string
  address: string
  balance: number
  selected: boolean
}

export type ActivityLog = {
  id: string
  timestamp: Date
  type: "info" | "warning" | "error" | "success"
  message: string
}

export type Trade = {
  id: string
  timestamp: Date
  price: number
  amount: number
  type: "buy" | "sell"
}

export type MarketData = {
  time: string
  high: string
  low: string
  open: string
  close: string
  lastUpdate: number
  psar: string
  trend: string
  rsi: string
}

// Add the Platform type
export type Platform = {
  id: string
  name: string
  description: string
  color: string
}

// Update the BotConfig type to include the platform
export type BotConfig = {
  tokenAddress: string
  minTradeAmount: number
  maxTradeAmount: number
  tradesPerInterval: number
  intervalMinutes: number
  numberOfBuys: number
  numberOfSells: number
  strategyMode: string
  platform: string // Add this new field
}

// Add a new type for strategy modes
export type StrategyMode = {
  id: string
  name: string
  description: string
  color: string
  config: {
    minTradeAmount: { value: number; editable: boolean }
    maxTradeAmount: { value: number; editable: boolean }
    tradesPerInterval: { value: number; editable: boolean }
    intervalMinutes: { value: number; editable: boolean }
    numberOfBuys: { value: number; editable: boolean }
    numberOfSells: { value: number; editable: boolean }
  }
}

// Add these new types for the API response
export type DexScreenerResponse = {
  schemaVersion: string
  pairs: PairData[]
}

export type PairData = {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: TokenData
  quoteToken: TokenData
  priceNative: string
  priceUsd: string
  txns: {
    m5: { buys: number; sells: number }
    h1: { buys: number; sells: number }
    h6: { buys: number; sells: number }
    h24: { buys: number; sells: number }
  }
  volume: {
    h24: number
    h6: number
    h1: number
    m5: number
  }
  priceChange: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  liquidity: {
    usd: number
    base: number
    quote: number
  }
  fdv: number
  marketCap: number
  pairCreatedAt: number
  isPumpswap?: boolean
  // Add top quotes property for multiple DEXes
  topQuotes?: Array<{
    dexId: string
    quoteToken: string
    priceUsd: string | number
    liquidity: number
    volume24h: number
    isPumpswap?: boolean
  }>
}

export type TokenData = {
  address: string
  name: string
  symbol: string
}

// Add these new types to capture additional data points
export type EnhancedPairData = PairData & {
  lastTraded?: number // Timestamp of last trade
  ath?: string // All-time high price
  athDate?: number // Timestamp when ATH was reached
}
