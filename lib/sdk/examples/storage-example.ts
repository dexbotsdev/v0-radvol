import { BundlerSDKBase } from "../index"

// Example usage of the storage system
async function storageExample() {
  // Initialize the SDK
  const sdk = new BundlerSDKBase("solana")

  // Save a token
  const token = {
    address: "0x123456789abcdef",
    symbol: "SOL",
    name: "Solana",
    price: 149.87,
    priceChange: 5.23,
    volume24h: 1500000000,
    marketCap: 60000000000,
    logo: "https://example.com/sol-logo.png",
  }

  sdk.saveToken(token)
  console.log("Token saved:", token)

  // Get the token
  const retrievedToken = sdk.getToken("0x123456789abcdef")
  console.log("Retrieved token:", retrievedToken)

  // Update the token
  const updatedToken = sdk.updateToken("0x123456789abcdef", { price: 152.5, priceChange: 6.75 })
  console.log("Updated token:", updatedToken)

  // Save a position
  const position = {
    id: "pos1",
    userAddress: "0xuser123",
    tokenAddress: "0x123456789abcdef",
    amount: 10.5,
    entryPrice: 142.35,
    timestamp: Date.now(),
  }

  sdk.savePosition(position)
  console.log("Position saved:", position)

  // Get all positions
  const positions = sdk.getAllPositions()
  console.log("All positions:", positions)

  // Save a transaction
  const transaction = {
    txHash: "0xtx123456",
    tokenAddress: "0x123456789abcdef",
    type: "buy",
    amount: 5.25,
    price: 149.87,
    timestamp: Date.now(),
    status: "confirmed",
  }

  sdk.saveTransaction(transaction)
  console.log("Transaction saved:", transaction)

  // Save a setting
  sdk.saveSetting("darkMode", true)
  console.log("Setting saved")

  // Get a setting
  const darkMode = sdk.getSetting<boolean>("darkMode")
  console.log("Dark mode setting:", darkMode)
}

// Run the example
storageExample()
