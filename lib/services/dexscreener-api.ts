// DEX Screener API service

export interface DexScreenerPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    address: string
    name: string
    symbol: string
  }
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
}

export interface DexScreenerResponse {
  schemaVersion: string
  pairs: DexScreenerPair[]
}

/**
 * Fetch token pair data by token address
 * @param tokenAddress The token address to fetch data for
 * @returns The pair data or null if not found
 */
export async function fetchTokenPairByAddress(tokenAddress: string): Promise<DexScreenerPair | null> {
  try {
    // Normalize the token address
    const normalizedAddress = tokenAddress.toLowerCase().trim()

    // Fetch data from DEX Screener API
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${normalizedAddress}`)

    if (!response.ok) {
      throw new Error(`DEX Screener API error: ${response.status} ${response.statusText}`)
    }

    const data: DexScreenerResponse = await response.json()

    // Return the first pair if available
    if (data.pairs && data.pairs.length > 0) {
      return data.pairs[0]
    }

    return null
  } catch (error) {
    console.error("Error fetching token pair data:", error)
    throw error
  }
}

/**
 * Fetch pair data by pair address and chain ID
 * @param pairAddress The pair address
 * @param chainId The chain ID
 * @returns The pair data or null if not found
 */
export async function fetchPairByAddress(pairAddress: string, chainId: string): Promise<DexScreenerPair | null> {
  try {
    // Normalize the pair address
    const normalizedAddress = pairAddress.toLowerCase().trim()

    // Fetch data from DEX Screener API
    const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/${chainId}/${normalizedAddress}`)

    if (!response.ok) {
      throw new Error(`DEX Screener API error: ${response.status} ${response.statusText}`)
    }

    const data: DexScreenerResponse = await response.json()

    // Return the first pair if available
    if (data.pairs && data.pairs.length > 0) {
      return data.pairs[0]
    }

    return null
  } catch (error) {
    console.error("Error fetching pair data:", error)
    throw error
  }
}

/**
 * Fetch historical price data for a token
 * This is a mock function as DEX Screener doesn't provide historical OHLC data in their free API
 * In a real application, you would use a proper data source for this
 */
export async function fetchHistoricalPriceData(tokenAddress: string, timeframe = "1h"): Promise<any[]> {
  // This is a mock function that generates fake OHLC data
  // In a real application, you would fetch this from a proper data source

  const now = Date.now()
  const data = []

  // Generate 24 candles for the last 24 hours (if timeframe is 1h)
  const candleCount = timeframe === "1h" ? 24 : 100
  const timeframeMs = timeframe === "1h" ? 3600000 : 300000 // 1h or 5m in milliseconds

  // Start with a base price
  let lastClose = 0.0001 + Math.random() * 0.001

  for (let i = candleCount - 1; i >= 0; i--) {
    const timestamp = now - i * timeframeMs

    // Generate random price movement
    const changePercent = (Math.random() * 2 - 1) * 0.02 // -2% to +2%
    const close = lastClose * (1 + changePercent)

    // Generate random high/low within a reasonable range
    const volatility = lastClose * 0.01
    const high = Math.max(lastClose, close) + Math.random() * volatility
    const low = Math.min(lastClose, close) - Math.random() * volatility

    // Generate random volume
    const volume = Math.random() * 10000 + 1000

    data.push({
      timestamp,
      open: lastClose,
      high,
      low,
      close,
      volume,
    })

    lastClose = close
  }

  return data
}

/**
 * Convert DEX Screener pair data to a format usable by our application
 */
export function convertPairDataToAppFormat(pairData: DexScreenerPair) {
  return {
    address: pairData.pairAddress,
    name: pairData.baseToken.name,
    symbol: pairData.baseToken.symbol,
    decimals: 18, // Assuming 18 decimals as DEX Screener doesn't provide this
    price: Number(pairData.priceNative),
    priceChange: {
      h1: pairData.priceChange?.h1 || 0,
      h24: pairData.priceChange?.h24 || 0,
      d7: 0, // DEX Screener doesn't provide 7d change
    },
    liquidity: pairData.liquidity?.usd || 0,
    volume24h: pairData.volume?.h24 || 0,
    chainId: pairData.chainId,
    dexId: pairData.dexId,
    baseTokenAddress: pairData.baseToken.address,
    quoteTokenAddress: pairData.quoteToken.address,
    quoteTokenSymbol: pairData.quoteToken.symbol,
  }
}
