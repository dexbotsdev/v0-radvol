import { Router } from "express"
import settingsController from "../controllers/settings.controller"

const router = Router()

// Get RPC settings
router.get("/rpc", settingsController.getRPCSettings)

// Save RPC settings
router.post("/rpc", settingsController.saveRPCSettings)

export default router
