import { LocalStorageORM } from "./local-storage-orm"
import type { TokenData, UserPosition, TransactionRecord, BackupData, BackupMetadata, Wallet } from "../types"

export class StorageManager {
  private orm: LocalStorageORM
  private readonly version = "1.0.0" // For backup versioning
  private readonly platform: string

  constructor(platform: string) {
    this.platform = platform
    this.orm = new LocalStorageORM(`bundler_${platform}`)

    // Define tables
    this.orm.addTable({ name: "tokens", keyPath: "address" })
    this.orm.addTable({ name: "positions", keyPath: "id" })
    this.orm.addTable({ name: "transactions", keyPath: "txHash" })
    this.orm.addTable({ name: "settings", keyPath: "id" })
    this.orm.addTable({ name: "wallets", keyPath: "id" })
  }

  // Token methods
  public saveToken(token: TokenData): TokenData {
    return this.orm.insert<TokenData>("tokens", {
      ...token,
      lastUpdated: Date.now(),
    })
  }

  public getToken(address: string): TokenData | null {
    return this.orm.get<TokenData>("tokens", address)
  }

  public getAllTokens(): TokenData[] {
    return this.orm.getAll<TokenData>("tokens")
  }

  public updateToken(address: string, updates: Partial<TokenData>): TokenData | null {
    return this.orm.update<TokenData>("tokens", address, {
      ...updates,
      lastUpdated: Date.now(),
    })
  }

  public deleteToken(address: string): void {
    this.orm.delete("tokens", address)
  }

  // Position methods
  public savePosition(position: UserPosition): UserPosition {
    return this.orm.insert<UserPosition>("positions", position)
  }

  public getPosition(id: string): UserPosition | null {
    return this.orm.get<UserPosition>("positions", id)
  }

  public getAllPositions(): UserPosition[] {
    return this.orm.getAll<UserPosition>("positions")
  }

  public updatePosition(id: string, updates: Partial<UserPosition>): UserPosition | null {
    return this.orm.update<UserPosition>("positions", id, updates)
  }

  public deletePosition(id: string): void {
    this.orm.delete("positions", id)
  }

  // Transaction methods
  public saveTransaction(transaction: TransactionRecord): TransactionRecord {
    return this.orm.insert<TransactionRecord>("transactions", transaction)
  }

  public getTransaction(txHash: string): TransactionRecord | null {
    return this.orm.get<TransactionRecord>("transactions", txHash)
  }

  public getAllTransactions(): TransactionRecord[] {
    return this.orm.getAll<TransactionRecord>("transactions")
  }

  // Settings methods
  public saveSetting<T>(id: string, value: T): { id: string; value: T } {
    return this.orm.insert("settings", { id, value })
  }

  public getSetting<T>(id: string): T | null {
    const setting = this.orm.get<{ id: string; value: T }>("settings", id)
    return setting ? setting.value : null
  }

  // Wallet methods
  public saveWallet(wallet: Wallet): Wallet {
    return this.orm.insert<Wallet>("wallets", wallet)
  }

  public getWallet(id: string): Wallet | null {
    return this.orm.get<Wallet>("wallets", id)
  }

  public getAllWallets(): Wallet[] {
    return this.orm.getAll<Wallet>("wallets")
  }

  public updateWallet(id: string, updates: Partial<Wallet>): Wallet | null {
    return this.orm.update<Wallet>("wallets", id, updates)
  }

  public deleteWallet(id: string): void {
    this.orm.delete("wallets", id)
  }

  // Cache management
  public clearTokenCache(): void {
    this.orm.clear("tokens")
  }

  public clearAllData(): void {
    this.orm.clear("tokens")
    this.orm.clear("positions")
    this.orm.clear("transactions")
    this.orm.clear("settings")
    this.orm.clear("wallets")
  }

  // Backup and Restore functionality

  /**
   * Creates a backup of all data stored in the ORM
   * @param includeSettings Whether to include settings in the backup
   * @returns A JSON string containing all backed up data
   */
  public createBackup(includeSettings = true): string {
    const tokens = this.getAllTokens()
    const positions = this.getAllPositions()
    const transactions = this.getAllTransactions()
    const wallets = this.getAllWallets()

    // Only include settings if specified
    const settings = includeSettings ? this.orm.getAll("settings") : []

    const metadata: BackupMetadata = {
      version: this.version,
      timestamp: Date.now(),
      tables: {
        tokens: tokens.length,
        positions: positions.length,
        transactions: transactions.length,
        settings: settings.length,
        wallets: wallets.length,
      },
    }

    const backupData: BackupData = {
      metadata,
      tokens,
      positions,
      transactions,
      settings: includeSettings ? settings : [],
      wallets,
    }

    return JSON.stringify(backupData)
  }

  /**
   * Restores data from a backup
   * @param backupJson The JSON string containing the backup data
   * @param options Configuration options for the restore process
   * @returns A summary of the restore operation
   */
  public restoreFromBackup(
    backupJson: string,
    options: {
      clearExisting?: boolean
      restoreTokens?: boolean
      restorePositions?: boolean
      restoreTransactions?: boolean
      restoreSettings?: boolean
      restoreWallets?: boolean
    } = {},
  ): {
    success: boolean
    message: string
    restored: {
      tokens: number
      positions: number
      transactions: number
      settings: number
      wallets: number
    }
  } {
    const defaultOptions = {
      clearExisting: false,
      restoreTokens: true,
      restorePositions: true,
      restoreTransactions: true,
      restoreSettings: true,
      restoreWallets: true,
    }

    const mergedOptions = { ...defaultOptions, ...options }

    try {
      // Parse the backup data
      const backupData = JSON.parse(backupJson) as BackupData

      // Validate the backup data
      if (!this.validateBackup(backupData)) {
        return {
          success: false,
          message: "Invalid backup data format",
          restored: { tokens: 0, positions: 0, transactions: 0, settings: 0, wallets: 0 },
        }
      }

      // Clear existing data if specified
      if (mergedOptions.clearExisting) {
        if (mergedOptions.restoreTokens) this.orm.clear("tokens")
        if (mergedOptions.restorePositions) this.orm.clear("positions")
        if (mergedOptions.restoreTransactions) this.orm.clear("transactions")
        if (mergedOptions.restoreSettings) this.orm.clear("settings")
        if (mergedOptions.restoreWallets) this.orm.clear("wallets")
      }

      // Restore tokens
      let tokensRestored = 0
      if (mergedOptions.restoreTokens && backupData.tokens) {
        backupData.tokens.forEach((token) => {
          this.saveToken(token)
          tokensRestored++
        })
      }

      // Restore positions
      let positionsRestored = 0
      if (mergedOptions.restorePositions && backupData.positions) {
        backupData.positions.forEach((position) => {
          this.savePosition(position)
          positionsRestored++
        })
      }

      // Restore transactions
      let transactionsRestored = 0
      if (mergedOptions.restoreTransactions && backupData.transactions) {
        backupData.transactions.forEach((transaction) => {
          this.saveTransaction(transaction)
          transactionsRestored++
        })
      }

      // Restore settings
      let settingsRestored = 0
      if (mergedOptions.restoreSettings && backupData.settings) {
        backupData.settings.forEach((setting) => {
          this.saveSetting(setting.id, setting.value)
          settingsRestored++
        })
      }

      // Restore wallets
      let walletsRestored = 0
      if (mergedOptions.restoreWallets && backupData.wallets) {
        backupData.wallets.forEach((wallet) => {
          this.saveWallet(wallet)
          walletsRestored++
        })
      }

      return {
        success: true,
        message: "Backup restored successfully",
        restored: {
          tokens: tokensRestored,
          positions: positionsRestored,
          transactions: transactionsRestored,
          settings: settingsRestored,
          wallets: walletsRestored,
        },
      }
    } catch (error) {
      console.error("Error restoring backup:", error)
      return {
        success: false,
        message: `Error restoring backup: ${error instanceof Error ? error.message : String(error)}`,
        restored: { tokens: 0, positions: 0, transactions: 0, settings: 0, wallets: 0 },
      }
    }
  }

  /**
   * Validates the structure of a backup
   * @param backup The backup data to validate
   * @returns Whether the backup is valid
   */
  private validateBackup(backup: any): backup is BackupData {
    // Check if the backup has the required structure
    if (!backup || typeof backup !== "object") return false
    if (!backup.metadata || typeof backup.metadata !== "object") return false

    // Check if the metadata has the required fields
    const metadata = backup.metadata
    if (!metadata.version || typeof metadata.version !== "string") return false
    if (!metadata.timestamp || typeof metadata.timestamp !== "number") return false
    if (!metadata.tables || typeof metadata.tables !== "object") return false

    // Check if the backup has the required data arrays
    if (!Array.isArray(backup.tokens)) return false
    if (!Array.isArray(backup.positions)) return false
    if (!Array.isArray(backup.transactions)) return false
    if (!Array.isArray(backup.settings)) return false
    if (!Array.isArray(backup.wallets)) return false

    return true
  }
}
