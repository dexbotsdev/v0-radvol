/**
 * API Service for Trading Platform
 * Handles communication with the backend Express.js server
 */

import { toast } from "sonner"
import type { Wallet } from "@/app/(dashboard)/trading/types"

// Base URL for API requests - should be configured based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Error handling helper
const handleApiError = (error: any, customMessage: string) => {
  console.error(`${customMessage}:`, error)
  const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred"
  toast.error(`${customMessage}: ${errorMessage}`)
  return { success: false, error: errorMessage }
}

// Interface for configuration data
export interface ConfigData {
  mainWalletKey: string
  fundingWalletKey: string
}

// Interface for RPC information
export interface RPCInfo {
  rpcUrl: string
  privateKey: string
}

// Interface for wallet generation request
export interface GenerateWalletsRequest {
  count: number
}

// Interface for funding wallets request
export interface FundWalletsRequest {
  walletIds: string[]
  amount: number
  fundingWalletKey: string
}

// Interface for burning wallets request
export interface BurnWalletsRequest {
  walletIds: string[]
}

// Interface for API response
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Trading API Service
 * Provides methods to interact with the backend server
 */
export const TradingApiService = {
  /**
   * Save configuration from ConfigDialog
   */
  async saveConfig(config: ConfigData): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${API_BASE_URL}/config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      toast.success("Configuration saved successfully")
      return { success: true, data: true }
    } catch (error) {
      return handleApiError(error, "Failed to save configuration")
    }
  },

  /**
   * Save RPC information from GeneralSettingsDialog
   */
  async saveRPCInfo(rpcInfo: RPCInfo): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/rpc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rpcInfo),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      toast.success("RPC settings saved successfully")
      return { success: true, data: true }
    } catch (error) {
      return handleApiError(error, "Failed to save RPC settings")
    }
  },

  /**
   * Generate wallets from WalletsTab
   */
  async generateWallets(request: GenerateWalletsRequest): Promise<ApiResponse<Wallet[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      toast.success(`Generated ${request.count} wallets successfully`)
      return { success: true, data: data.wallets }
    } catch (error) {
      return handleApiError(error, "Failed to generate wallets")
    }
  },

  /**
   * Fund wallets from WalletsTab
   */
  async fundWallets(request: FundWalletsRequest): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets/fund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      toast.success(`Funded ${request.walletIds.length} wallets with ${request.amount} SOL`)
      return { success: true, data: true }
    } catch (error) {
      return handleApiError(error, "Failed to fund wallets")
    }
  },

  /**
   * Burn/delete wallets from WalletsTab
   */
  async burnWallets(request: BurnWalletsRequest): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets/burn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      toast.success(`Burned ${request.walletIds.length} wallets successfully`)
      return { success: true, data: true }
    } catch (error) {
      return handleApiError(error, "Failed to burn wallets")
    }
  },

  /**
   * Get all wallets
   */
  async getWallets(): Promise<ApiResponse<Wallet[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data: data.wallets }
    } catch (error) {
      return handleApiError(error, "Failed to fetch wallets")
    }
  },
}
