import { StorageManager } from "./storage/storage-manager"
import { downloadAsFile, readFileAsText, isValidJson } from "./utils/file-utils"
import type { PlatformSettings, PlatformType, TokenData, UserPosition, TransactionRecord } from "./types"

export class BundlerSDKBase {
  protected platformSettings: PlatformSettings
  protected platformType: PlatformType
  protected storageManager: StorageManager

  constructor(platformSettings: PlatformSettings, platformType: PlatformType) {
    this.platformSettings = platformSettings
    this.platformType = platformType
    this.storageManager = new StorageManager(`${platformType}`)
  }

  // Token methods
  public async getToken(address: string): Promise<TokenData | null> {
    // Try to get from cache first
    const cachedToken = this.storageManager.getToken(address)

    // If we have a recent cached version, return it
    if (cachedToken && cachedToken.lastUpdated && Date.now() - cachedToken.lastUpdated < 5 * 60 * 1000) {
      // 5 minutes cache
      return cachedToken
    }

    // Otherwise fetch fresh data (implementation would be in derived classes)
    try {
      // This would be implemented in the derived class
      // const token = await this.fetchTokenData(address)
      // this.storageManager.saveToken(token)
      // return token
      return null
    } catch (error) {
      console.error(`Error fetching token ${address}:`, error)
      // Return cached version even if it's old, or null if we don't have it
      return cachedToken
    }
  }

  // Position methods
  public savePosition(position: UserPosition): UserPosition {
    return this.storageManager.savePosition(position)
  }

  public getPosition(id: string): UserPosition | null {
    return this.storageManager.getPosition(id)
  }

  public getAllPositions(): UserPosition[] {
    return this.storageManager.getAllPositions()
  }

  public updatePosition(id: string, updates: Partial<UserPosition>): UserPosition | null {
    return this.storageManager.updatePosition(id, updates)
  }

  public deletePosition(id: string): void {
    this.storageManager.deletePosition(id)
  }

  // Transaction methods
  public saveTransaction(transaction: TransactionRecord): TransactionRecord {
    return this.storageManager.saveTransaction(transaction)
  }

  public getTransaction(txHash: string): TransactionRecord | null {
    return this.storageManager.getTransaction(txHash)
  }

  public getAllTransactions(): TransactionRecord[] {
    return this.storageManager.getAllTransactions()
  }

  // Backup and restore methods

  /**
   * Creates and downloads a backup of all user data
   * @param filename The name of the backup file
   * @param includeSettings Whether to include settings in the backup
   */
  public downloadBackup(
    filename = `bundler-${this.platformType}-backup-${new Date().toISOString().split("T")[0]}.json`,
    includeSettings = true,
  ): void {
    const backupData = this.storageManager.createBackup(includeSettings)
    downloadAsFile(backupData, filename)
  }

  /**
   * Restores data from a backup file
   * @param file The backup file
   * @param options Configuration options for the restore process
   * @returns A promise that resolves with the result of the restore operation
   */
  public async restoreFromFile(
    file: File,
    options: {
      clearExisting?: boolean
      restoreTokens?: boolean
      restorePositions?: boolean
      restoreTransactions?: boolean
      restoreSettings?: boolean
    } = {},
  ): Promise<{
    success: boolean
    message: string
    restored: {
      tokens: number
      positions: number
      transactions: number
      settings: number
    }
  }> {
    try {
      // Validate file type
      if (!file.name.endsWith(".json")) {
        return {
          success: false,
          message: "Invalid file type. Backup files must be JSON files.",
          restored: { tokens: 0, positions: 0, transactions: 0, settings: 0 },
        }
      }

      // Read the file
      const fileContent = await readFileAsText(file)

      // Validate JSON
      if (!isValidJson(fileContent)) {
        return {
          success: false,
          message: "Invalid JSON format in backup file.",
          restored: { tokens: 0, positions: 0, transactions: 0, settings: 0 },
        }
      }

      // Restore from the backup
      return this.storageManager.restoreFromBackup(fileContent, options)
    } catch (error) {
      console.error("Error restoring from file:", error)
      return {
        success: false,
        message: `Error restoring from file: ${error instanceof Error ? error.message : String(error)}`,
        restored: { tokens: 0, positions: 0, transactions: 0, settings: 0 },
      }
    }
  }

  /**
   * Restores data from a backup JSON string
   * @param backupJson The JSON string containing the backup data
   * @param options Configuration options for the restore process
   * @returns The result of the restore operation
   */
  public restoreFromJson(
    backupJson: string,
    options: {
      clearExisting?: boolean
      restoreTokens?: boolean
      restorePositions?: boolean
      restoreTransactions?: boolean
      restoreSettings?: boolean
    } = {},
  ): {
    success: boolean
    message: string
    restored: {
      tokens: number
      positions: number
      transactions: number
      settings: number
    }
  } {
    // Validate JSON
    if (!isValidJson(backupJson)) {
      return {
        success: false,
        message: "Invalid JSON format in backup data.",
        restored: { tokens: 0, positions: 0, transactions: 0, settings: 0 },
      }
    }

    // Restore from the backup
    return this.storageManager.restoreFromBackup(backupJson, options)
  }
}
