import { Wallet, type WalletAttributes } from "../models/wallet.model"
import { generateKeyPair } from "@solana/web3.js"

export class WalletService {
  /**
   * Get all wallets
   */
  async getAllWallets(): Promise<Wallet[]> {
    return await Wallet.findAll()
  }

  /**
   * Generate new wallets
   * @param count Number of wallets to generate
   */
  async generateWallets(count: number): Promise<Wallet[]> {
    const wallets: Wallet[] = []

    for (let i = 0; i < count; i++) {
      const keypair = generateKeyPair()
      const walletData: WalletAttributes = {
        publicKey: keypair.publicKey.toString(),
        privateKey: Buffer.from(keypair.secretKey).toString("base64"),
        balance: "0",
        selected: false,
      }

      const wallet = await Wallet.create(walletData)
      wallets.push(wallet)
    }

    return wallets
  }

  /**
   * Fund wallets with SOL
   * @param walletIds IDs of wallets to fund
   * @param amount Amount of SOL to fund each wallet with
   * @param fundingWalletKey Private key of funding wallet
   */
  async fundWallets(walletIds: string[], amount: number, fundingWalletKey: string): Promise<void> {
    // In a real implementation, this would use the Solana web3.js library
    // to create and send transactions to fund the wallets

    // For now, we'll just update the balances in the database
    const wallets = await Wallet.findAll({
      where: {
        id: walletIds,
      },
    })

    for (const wallet of wallets) {
      const currentBalance = Number.parseFloat(wallet.balance)
      wallet.balance = (currentBalance + amount).toString()
      await wallet.save()
    }
  }

  /**
   * Delete/burn wallets
   * @param walletIds IDs of wallets to delete
   */
  async burnWallets(walletIds: string[]): Promise<number> {
    return await Wallet.destroy({
      where: {
        id: walletIds,
      },
    })
  }

  /**
   * Update wallet selection status
   * @param walletId Wallet ID
   * @param selected Selection status
   */
  async updateWalletSelection(walletId: string, selected: boolean): Promise<Wallet | null> {
    const wallet = await Wallet.findByPk(walletId)

    if (!wallet) {
      return null
    }

    wallet.selected = selected
    await wallet.save()

    return wallet
  }
}

export default new WalletService()
