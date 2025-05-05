import type { Request, Response } from "express"
import walletService from "../services/wallet.service"

export class WalletController {
  /**
   * Get all wallets
   */
  async getAllWallets(req: Request, res: Response): Promise<void> {
    try {
      const wallets = await walletService.getAllWallets()
      res.json({ success: true, wallets })
    } catch (error) {
      console.error("Error fetching wallets:", error)
      res.status(500).json({ success: false, message: "Failed to fetch wallets" })
    }
  }

  /**
   * Generate new wallets
   */
  async generateWallets(req: Request, res: Response): Promise<void> {
    try {
      const { count } = req.body

      if (!count || count <= 0) {
        res.status(400).json({ success: false, message: "Invalid wallet count" })
        return
      }

      const wallets = await walletService.generateWallets(count)
      res.json({ success: true, wallets })
    } catch (error) {
      console.error("Error generating wallets:", error)
      res.status(500).json({ success: false, message: "Failed to generate wallets" })
    }
  }

  /**
   * Fund wallets
   */
  async fundWallets(req: Request, res: Response): Promise<void> {
    try {
      const { walletIds, amount, fundingWalletKey } = req.body

      if (!walletIds || !Array.isArray(walletIds) || walletIds.length === 0) {
        res.status(400).json({ success: false, message: "Invalid wallet IDs" })
        return
      }

      if (!amount || amount <= 0) {
        res.status(400).json({ success: false, message: "Invalid amount" })
        return
      }

      if (!fundingWalletKey) {
        res.status(400).json({ success: false, message: "Funding wallet key is required" })
        return
      }

      await walletService.fundWallets(walletIds, amount, fundingWalletKey)
      res.json({ success: true, message: `Funded ${walletIds.length} wallets with ${amount} SOL` })
    } catch (error) {
      console.error("Error funding wallets:", error)
      res.status(500).json({ success: false, message: "Failed to fund wallets" })
    }
  }

  /**
   * Burn wallets
   */
  async burnWallets(req: Request, res: Response): Promise<void> {
    try {
      const { walletIds } = req.body

      if (!walletIds || !Array.isArray(walletIds) || walletIds.length === 0) {
        res.status(400).json({ success: false, message: "Invalid wallet IDs" })
        return
      }

      const count = await walletService.burnWallets(walletIds)
      res.json({ success: true, message: `Burned ${count} wallets` })
    } catch (error) {
      console.error("Error burning wallets:", error)
      res.status(500).json({ success: false, message: "Failed to burn wallets" })
    }
  }

  /**
   * Update wallet selection
   */
  async updateWalletSelection(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { selected } = req.body

      if (selected === undefined) {
        res.status(400).json({ success: false, message: "Selected status is required" })
        return
      }

      const wallet = await walletService.updateWalletSelection(id, selected)

      if (!wallet) {
        res.status(404).json({ success: false, message: "Wallet not found" })
        return
      }

      res.json({ success: true, wallet })
    } catch (error) {
      console.error("Error updating wallet selection:", error)
      res.status(500).json({ success: false, message: "Failed to update wallet selection" })
    }
  }
}

export default new WalletController()
