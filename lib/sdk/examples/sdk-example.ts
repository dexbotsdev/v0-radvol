import { getBundlerSDK } from "../index"
import type { PlatformType, PlatformSettings } from "../types"

async function sdkExample() {
  const platform: PlatformType = "bnb" // or 'pump' or 'raydium'
  const platformSettings: PlatformSettings = {
    rpcUrl: "https://example.com/api", // Replace with your API URL
    developerWalletPrivateKey: "",
    developerWalletAddress: "",
    fundingWalletPrivateKey: "",
    fundingWalletAddress: "",
    licenseKeySignerPrivateKey: "",
    licenseKeySignerAddress: "",
    licenseKey: "YOUR_API_KEY", // Replace with your API key (optional)
    licenseExpiry: null,
  }

  const sdk = getBundlerSDK(platform, platformSettings)

  // Example: Create a token
  const createTokenResult = await sdk.createToken({
    name: "Example Token",
    symbol: "EXMPL",
    decimals: 9,
    logoUrl: "https://example.com/logo.png",
  })

  if (createTokenResult.success) {
    console.log("Token created:", createTokenResult.data)
  } else {
    console.error("Failed to create token:", createTokenResult.error)
  }

  // Example: Get platform settings
  const settingsResult = await sdk.getPlatformSettings()

  if (settingsResult.success) {
    console.log("Platform settings:", settingsResult.data)
  } else {
    console.error("Failed to get platform settings:", settingsResult.error)
  }

  // Example: Generate wallets
  const generateWalletsResult = await sdk.generateWallets(3)
  if (generateWalletsResult.success) {
    console.log("Generated wallets:", generateWalletsResult.data)
    const wallets = generateWalletsResult.data
    if (wallets && wallets.length > 0) {
      const walletIds = wallets.map((wallet) => wallet.id)

      // Example: Fund wallets
      const fundWalletsResult = await sdk.fundWallets(walletIds, 1)
      if (fundWalletsResult.success) {
        console.log("Funded wallets:", fundWalletsResult.data)

        // Example: Buy token
        const buyTokenResult = await sdk.buyToken(createTokenResult.data.address, walletIds, 0.1)
        if (buyTokenResult.success) {
          console.log("Bought token:", buyTokenResult.data)

          // Example: Sell token
          const sellTokenResult = await sdk.sellToken(createTokenResult.data.address, walletIds, 50)
          if (sellTokenResult.success) {
            console.log("Sold token:", sellTokenResult.data)
          } else {
            console.error("Failed to sell token:", sellTokenResult.error)
          }
        } else {
          console.error("Failed to buy token:", buyTokenResult.error)
        }
      } else {
        console.error("Failed to fund wallets:", fundWalletsResult.error)
      }
    }
  } else {
    console.error("Failed to generate wallets:", generateWalletsResult.error)
  }
}

sdkExample()
