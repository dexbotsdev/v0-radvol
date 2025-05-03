import { getBundlerSDK } from "../index"
import type { PlatformType } from "../types"

async function sdkExample() {
  const platform: PlatformType = "raydium" // or 'pump' or 'bnb'
  const apiUrl = "https://example.com/api" // Replace with your API URL
  const apiKey = "YOUR_API_KEY" // Replace with your API key (optional)

  const sdk = getBundlerSDK(platform, apiUrl, apiKey)

  // 1. Set Platform Settings
  const initialSettings = {
    rpcUrl: "https://example.com/rpc",
    developerWalletPrivateKey: "0x...",
    developerWalletAddress: "0x...",
    fundingWalletPrivateKey: "0x...",
    fundingWalletAddress: "0x...",
    licenseKeySignerPrivateKey: "0x...",
    licenseKeySignerAddress: "0x...",
    licenseKey: "initial_license_key",
    licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  }
  let settingsResult = await sdk.updatePlatformSettings(initialSettings)
  if (settingsResult.success) {
    console.log("1. Platform settings updated:", settingsResult.data)
  } else {
    console.error("1. Failed to update platform settings:", settingsResult.error)
    return // Stop if this fails
  }

  // 2. Validate License and Save
  const licenseKey = "VALID_LICENSE_KEY"
  const validateResult = await sdk.validateLicenseKey(licenseKey)
  if (validateResult.success) {
    console.log("2. License validated:", validateResult.data)
    // Save the validated license
    settingsResult = await sdk.updatePlatformSettings({ ...initialSettings, licenseKey })
    if (settingsResult.success) {
      console.log("2a. License saved:", settingsResult.data)
    } else {
      console.error("2a. Failed to save license:", settingsResult.error)
      return // Stop if this fails
    }
  } else {
    console.error("2. Failed to validate license:", validateResult.error)
    return // Stop if this fails
  }

  // 3. Search Token
  const searchQuery = "RAY"
  const searchResult = await sdk.searchToken(searchQuery)
  if (searchResult.success && searchResult.data && searchResult.data.length > 0) {
    console.log("3. Token search results:", searchResult.data)
  } else {
    console.error("3. Token search failed:", searchResult.error)
    return // Stop if this fails
  }

  // 4. Create Token
  const tokenMetadata = {
    name: "Raydium Token",
    symbol: "RAY",
    logoUrl: "https://example.com/ray.png",
  }
  const createTokenResult = await sdk.createToken(tokenMetadata)
  if (createTokenResult.success && createTokenResult.data) {
    console.log("4. Token created:", createTokenResult.data)
    const tokenAddress = createTokenResult.data.address
    // 5. Create Wallets and Save
    const numWallets = 5
    const generateWalletsResult = await sdk.generateWallets(numWallets)
    if (generateWalletsResult.success && generateWalletsResult.data) {
      console.log(`5. Generated ${numWallets} wallets:`, generateWalletsResult.data)
      const wallets = generateWalletsResult.data

      // Save the wallets
      const saveWalletsResult = await sdk.saveWallets(wallets)
      if (saveWalletsResult.success) {
        console.log("5a. Wallets saved:", saveWalletsResult.data)
      } else {
        console.error("5a. Failed to save wallets:", saveWalletsResult.error)
        return // Stop if this fails
      }

      // 6. Fund Wallets
      const fundAmount = 1 // SOL
      const walletIds = wallets.map((wallet) => wallet.id)
      const fundWalletsResult = await sdk.fundWallets(walletIds, fundAmount)
      if (fundWalletsResult.success) {
        console.log(`6. Funded ${numWallets} wallets with ${fundAmount} SOL:`, fundWalletsResult.data)

        // 7. Set Custom Wallet Amounts (Example)
        const customWalletAmounts: Record<string, number> = {}
        wallets.forEach((wallet, index) => {
          customWalletAmounts[wallet.id] = (index + 1) * 0.1 // Example amounts
        })
        console.log("7. Custom wallet amounts set:", customWalletAmounts)

        // 8. Create Bundler Config and Save
        const bundlerConfig = {
          rpcUrl: "https://example.com/rpc",
          maxTransactionsPerBundle: 5,
          priorityFee: 0.00001,
          bundleInterval: 30,
          autoBundle: true,
          gasLimit: 500000,
          bundlerMode: "BLOCK0",
          chainId: "42",
          platformName: "Raydium",
          subPlatformName: "LaunchLab",
          Token: createTokenResult.data,
          devWalletAmount: 10,
          customWalletAmounts: customWalletAmounts,
          sameBuyEnabled: true,
          randomBuyEnabled: false,
          minBuy: 0.01,
          maxBuy: 0.1,
          launchDelay: 60,
          walletsPerBundle: 3,
        }
        const configureBundlerResult = await sdk.configureBundler(bundlerConfig)
        if (configureBundlerResult.success) {
          console.log("8. Bundler configured:", configureBundlerResult.data)

          // 9. Launch Bundler
          const startBundlerResult = await sdk.startBundler("BLOCK0")
          if (startBundlerResult.success) {
            console.log("9. Bundler launched:", startBundlerResult.data)

            // 10. Test case for each BundlerMode
            const bundlerModes = ["BLOCK0", "DELAYED", "STAGGERED", "SNIPER_KILLER", "QUICK_PROFITS"]
            for (const mode of bundlerModes) {
              console.log(`Testing BundlerMode: ${mode}`)
              // Simulate setting the bundler mode
              const updatedConfig = { ...bundlerConfig, bundlerMode: mode }
              const configureBundlerResult = await sdk.configureBundler(updatedConfig)
              if (configureBundlerResult.success) {
                console.log(`Bundler configured to ${mode}`)
              } else {
                console.error(`Failed to configure bundler to ${mode}`)
              }
            }

            // 11. Buy Tokens with 5 wallets at once
            const buyAmount = 0.1
            const buyTokenResult = await sdk.buyToken(tokenAddress, walletIds, buyAmount)
            if (buyTokenResult.success) {
              console.log(`11. Bought token with 5 wallets:`, buyTokenResult.data)
            } else {
              console.error("11. Failed to buy token with 5 wallets:", buyTokenResult.error)
            }

            // 12. Buy Tokens with 1 wallet
            const singleWalletId = wallets[0].id
            const buyTokenSingleResult = await sdk.buyToken(tokenAddress, [singleWalletId], buyAmount)
            if (buyTokenSingleResult.success) {
              console.log(`12. Bought token with 1 wallet:`, buyTokenSingleResult.data)
            } else {
              console.error("12. Failed to buy token with 1 wallet:", buyTokenSingleResult.error)
            }

            // 13. Sell Tokens with 5 wallets at once (50% of token amounts)
            const sellPercentage = 50
            const sellTokenResult = await sdk.sellToken(tokenAddress, walletIds, sellPercentage)
            if (sellTokenResult.success) {
              console.log(`13. Sold token with 5 wallets:`, sellTokenResult.data)
            } else {
              console.error("13. Failed to sell token with 5 wallets:", sellTokenResult.error)
            }

            // 14. Sell Tokens of 1 wallet
            const sellTokenSingleResult = await sdk.sellToken(tokenAddress, [singleWalletId], sellPercentage)
            if (sellTokenSingleResult.success) {
              console.log(`14. Sold token with 1 wallet:`, sellTokenSingleResult.data)
            } else {
              console.error("14. Failed to sell token with 1 wallet:", sellTokenSingleResult.error)
            }

            // 15. Recover Funds from selected 5 wallets to Main wallet
            // In a real implementation, this would involve creating and submitting transactions
            console.log("15. Recovering funds from 5 wallets to main wallet (Simulated)")

            // 16. Recover Funds from 1 wallet to Main wallet
            console.log("16. Recovering funds from 1 wallet to main wallet (Simulated)")

            // 17. End Bundling
            const stopBundlerResult = await sdk.stopBundler()
            if (stopBundlerResult.success) {
              console.log("17. Bundler stopped:", stopBundlerResult.data)
            } else {
              console.error("17. Failed to stop bundler:", stopBundlerResult.error)
            }
          } else {
            console.error("9. Failed to launch bundler:", startBundlerResult.error)
          }
        } else {
          console.error("8. Failed to configure bundler:", configureBundlerResult.error)
        }
      } else {
        console.error("6. Failed to fund wallets:", fundWalletsResult.error)
      }
    } else {
      console.error("5. Failed to generate wallets:", generateWalletsResult.error)
    }
  } else {
    console.error("4. Failed to create token:", createTokenResult.error)
  }
}

sdkExample()
