import { Router } from "express"
import walletController from "../controllers/wallet.controller"

const router = Router()

// Get all wallets
router.get("/", walletController.getAllWallets)

// Generate wallets
router.post("/generate", walletController.generateWallets)

// Fund wallets
router.post("/fund", walletController.fundWallets)

// Burn wallets
router.post("/burn", walletController.burnWallets)

// Update wallet selection
router.patch("/:id/selection", walletController.updateWalletSelection)

export default router
