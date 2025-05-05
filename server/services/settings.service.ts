import { RPCSettings, type RPCSettingsAttributes } from "../models/rpc-settings.model"

export class SettingsService {
  /**
   * Get current RPC settings
   */
  async getRPCSettings(): Promise<RPCSettings | null> {
    // Get the most recent settings
    const settings = await RPCSettings.findOne({
      order: [["createdAt", "DESC"]],
    })

    return settings
  }

  /**
   * Save RPC settings
   * @param settingsData RPC settings data
   */
  async saveRPCSettings(settingsData: RPCSettingsAttributes): Promise<RPCSettings> {
    // Create a new settings entry
    const settings = await RPCSettings.create(settingsData)
    return settings
  }
}

export default new SettingsService()
