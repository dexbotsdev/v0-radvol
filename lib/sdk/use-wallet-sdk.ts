"use client"

import { useState, useEffect } from "react"
import { WalletSDK } from "./wallet-sdk"
import type { Wallet } from "./types"

interface UseWalletSDKOptions {
  rpcUrl: string
  platform?: string
  defaultFundingKey?: string
  autoLoadWallets?: boolean
}

export function useWalletSDK({
  rpcUrl,
  platform = "solana",
  defaultFundingKey,
  autoLoadWallets = true,
}: UseWalletSDKOptions) {
  const [sdk] = useState<WalletSDK>(() => {
    const instance = new WalletSDK(rpcUrl, platform)
    if (defaultFundingKey) {
      try {
        instance.setDefaultFundingWallet(defaultFundingKey)
      } catch (error) {
        console.error("Failed to set default funding wallet:", error)
      }
    }
    return instance
  })

  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Load wallets on mount if autoLoadWallets is true
  useEffect(() => {
    if (autoLoadWallets) {
      loadWallets()
    }
  }, [])

  // Function to load wallets from storage
  const loadWallets = async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchedWallets = sdk.fetchWallets()
      setWallets(fetchedWallets)
    } catch (err) {
      setError(`Failed to load wallets: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  // Function to generate wallets
  const generateWallets = async (count: number) => {
    setLoading(true)
    setError(null)
    try {
      const newWallets = sdk.generateWallets(count, true)
      setWallets((prev) => [...prev, ...newWallets])
      return newWallets
    } catch (err) {
      setError(`Failed to generate wallets: ${err instanceof Error ? err.message : String(err)}`)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Function to import wallets from private keys
  const importWalletsFromPrivateKeys = async (privateKeys: string[]) => {
    setLoading(true)
    setError(null)
    try {
      const importedWallets = sdk.importWalletsFromPrivateKeys(privateKeys, true)
      setWallets((prev) => [...prev, ...importedWallets])
      return importedWallets
    } catch (err) {
      setError(`Failed to import wallets: ${err instanceof Error ? err.message : String(err)}`)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Function to import wallets from JSON
  const importWalletsFromJson = async (jsonContent: string) => {
    setLoading(true)
    setError(null)
    try {
      const importedWallets = sdk.importWalletsFromJson(jsonContent, true)
      setWallets((prev) => [...prev, ...importedWallets])
      return importedWallets
    } catch (err) {
      setError(`Failed to import wallets from JSON: ${err instanceof Error ? err.message : String(err)}`)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Function to export wallets to JSON
  const exportWalletsToJson = (walletIds?: string[], includePrivateKeys = true) => {
    try {
      return sdk.exportWalletsToJson(walletIds, includePrivateKeys)
    } catch (err) {
      setError(`Failed to export wallets: ${err instanceof Error ? err.message : String(err)}`)
      return ""
    }
  }

  // Function to check SOL balances
  const checkSolBalances = async (addresses: string[]) => {
    setLoading(true)
    setError(null)
    try {
      const balances = await sdk.checkMultipleSolBalances(addresses, true)
      // Update wallets state with new balances
      setWallets((prev) =>
        prev.map((wallet) => {
          if (addresses.includes(wallet.address) && balances[wallet.address] !== undefined) {
            return { ...wallet, balance: balances[wallet.address] }
          }
          return wallet
        }),
      )
      return balances
    } catch (err) {
      setError(`Failed to check SOL balances: ${err instanceof Error ? err.message : String(err)}`)
      return {}
    } finally {
      setLoading(false)
    }
  }

  // Function to fund wallets
  const fundWallets = async (addresses: string[], amount: number, fundingKey?: string) => {
    setLoading(true)
    setError(null)
    try {
      const results = await sdk.fundMultipleWallets(addresses, amount, fundingKey)
      // Refresh balances after funding
      await checkSolBalances(addresses)
      return results
    } catch (err) {
      setError(`Failed to fund wallets: ${err instanceof Error ? err.message : String(err)}`)
      return {}
    } finally {
      setLoading(false)
    }
  }

  // Function to delete wallets
  const deleteWallets = (walletIds: string[]) => {
    setLoading(true)
    setError(null)
    try {
      const count = sdk.deleteMultipleWallets(walletIds)
      // Update wallets state by removing deleted wallets
      setWallets((prev) => prev.filter((wallet) => !walletIds.includes(wallet.id)))
      return count
    } catch (err) {
      setError(`Failed to delete wallets: ${err instanceof Error ? err.message : String(err)}`)
      return 0
    } finally {
      setLoading(false)
    }
  }

  // Function to check token balances
  const checkTokenBalance = async (walletAddress: string, tokenAddress: string) => {
    try {
      return await sdk.checkTokenBalance(walletAddress, tokenAddress)
    } catch (err) {
      setError(`Failed to check token balance: ${err instanceof Error ? err.message : String(err)}`)
      return 0
    }
  }

  return {
    sdk,
    wallets,
    loading,
    error,
    loadWallets,
    generateWallets,
    importWalletsFromPrivateKeys,
    importWalletsFromJson,
    exportWalletsToJson,
    checkSolBalances,
    fundWallets,
    deleteWallets,
    checkTokenBalance,
  }
}
