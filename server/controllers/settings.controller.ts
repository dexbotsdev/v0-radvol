import type { Request, Response } from "express"
import settingsService from "../services/settings.service"

export class SettingsController {
  /**
   * Get current RPC settings
   */
  async getRPCSettings(req: Request, res: Response): Promise<void> {
    try {
      const settings = await settingsService.getRPCSettings()
      res.json({ success: true, settings })
    } catch (error) {
      console.error("Error fetching RPC settings:", error)
      res.status(500).json({ success: false, message: "Failed to fetch RPC settings" })
    }
  }

  /**
   * Save RPC settings
   */
  async saveRPCSettings(req: Request, res: Response): Promise<void> {
    try {
      const { rpcUrl, privateKey } = req.body

      if (!rpcUrl) {
        res.status(400).json({ success: false, message: "RPC URL is required" })
        return
      }

      const settings = await settingsService.saveRPCSettings({
        rpcUrl,
        privateKey: privateKey || "",
      })

      res.json({ success: true, message: "RPC settings saved successfully", settings })
    } catch (error) {
      console.error("Error saving RPC settings:", error)
      res.status(500).json({ success: false, message: "Failed to save RPC settings" })
    }
  }
}

export default new SettingsController()
