"use client"
import { Plus, DollarSign, Trash2, WalletIcon, AlertCircle, Loader2 } from "lucide-react"
import type { Wallet as WalletType } from "../../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"
import { TradingApiService } from "@/lib/api/trading-api-service"
import { toast } from "sonner"

export function WalletsTab({
  wallets,
  walletCount,
  selectAll,
  botRunning,
  setWalletCount,
  generateWallets: originalGenerateWallets,
  fundWallets: originalFundWallets,
  burnWallets: originalBurnWallets,
  toggleSelectAll,
  toggleWalletSelection,
}: {
  wallets: WalletType[]
  walletCount: number
  selectAll: boolean
  botRunning: boolean
  setWalletCount: (count: number) => void
  generateWallets: () => void
  fundWallets: () => void
  burnWallets: () => void
  toggleSelectAll: () => void
  toggleWalletSelection: (id: string) => void
}) {
  const [fundAmount, setFundAmount] = useState("0.01")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFunding, setIsFunding] = useState(false)
  const [isBurning, setIsBurning] = useState(false)
  const selectedCount = wallets.filter((w) => w.selected).length

  // Function to fetch wallets from API
  const fetchWallets = async () => {
    try {
      const response = await TradingApiService.getWallets()
      if (response.success && response.data) {
        // Update wallets in parent component
        // This would require a new prop to update wallets
        // For now, we'll just log it
        console.log("Fetched wallets:", response.data)
      }
    } catch (error) {
      console.error("Error fetching wallets:", error)
    }
  }

  // Generate wallets using API
  const generateWallets = async () => {
    try {
      setIsGenerating(true)
      const response = await TradingApiService.generateWallets({ count: walletCount })

      if (response.success && response.data) {
        // Call original function to update UI state
        originalGenerateWallets()

        // Alternatively, if the API returns the generated wallets:
        // updateWallets(response.data)
      } else {
        toast.error("Failed to generate wallets")
      }
    } catch (error) {
      console.error("Error generating wallets:", error)
      toast.error("Failed to generate wallets")
    } finally {
      setIsGenerating(false)
    }
  }

  // Fund wallets using API
  const fundWallets = async () => {
    try {
      setIsFunding(true)

      // Get funding wallet key from localStorage
      const fundingWalletKey = localStorage.getItem("fundingWalletPrivateKey")
      if (!fundingWalletKey) {
        toast.error("Funding wallet private key not found")
        return
      }

      // Get selected wallet IDs
      const selectedWalletIds = wallets.filter((w) => w.selected).map((w) => w.id)
      if (selectedWalletIds.length === 0) {
        toast.error("No wallets selected")
        return
      }

      const response = await TradingApiService.fundWallets({
        walletIds: selectedWalletIds,
        amount: Number(fundAmount),
        fundingWalletKey,
      })

      if (response.success) {
        // Call original function to update UI state
        originalFundWallets()

        // Refresh wallets to get updated balances
        fetchWallets()
      } else {
        toast.error("Failed to fund wallets")
      }
    } catch (error) {
      console.error("Error funding wallets:", error)
      toast.error("Failed to fund wallets")
    } finally {
      setIsFunding(false)
    }
  }

  // Burn wallets using API
  const burnWallets = async () => {
    try {
      setIsBurning(true)

      // Get selected wallet IDs
      const selectedWalletIds = wallets.filter((w) => w.selected).map((w) => w.id)
      if (selectedWalletIds.length === 0) {
        toast.error("No wallets selected")
        return
      }

      const response = await TradingApiService.burnWallets({
        walletIds: selectedWalletIds,
      })

      if (response.success) {
        // Call original function to update UI state
        originalBurnWallets()
      } else {
        toast.error("Failed to burn wallets")
      }
    } catch (error) {
      console.error("Error burning wallets:", error)
      toast.error("Failed to burn wallets")
    } finally {
      setIsBurning(false)
    }
  }

  // Fetch wallets on component mount
  useEffect(() => {
    fetchWallets()
  }, [])

  return (
    <div className="relative">
      {botRunning && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-none">
          <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 p-4 rounded-none border border-gray-700 shadow-xl max-w-[90%]">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <AlertCircle className="h-4 w-4" />
              <h3 className="font-medium text-sm">Wallet Management Locked</h3>
            </div>
            <p className="text-xs text-gray-300">Stop the bot to manage wallets</p>
          </div>
        </div>
      )}

      {/* Only show wallet counts */}
      <div className="flex items-center justify-end mb-3 mt-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] py-0 h-5 font-normal bg-gray-800/50">
            {wallets.length} total
          </Badge>
          {selectedCount > 0 && (
            <Badge className="text-[10px] py-0 h-5 font-normal bg-blue-900/30 text-blue-300 border-blue-800">
              {selectedCount} selected
            </Badge>
          )}
        </div>
      </div>

      {/* Compact controls */}
      <Card className="bg-gradient-to-b from-gray-800/40 to-gray-900/40  rounded-none border-gray-700/50 shadow-sm mb-3">
        <div className="p-3">
          {/* Select All and Burn row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="select-all"
                checked={selectAll}
                onChange={toggleSelectAll}
                className="mr-2 h-3 w-3 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                disabled={botRunning}
              />
              <label htmlFor="select-all" className="text-xs text-gray-400">
                Select All
              </label>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={burnWallets}
                    size="sm"
                    variant="ghost"
                    className={`h-6 px-2 text-xs hover:bg-red-900/20 hover:text-red-400 ${
                      botRunning || !wallets.some((w) => w.selected) || isBurning ? "opacity-50" : "text-red-500"
                    }`}
                    disabled={botRunning || !wallets.some((w) => w.selected) || isBurning}
                  >
                    {isBurning ? (
                      <Loader2 size={12} className="mr-1 animate-spin" />
                    ) : (
                      <Trash2 size={12} className="mr-1" />
                    )}
                    {isBurning ? "Burning..." : "Burn"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p>Delete selected wallets</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Generate and Fund rows - stacked for better layout */}
          <div className="space-y-2">
            {/* Generate wallets row */}
            <div className="flex items-center gap-2">
              <div className="w-1/2">
                <Input
                  id="walletGenerator"
                  type="number"
                  value={walletCount}
                  onChange={(e) => setWalletCount(Math.max(5, Number.parseInt(e.target.value) || 5))}
                  className="w-full h-7 bg-gray-900/70 border-gray-700/50 text-xs px-2"
                  min="5"
                  disabled={botRunning || isGenerating}
                />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={generateWallets}
                      size="sm"
                      variant="secondary"
                      className="h-7 px-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700"
                      disabled={botRunning || isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 size={12} className="mr-1 animate-spin" />
                      ) : (
                        <Plus size={12} className="mr-1" />
                      )}
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p>Generate new Solana wallets</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Fund wallets row with larger input field */}
            <div className="flex items-center gap-2">
              <div className="w-1/2 relative">
                <Input
                  id="fundAmount"
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-full h-7 bg-gray-900/70 border-gray-700/50 text-xs pr-7 pl-2"
                  min="0.01"
                  step="0.01"
                  disabled={botRunning || isFunding}
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[10px] text-gray-400">
                  SOL
                </span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={fundWallets}
                      size="sm"
                      variant="secondary"
                      className="h-7 px-2 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700"
                      disabled={botRunning || !wallets.some((w) => w.selected) || isFunding}
                    >
                      {isFunding ? (
                        <Loader2 size={12} className="mr-1 animate-spin" />
                      ) : (
                        <DollarSign size={12} className="mr-1" />
                      )}
                      {isFunding ? "Funding..." : "Fund"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p>Fund selected wallets with SOL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </Card>

      {/* Wallet Stats Info */}
      <div className="mt-4">
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Wallet Statistics</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Generated Wallets:</span>
              <span className="text-xs font-medium text-white bg-gray-700/50 px-2 py-1 rounded">{wallets.length}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Funded Wallets:</span>
              <span className="text-xs font-medium text-white bg-gray-700/50 px-2 py-1 rounded">
                {wallets.filter((w) => Number.parseFloat(w.balance) > 0).length}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Selected Wallets:</span>
              <span className="text-xs font-medium text-white bg-gray-700/50 px-2 py-1 rounded">{selectedCount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Total Balance:</span>
              <span className="text-xs font-medium text-green-400 bg-gray-700/50 px-2 py-1 rounded">
                {wallets.reduce((sum, wallet) => sum + Number.parseFloat(wallet.balance), 0).toFixed(4)} SOL
              </span>
            </div>
          </div>

          {wallets.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-4 py-4 px-3 text-center bg-gray-800/20 rounded-lg border border-dashed border-gray-800">
              <WalletIcon className="h-8 w-8 text-gray-600 mb-2" />
              <p className="text-gray-400 text-xs">No wallets available</p>
              <Button
                onClick={generateWallets}
                size="sm"
                variant="ghost"
                className="mt-2 h-7 text-xs"
                disabled={botRunning || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 size={12} className="mr-1 animate-spin" />
                ) : (
                  <Plus size={12} className="mr-1" />
                )}
                {isGenerating ? "Generating..." : "Generate Wallets"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
