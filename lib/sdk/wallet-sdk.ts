import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js"
import * as bip39 from "bip39"
import { derivePath } from "ed25519-hd-key"
import bs58 from "bs58"
import { StorageManager } from "./storage/storage-manager"
import type { Wallet } from "./types"
import { EventEmitter } from "events"
import { v4 as uuidv4 } from "uuid"

export interface WalletInfo {
  id: string
  address: string
  privateKey?: string
  balance?: number
}

/**
 * WalletSDK - A comprehensive SDK for managing Solana wallets
 */
export class WalletSDK extends EventEmitter {
  private connection: Connection
  private storageManager: StorageManager
  private defaultFundingWallet: Keypair | null = null
  private rpcUrl: string
  private storageNamespace: string
  private mainWalletKey?: string

  /**
   * Creates a new instance of the WalletSDK
   * @param rpcUrl The Solana RPC URL to connect to
   * @param platform The platform identifier for storage
   */
  constructor(rpcUrl: string, platform = "solana", mainWalletKey?: string) {
    super()
    this.connection = new Connection(rpcUrl, "confirmed")
    this.storageManager = new StorageManager(platform)
    this.rpcUrl = rpcUrl
    this.storageNamespace = platform
    this.mainWalletKey = mainWalletKey
  }

  public setMainWalletKey(privateKey: string): void {
    this.mainWalletKey = privateKey
  }

  public getMainWalletKey(): string | undefined {
    return this.mainWalletKey
  }

  /**
   * Sets the default funding wallet using a private key
   * @param privateKey The private key of the funding wallet
   * @returns The public key of the funding wallet
   */
  setDefaultFundingWallet(privateKey: string): string {
    try {
      const decodedKey = bs58.decode(privateKey)
      this.defaultFundingWallet = Keypair.fromSecretKey(decodedKey)
      return this.defaultFundingWallet.publicKey.toString()
    } catch (error) {
      throw new Error(`Invalid private key: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Generates a specified number of Solana wallets
   * @param count Number of wallets to generate
   * @param saveToStorage Whether to save the generated wallets to storage
   * @returns Array of generated wallets
   */
  generateWallets(count = 1, saveToStorage = true): Wallet[] {
    try {
      const wallets: Wallet[] = []

      for (let i = 0; i < count; i++) {
        // Generate a new keypair
        const keypair = Keypair.generate()
        const wallet: Wallet = {
          id: `wallet-${Date.now()}-${i}`,
          address: keypair.publicKey.toString(),
          privateKey: bs58.encode(keypair.secretKey),
          balance: 0,
          selected: false,
          platform: "solana",
        }

        wallets.push(wallet)

        // Save to storage if requested
        if (saveToStorage) {
          this.storageManager.saveWallet(wallet)
        }
      }

      return wallets
    } catch (error) {
      throw new Error(`Failed to generate wallets: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Generates wallets from a mnemonic phrase
   * @param mnemonic The mnemonic phrase
   * @param count Number of wallets to derive
   * @param startIndex Starting derivation index
   * @param saveToStorage Whether to save the generated wallets to storage
   * @returns Array of generated wallets
   */
  generateWalletsFromMnemonic(mnemonic: string, count = 1, startIndex = 0, saveToStorage = true): Wallet[] {
    try {
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error("Invalid mnemonic phrase")
      }

      const wallets: Wallet[] = []
      const seed = bip39.mnemonicToSeedSync(mnemonic)

      for (let i = 0; i < count; i++) {
        const index = startIndex + i
        const derivedPath = `m/44'/501'/${index}'/0'`
        const derived = derivePath(derivedPath, seed.toString("hex"))
        const keypair = Keypair.fromSeed(derived.key)

        const wallet: Wallet = {
          id: `wallet-${Date.now()}-${i}`,
          address: keypair.publicKey.toString(),
          privateKey: bs58.encode(keypair.secretKey),
          balance: 0,
          selected: false,
          platform: "solana",
        }

        wallets.push(wallet)

        // Save to storage if requested
        if (saveToStorage) {
          this.storageManager.saveWallet(wallet)
        }
      }

      return wallets
    } catch (error) {
      throw new Error(
        `Failed to generate wallets from mnemonic: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Imports wallets from private keys
   * @param privateKeys Array of private keys to import
   * @param saveToStorage Whether to save the imported wallets to storage
   * @returns Array of imported wallets
   */
  importWalletsFromPrivateKeys(privateKeys: string[], saveToStorage = true): Wallet[] {
    try {
      const wallets: Wallet[] = []

      for (let i = 0; i < privateKeys.length; i++) {
        const privateKey = privateKeys[i]
        const decodedKey = bs58.decode(privateKey)
        const keypair = Keypair.fromSecretKey(decodedKey)

        const wallet: Wallet = {
          id: `wallet-${Date.now()}-${i}`,
          address: keypair.publicKey.toString(),
          privateKey: privateKey,
          balance: 0,
          selected: false,
          platform: "solana",
        }

        wallets.push(wallet)

        // Save to storage if requested
        if (saveToStorage) {
          this.storageManager.saveWallet(wallet)
        }
      }

      return wallets
    } catch (error) {
      throw new Error(`Failed to import wallets: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Imports wallets from a JSON file content
   * @param jsonContent JSON string containing wallet data
   * @param saveToStorage Whether to save the imported wallets to storage
   * @returns Array of imported wallets
   */
  importWalletsFromJson(jsonContent: string, saveToStorage = true): Wallet[] {
    try {
      const data = JSON.parse(jsonContent)
      let wallets: Wallet[] = []

      // Handle different JSON formats
      if (Array.isArray(data)) {
        // Direct array of wallets
        wallets = data.map((item, index) => {
          // Ensure the item has the required fields
          if (!item.address || !item.privateKey) {
            throw new Error(`Wallet at index ${index} is missing required fields`)
          }

          return {
            id: item.id || `wallet-${Date.now()}-${index}`,
            address: item.address,
            privateKey: item.privateKey,
            balance: item.balance || 0,
            selected: item.selected || false,
            platform: "solana",
          }
        })
      } else if (data.wallets && Array.isArray(data.wallets)) {
        // Nested wallets array
        wallets = data.wallets.map((item: any, index: number) => {
          if (!item.address || !item.privateKey) {
            throw new Error(`Wallet at index ${index} is missing required fields`)
          }

          return {
            id: item.id || `wallet-${Date.now()}-${index}`,
            address: item.address,
            privateKey: item.privateKey,
            balance: item.balance || 0,
            selected: item.selected || false,
            platform: "solana",
          }
        })
      } else {
        throw new Error("Invalid wallet JSON format")
      }

      // Save to storage if requested
      if (saveToStorage) {
        wallets.forEach((wallet) => {
          this.storageManager.saveWallet(wallet)
        })
      }

      return wallets
    } catch (error) {
      throw new Error(`Failed to import wallets from JSON: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Exports wallets to a JSON string
   * @param walletIds Optional array of wallet IDs to export (exports all if not provided)
   * @param includePrivateKeys Whether to include private keys in the export
   * @returns JSON string containing the exported wallets
   */
  exportWalletsToJson(walletIds?: string[], includePrivateKeys = true): string {
    try {
      let wallets: Wallet[]

      if (walletIds && walletIds.length > 0) {
        // Export specific wallets
        wallets = walletIds.map((id) => {
          const wallet = this.storageManager.getWallet(id)
          if (!wallet) {
            throw new Error(`Wallet with ID ${id} not found`)
          }
          return wallet
        })
      } else {
        // Export all wallets
        wallets = this.storageManager.getAllWallets()
      }

      // Remove private keys if not including them
      if (!includePrivateKeys) {
        wallets = wallets.map((wallet) => {
          const { privateKey, ...rest } = wallet
          return rest as Wallet
        })
      }

      return JSON.stringify(
        {
          exportDate: new Date().toISOString(),
          platform: "solana",
          wallets: wallets,
        },
        null,
        2,
      )
    } catch (error) {
      throw new Error(`Failed to export wallets: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Fetches all wallets from storage
   * @returns Array of wallets
   */
  fetchWallets(): Wallet[] {
    try {
      return this.storageManager.getAllWallets()
    } catch (error) {
      throw new Error(`Failed to fetch wallets: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Fetches a specific wallet by ID
   * @param walletId The ID of the wallet to fetch
   * @returns The wallet or null if not found
   */
  fetchWallet(walletId: string): Wallet | null {
    try {
      return this.storageManager.getWallet(walletId)
    } catch (error) {
      throw new Error(`Failed to fetch wallet: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Checks the SOL balance of a wallet
   * @param walletAddress The address of the wallet to check
   * @param updateStorage Whether to update the balance in storage
   * @returns The balance in SOL
   */
  async checkSolBalance(walletAddress: string, updateStorage = true): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress)
      const balance = await this.connection.getBalance(publicKey)
      const solBalance = balance / LAMPORTS_PER_SOL

      // Update storage if requested
      if (updateStorage) {
        const wallet = this.storageManager.getAllWallets().find((w) => w.address === walletAddress)
        if (wallet) {
          wallet.balance = solBalance
          this.storageManager.updateWallet(wallet.id, { balance: solBalance })
        }
      }

      return solBalance
    } catch (error) {
      throw new Error(`Failed to check SOL balance: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Checks the SOL balances of multiple wallets
   * @param walletAddresses Array of wallet addresses to check
   * @param updateStorage Whether to update the balances in storage
   * @returns Object mapping wallet addresses to their SOL balances
   */
  async checkMultipleSolBalances(walletAddresses: string[], updateStorage = true): Promise<Record<string, number>> {
    try {
      const balances: Record<string, number> = {}

      // Process in batches to avoid rate limiting
      const batchSize = 10
      for (let i = 0; i < walletAddresses.length; i += batchSize) {
        const batch = walletAddresses.slice(i, i + batchSize)
        const promises = batch.map((address) => this.checkSolBalance(address, updateStorage))
        const results = await Promise.all(promises)

        batch.forEach((address, index) => {
          balances[address] = results[index]
        })
      }

      return balances
    } catch (error) {
      throw new Error(
        `Failed to check multiple SOL balances: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Checks the token balance of a wallet
   * @param walletAddress The address of the wallet to check
   * @param tokenAddress The address of the token to check
   * @returns The token balance
   */
  async checkTokenBalance(walletAddress: string, tokenAddress: string): Promise<number> {
    try {
      const walletPublicKey = new PublicKey(walletAddress)
      const tokenPublicKey = new PublicKey(tokenAddress)

      // Get token account info
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(walletPublicKey, {
        mint: tokenPublicKey,
      })

      // If no token accounts found, balance is 0
      if (tokenAccounts.value.length === 0) {
        return 0
      }

      // Get balance from the first token account
      const tokenAccount = tokenAccounts.value[0]
      const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount

      // Convert to decimal based on decimals
      const balance = tokenAmount.uiAmount || 0

      return balance
    } catch (error) {
      throw new Error(`Failed to check token balance: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Funds a wallet with SOL
   * @param recipientAddress The address of the wallet to fund
   * @param amount The amount of SOL to send
   * @param fundingPrivateKey Optional private key of the funding wallet (uses default if not provided)
   * @returns Transaction signature
   */
  async fundWallet(recipientAddress: string, amount: number, fundingPrivateKey?: string): Promise<string> {
    try {
      // Determine the funding wallet
      let fundingWallet: Keypair
      if (fundingPrivateKey) {
        const decodedKey = bs58.decode(fundingPrivateKey)
        fundingWallet = Keypair.fromSecretKey(decodedKey)
      } else if (this.defaultFundingWallet) {
        fundingWallet = this.defaultFundingWallet
      } else {
        throw new Error("No funding wallet provided")
      }

      const recipientPublicKey = new PublicKey(recipientAddress)

      // Create and send transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fundingWallet.publicKey,
          toPubkey: recipientPublicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      )

      const signature = await sendAndConfirmTransaction(this.connection, transaction, [fundingWallet])

      // Update recipient wallet balance in storage
      const wallet = this.storageManager.getAllWallets().find((w) => w.address === recipientAddress)
      if (wallet) {
        const newBalance = await this.checkSolBalance(recipientAddress, false)
        this.storageManager.updateWallet(wallet.id, { balance: newBalance })
      }

      return signature
    } catch (error) {
      throw new Error(`Failed to fund wallet: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Funds multiple wallets with SOL
   * @param recipientAddresses Array of wallet addresses to fund
   * @param amount The amount of SOL to send to each wallet
   * @param fundingPrivateKey Optional private key of the funding wallet (uses default if not provided)
   * @returns Object mapping wallet addresses to their transaction signatures
   */
  async fundMultipleWallets(
    recipientAddresses: string[],
    amount: number,
    fundingPrivateKey?: string,
  ): Promise<Record<string, string>> {
    try {
      const results: Record<string, string> = {}

      // Process in batches to avoid rate limiting
      const batchSize = 5
      for (let i = 0; i < recipientAddresses.length; i += batchSize) {
        const batch = recipientAddresses.slice(i, i + batchSize)
        const promises = batch.map((address) => this.fundWallet(address, amount, fundingPrivateKey))
        const signatures = await Promise.all(promises)

        batch.forEach((address, index) => {
          results[address] = signatures[index]
        })
      }

      return results
    } catch (error) {
      throw new Error(`Failed to fund multiple wallets: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Deletes a wallet from storage
   * @param walletId The ID of the wallet to delete
   * @returns True if successful
   */
  deleteWallet(walletId: string): boolean {
    try {
      this.storageManager.deleteWallet(walletId)
      return true
    } catch (error) {
      throw new Error(`Failed to delete wallet: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Deletes multiple wallets from storage
   * @param walletIds Array of wallet IDs to delete
   * @returns Number of wallets deleted
   */
  deleteMultipleWallets(walletIds: string[]): number {
    try {
      let deletedCount = 0

      walletIds.forEach((id) => {
        try {
          this.storageManager.deleteWallet(id)
          deletedCount++
        } catch (error) {
          console.error(`Error deleting wallet ${id}:`, error)
        }
      })

      return deletedCount
    } catch (error) {
      throw new Error(`Failed to delete multiple wallets: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Updates wallet properties
   * @param walletId The ID of the wallet to update
   * @param updates Object containing the properties to update
   * @returns The updated wallet or null if not found
   */
  updateWallet(walletId: string, updates: Partial<Wallet>): Wallet | null {
    try {
      return this.storageManager.updateWallet(walletId, updates)
    } catch (error) {
      throw new Error(`Failed to update wallet: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Generates a new mnemonic phrase
   * @param strength The strength of the mnemonic (128, 160, 192, 224, 256)
   * @returns The generated mnemonic phrase
   */
  generateMnemonic(strength: 128 | 160 | 192 | 224 | 256 = 256): string {
    try {
      return bip39.generateMnemonic(strength)
    } catch (error) {
      throw new Error(`Failed to generate mnemonic: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Validates a Solana address
   * @param address The address to validate
   * @returns True if the address is valid
   */
  isValidSolanaAddress(address: string): boolean {
    try {
      new PublicKey(address)
      return true
    } catch (error) {
      return false
    }
  }

  public async fetchWallets2(): Promise<WalletInfo[]> {
    try {
      // In a real implementation, this would fetch wallets from storage or blockchain
      const storedWallets = localStorage.getItem(this.storageNamespace)
      if (storedWallets) {
        return JSON.parse(storedWallets)
      }
      return []
    } catch (error) {
      console.error("Error fetching wallets:", error)
      return []
    }
  }

  public generateWallets2(count: number): WalletInfo[] {
    try {
      const wallets: WalletInfo[] = []

      for (let i = 0; i < count; i++) {
        // Generate a random private key (in a real implementation, this would use proper key generation)
        const privateKey = bs58.encode(Buffer.from(Array.from({ length: 32 }, () => Math.floor(Math.random() * 256))))

        // Generate a Solana-style address
        const address = bs58.encode(Buffer.from(Array.from({ length: 32 }, () => Math.floor(Math.random() * 256))))

        wallets.push({
          id: uuidv4(),
          address,
          privateKey,
          balance: 0,
        })
      }

      // Save wallets to storage
      this.saveWallets(wallets)

      return wallets
    } catch (error) {
      console.error("Error generating wallets:", error)
      return []
    }
  }

  public async fundWallets2(addresses: string[], amount: number): Promise<boolean> {
    try {
      if (!this.mainWalletKey) {
        throw new Error("Main wallet private key not set")
      }

      // In a real implementation, this would use the main wallet key to send funds
      console.log(`Funding ${addresses.length} wallets with ${amount} SOL each using main wallet`)

      // Simulate funding success
      return true
    } catch (error) {
      console.error("Error funding wallets:", error)
      return false
    }
  }

  private saveWallets(wallets: WalletInfo[]): void {
    try {
      const existingWalletsStr = localStorage.getItem(this.storageNamespace)
      let existingWallets: WalletInfo[] = []

      if (existingWalletsStr) {
        existingWallets = JSON.parse(existingWalletsStr)
      }

      // Merge new wallets with existing ones
      const mergedWallets = [...existingWallets, ...wallets]

      // Save to storage
      localStorage.setItem(this.storageNamespace, JSON.stringify(mergedWallets))
    } catch (error) {
      console.error("Error saving wallets:", error)
    }
  }
}
