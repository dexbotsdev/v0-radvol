import type { Request, Response } from "express"
import configService from "../services/config.service"

export class ConfigController {
  /**
   * Get current configuration
   */
  async getConfig(req: Request, res: Response): Promise<void> {
    try {
      const config = await configService.getConfig()
      res.json({ success: true, config })
    } catch (error) {
      console.error("Error fetching configuration:", error)
      res.status(500).json({ success: false, message: "Failed to fetch configuration" })
    }
  }

  /**
   * Save configuration
   */
  async saveConfig(req: Request, res: Response): Promise<void> {
    try {
      const { mainWalletKey, fundingWalletKey } = req.body

      const config = await configService.saveConfig({
        mainWalletKey: mainWalletKey || "",
        fundingWalletKey: fundingWalletKey || "",
      })

      res.json({ success: true, message: "Configuration saved successfully", config })
    } catch (error) {
      console.error("Error saving configuration:", error)
      res.status(500).json({ success: false, message: "Failed to save configuration" })
    }
  }
}

export default new ConfigController()
