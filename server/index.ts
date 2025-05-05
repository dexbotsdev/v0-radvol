import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { sequelize } from "./config/database"
import walletRoutes from "./routes/wallet.routes"
import configRoutes from "./routes/config.routes"
import settingsRoutes from "./routes/settings.routes"
// import { generateKeyPair } from "@solana/web3.js"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Routes
app.use("/api/wallets", walletRoutes)
app.use("/api/config", configRoutes)
app.use("/api/settings", settingsRoutes)

// In-memory storage (replace with database in production)
// const wallets = []
// let config = {
//   mainWalletKey: "",
//   fundingWalletKey: "",
// }
// let rpcSettings = {
//   rpcUrl: "https://api.mainnet-beta.solana.com",
//   privateKey: "",
// }

// Save configuration
// app.post("/api/config", (req, res) => {
//   try {
//     const { mainWalletKey, fundingWalletKey } = req.body
//     config = { mainWalletKey, fundingWalletKey }
//     console.log("Configuration saved:", {
//       mainWalletKey: mainWalletKey ? "***" : undefined,
//       fundingWalletKey: fundingWalletKey ? "***" : undefined,
//     })
//     res.json({ success: true, message: "Configuration saved successfully" })
//   } catch (error) {
//     console.error("Error saving configuration:", error)
//     res.status(500).json({ success: false, message: "Failed to save configuration" })
//   }
// })

// Save RPC settings
// app.post("/api/settings/rpc", (req, res) => {
//   try {
//     const { rpcUrl, privateKey } = req.body
//     rpcSettings = { rpcUrl, privateKey }
//     console.log("RPC settings saved:", {
//       rpcUrl,
//       privateKey: privateKey ? "***" : undefined,
//     })
//     res.json({ success: true, message: "RPC settings saved successfully" })
//   } catch (error) {
//     console.error("Error saving RPC settings:", error)
//     res.status(500).json({ success: false, message: "Failed to save RPC settings" })
//   }
// })

// Generate wallets
// app.post("/api/wallets/generate", (req, res) => {
//   try {
//     const { count } = req.body
//     const newWallets = []

//     for (let i = 0; i < count; i++) {
//       const keypair = generateKeyPair()
//       const wallet = {
//         id: `wallet-${Date.now()}-${i}`,
//         publicKey: keypair.publicKey.toString(),
//         privateKey: keypair.secretKey.toString(),
//         balance: "0",
//         selected: false,
//       }
//       newWallets.push(wallet)
//       wallets.push(wallet)
//     }

//     console.log(`Generated ${count} wallets`)
//     res.json({ success: true, wallets: newWallets })
//   } catch (error) {
//     console.error("Error generating wallets:", error)
//     res.status(500).json({ success: false, message: "Failed to generate wallets" })
//   }
// })

// Fund wallets
// app.post("/api/wallets/fund", (req, res) => {
//   try {
//     const { walletIds, amount, fundingWalletKey } = req.body

//     // In a real implementation, this would use the Solana web3.js library
//     // to create and send transactions to fund the wallets

//     // For now, we'll just update the balances in our in-memory storage
//     walletIds.forEach((id) => {
//       const wallet = wallets.find((w) => w.id === id)
//       if (wallet) {
//         const currentBalance = Number.parseFloat(wallet.balance)
//         wallet.balance = (currentBalance + amount).toString()
//       }
//     })

//     console.log(`Funded ${walletIds.length} wallets with ${amount} SOL`)
//     res.json({ success: true, message: `Funded ${walletIds.length} wallets with ${amount} SOL` })
//   } catch (error) {
//     console.error("Error funding wallets:", error)
//     res.status(500).json({ success: false, message: "Failed to fund wallets" })
//   }
// })

// Burn wallets
// app.post("/api/wallets/burn", (req, res) => {
//   try {
//     const { walletIds } = req.body

//     // Remove wallets from our in-memory storage
//     for (let i = wallets.length - 1; i >= 0; i--) {
//       if (walletIds.includes(wallets[i].id)) {
//         wallets.splice(i, 1)
//       }
//     }

//     console.log(`Burned ${walletIds.length} wallets`)
//     res.json({ success: true, message: `Burned ${walletIds.length} wallets` })
//   } catch (error) {
//     console.error("Error burning wallets:", error)
//     res.status(500).json({ success: false, message: "Failed to burn wallets" })
//   }
// })

// Get all wallets
// app.get("/api/wallets", (req, res) => {
//   try {
//     res.json({ success: true, wallets })
//   } catch (error) {
//     console.error("Error fetching wallets:", error)
//     res.status(500).json({ success: false, message: "Failed to fetch wallets" })
//   }
// })

// Database initialization and server start
const startServer = async () => {
  try {
    // Sync all models with database
    await sequelize.sync()
    console.log("Database synchronized successfully")

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
