import { getBundlerSDK } from "../index"

// Example of how to use the backup and restore functionality
async function backupAndRestoreExample() {
  // Initialize the SDK
  const sdk = getBundlerSDK("raydium", "https://api.example.com")

  // Create some sample data
  const token = {
    address: "0x1234567890abcdef",
    symbol: "TEST",
    name: "Test Token",
    price: 1.23,
    priceChange: 5.67,
    lastUpdated: Date.now(),
  }

  const position = {
    id: "pos-1",
    tokenAddress: "0x1234567890abcdef",
    amount: 100,
    entryPrice: 1.0,
    currentPrice: 1.23,
    timestamp: Date.now(),
  }

  const transaction = {
    txHash: "0xabcdef1234567890",
    tokenAddress: "0x1234567890abcdef",
    type: "buy" as const,
    amount: 100,
    price: 1.0,
    timestamp: Date.now(),
    status: "confirmed" as const,
  }

  // Save the data
  sdk.storageManager.saveToken(token)
  sdk.savePosition(position)
  sdk.saveTransaction(transaction)

  console.log("Sample data created")

  // Create a backup
  const backupJson = sdk.storageManager.createBackup()
  console.log("Backup created:", backupJson.substring(0, 100) + "...")

  // Clear all data
  sdk.storageManager.clearAllData()
  console.log("All data cleared")

  // Verify data is gone
  const tokenAfterClear = sdk.storageManager.getToken(token.address)
  console.log("Token after clear:", tokenAfterClear) // Should be null

  // Restore from backup
  const restoreResult = sdk.restoreFromJson(backupJson)
  console.log("Restore result:", restoreResult)

  // Verify data is restored
  const tokenAfterRestore = sdk.storageManager.getToken(token.address)
  console.log("Token after restore:", tokenAfterRestore)

  const positionAfterRestore = sdk.getPosition(position.id)
  console.log("Position after restore:", positionAfterRestore)

  const transactionAfterRestore = sdk.getTransaction(transaction.txHash)
  console.log("Transaction after restore:", transactionAfterRestore)
}

// Run the example
backupAndRestoreExample().catch(console.error)
