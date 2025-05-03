export const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const seconds = date.getSeconds().toString().padStart(2, "0")
  return `${hours}:${minutes}:${seconds}`
}

// Update the generateRandomWallets function to create Solana-style addresses

// Replace the generateRandomWallets function with:

export function generateRandomWallets(count: number): Array<{
  id: string
  address: string
  balance: number
  selected: boolean
}> {
  const wallets: Array<{
    id: string
    address: string
    balance: number
    selected: boolean
  }> = []

  // Generate Solana-style addresses (base58 encoded, typically 32-44 characters)
  const generateSolanaAddress = () => {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    let result = ""
    // Generate a random string of 44 characters (typical Solana address length)
    for (let i = 0; i < 44; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  for (let i = 0; i < count; i++) {
    wallets.push({
      id: `wallet-${Date.now()}-${i}`,
      address: generateSolanaAddress(),
      balance: Number.parseFloat((Math.random() * 5).toFixed(2)),
      selected: false,
    })
  }

  return wallets
}

// Add a function to format date/time
export const formatDateTime = (timestamp: number): string => {
  if (!timestamp) return "N/A"
  const date = new Date(timestamp)
  return date.toLocaleString()
}

// Add a function to calculate time ago
export const timeAgo = (timestamp: number): string => {
  if (!timestamp) return "N/A"

  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + " years ago"

  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + " months ago"

  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + " days ago"

  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + " hours ago"

  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + " minutes ago"

  return Math.floor(seconds) + " seconds ago"
}

// Mock data for testing - this represents the actual API response format
const mockApiResponse = {
  schemaVersion: "1.0.0",
  pairs: [
    {
      chainId: "solana",
      dexId: "pumpswap",
      url: "https://dexscreener.com/solana/fcexzrgrh141834qnzmtpjmkm8hqwvnkddqupyuhg3w9",
      pairAddress: "FCEXzrGrh141834qnZMtpJMkm8HQWvNKDDqUPYuhG3w9",
      baseToken: {
        address: "5G3m7V8Cq1F5mWJBFxNLDX2djbeEyfarfwFC3koMpump",
        name: "GUIDEFICATION",
        symbol: "GUIDEIFY",
      },
      quoteToken: {
        address: "So11111111111111111111111111111111111111112",
        name: "Wrapped SOL",
        symbol: "SOL",
      },
      priceNative: "0.00000002315",
      priceUsd: "0.000002924",
      txns: {
        m5: { buys: 6, sells: 5 },
        h1: { buys: 2537, sells: 2291 },
        h6: { buys: 2537, sells: 2291 },
        h24: { buys: 2537, sells: 2291 },
      },
      volume: {
        h24: 455356.39,
        h6: 455356.39,
        h1: 455356.39,
        m5: 200.54,
      },
      priceChange: {
        m5: 1.39,
        h1: -96.34,
        h6: -96.34,
        h24: -96.34,
      },
      liquidity: {
        usd: 5305.3,
        base: 906806645,
        quote: 21.01241,
      },
      fdv: 2924,
      marketCap: 2924,
      pairCreatedAt: 1744759987000,
    },
    {
      chainId: "solana",
      dexId: "pumpfun",
      url: "https://dexscreener.com/solana/ct79gge53qzxvxjbhsawl5tsazvjp8qfxjwklffh6r96",
      pairAddress: "Ct79GgE53qzxvXjBhSawL5TSAzVjP8QFxjwkLFFH6R96",
      baseToken: {
        address: "5G3m7V8Cq1F5mWJBFxNLDX2djbeEyfarfwFC3koMpump",
        name: "GUIDEFICATION",
        symbol: "GUIDEIFY",
      },
      quoteToken: {
        address: "So11111111111111111111111111111111111111112",
        name: "Solana",
        symbol: "SOL",
      },
      priceNative: "0.0000004108",
      priceUsd: "0.00005219",
      txns: {
        m5: { buys: 0, sells: 0 },
        h1: { buys: 35, sells: 18 },
        h6: { buys: 35, sells: 18 },
        h24: { buys: 35, sells: 18 },
      },
      volume: {
        h24: 14790.37,
        h6: 14790.37,
        h1: 14790.37,
        m5: 0,
      },
      priceChange: {
        h1: 1158,
        h6: 1158,
        h24: 1158,
      },
      fdv: 52198.22,
      marketCap: 52198.22,
      pairCreatedAt: 1744759049000,
    },
  ],
}

// Update the fetchTokenData function to filter for pumpswap DEX
export const fetchTokenData = async (tokenAddress?: string): Promise<any | null> => {
  try {
    console.log("Fetching token data for address:", tokenAddress)

    // If no token address is provided, use the mock data
    if (!tokenAddress) {
      console.log("No token address provided, using mock data")
      return {
        mainPair: mockApiResponse.pairs[0],
        topQuotes: [mockApiResponse.pairs[0]],
      }
    }

    // Construct the API URL with the provided token address
    const apiUrl = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
    console.log("Fetching from API URL:", apiUrl)

    // Fetch data from the API
    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("API response:", data)

    // Check if we have pairs in the response
    if (!data.pairs || data.pairs.length === 0) {
      console.log("No pairs found in API response")
      return null
    }

    // Filter pairs to only include pumpswap
    const pumpswapPairs = data.pairs.filter((pair) => pair.dexId === "pumpswap")

    // If no pumpswap pairs found, log a message
    if (pumpswapPairs.length === 0) {
      console.log("No pumpswap pairs found, using all pairs")
      // Sort all pairs by liquidity as fallback
      const sortedPairs = [...data.pairs].sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))
      const mainPair = sortedPairs[0]

      // Get top 3 quotes (pairs) for the token from all DEXes
      const topQuotes = sortedPairs.slice(0, 3).map((pair) => ({
        dexId: pair.dexId,
        quoteToken: pair.quoteToken.symbol,
        priceUsd: pair.priceUsd,
        liquidity: pair.liquidity?.usd || 0,
        volume24h: pair.volume?.h24 || 0,
      }))

      // Add a note that we're using non-pumpswap data
      mainPair.isPumpswap = false

      return {
        mainPair,
        topQuotes,
      }
    }

    // Sort pumpswap pairs by liquidity
    const sortedPumpswapPairs = [...pumpswapPairs].sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))
    const mainPair = sortedPumpswapPairs[0]
    mainPair.isPumpswap = true

    // For comparison, still get top quotes from all DEXes
    const sortedAllPairs = [...data.pairs].sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))
    const topQuotes = sortedAllPairs.slice(0, 3).map((pair) => ({
      dexId: pair.dexId,
      quoteToken: pair.quoteToken.symbol,
      priceUsd: pair.priceUsd,
      liquidity: pair.liquidity?.usd || 0,
      volume24h: pair.volume?.h24 || 0,
      isPumpswap: pair.dexId === "pumpswap",
    }))

    return {
      mainPair,
      topQuotes,
    }
  } catch (error) {
    console.error("Error fetching token data:", error)
    // Fallback to mock data in case of error
    console.log("Falling back to mock data due to error")
    const mockPair = mockApiResponse.pairs[0]
    mockPair.isPumpswap = true
    return {
      mainPair: mockPair,
      topQuotes: [
        {
          dexId: mockPair.dexId,
          quoteToken: mockPair.quoteToken.symbol,
          priceUsd: mockPair.priceUsd,
          liquidity: mockPair.liquidity?.usd || 0,
          volume24h: mockPair.volume?.h24 || 0,
          isPumpswap: true,
        },
      ],
    }
  }
}

// Add a function to format price with appropriate precision
export const formatPrice = (price: string | number): string => {
  if (price === undefined || price === null) return "0.00"

  const numPrice = typeof price === "string" ? Number.parseFloat(price) : price

  if (numPrice < 0.00001) {
    return numPrice.toFixed(9)
  } else if (numPrice < 0.001) {
    return numPrice.toFixed(8)
  } else if (numPrice < 0.01) {
    return numPrice.toFixed(7)
  } else if (numPrice < 0.1) {
    return numPrice.toFixed(6)
  } else if (numPrice < 1) {
    return numPrice.toFixed(5)
  } else if (numPrice < 1000) {
    return numPrice.toFixed(4)
  } else {
    return numPrice.toFixed(2)
  }
}

// Add a function to format large numbers with K, M, B suffixes
export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + "B"
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K"
  } else {
    return num.toFixed(2)
  }
}
