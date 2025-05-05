import { Router } from "express"
import configController from "../controllers/config.controller"

const router = Router()

// Get configuration
router.get("/", configController.getConfig)

// Save configuration
router.post("/", configController.saveConfig)

export default router
