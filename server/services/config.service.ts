import { Config, type ConfigAttributes } from "../models/config.model"

export class ConfigService {
  /**
   * Get current configuration
   */
  async getConfig(): Promise<Config | null> {
    // Get the most recent config
    const config = await Config.findOne({
      order: [["createdAt", "DESC"]],
    })

    return config
  }

  /**
   * Save configuration
   * @param configData Configuration data
   */
  async saveConfig(configData: ConfigAttributes): Promise<Config> {
    // Create a new config entry
    const config = await Config.create(configData)
    return config
  }
}

export default new ConfigService()
