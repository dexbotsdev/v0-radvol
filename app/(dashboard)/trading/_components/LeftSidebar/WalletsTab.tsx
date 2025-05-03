"use client"
import { Plus, DollarSign, Trash2, WalletIcon, AlertCircle, CheckCircle2 } from "lucide-react"
import type { Wallet as WalletType } from "../../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"

export function WalletsTab({
  wallets,
  walletCount,
  selectAll,
  botRunning,
  setWalletCount,
  generateWallets,
  fundWallets,
  burnWallets,
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
  const selectedCount = wallets.filter((w) => w.selected).length

  return (
    <div className="p-3 relative">
      {botRunning && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-md">
          <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 p-4 rounded-lg border border-gray-700 shadow-xl max-w-[90%]">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <AlertCircle className="h-4 w-4" />
              <h3 className="font-medium text-sm">Wallet Management Locked</h3>
            </div>
            <p className="text-xs text-gray-300">Stop the bot to manage wallets</p>
          </div>
        </div>
      )}

      {/* Only show wallet counts */}
      <div className="flex items-center justify-end mb-3">
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
      <Card className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 border-gray-700/50 shadow-sm mb-3">
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
                      botRunning || !wallets.some((w) => w.selected) ? "opacity-50" : "text-red-500"
                    }`}
                    disabled={botRunning || !wallets.some((w) => w.selected)}
                  >
                    <Trash2 size={12} className="mr-1" />
                    Burn
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
              <div className="w-16">
                <Input
                  id="walletGenerator"
                  type="number"
                  value={walletCount}
                  onChange={(e) => setWalletCount(Math.max(5, Number.parseInt(e.target.value) || 5))}
                  className="w-full h-7 bg-gray-900/70 border-gray-700/50 text-xs px-2"
                  min="5"
                  disabled={botRunning}
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
                      disabled={botRunning}
                    >
                      <Plus size={12} className="mr-1" />
                      Generate
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
              <div className="w-24 relative">
                <Input
                  id="fundAmount"
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-full h-7 bg-gray-900/70 border-gray-700/50 text-xs pr-7 pl-2"
                  min="0.01"
                  step="0.01"
                  disabled={botRunning}
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
                      className={`h-7 px-2 text-xs ${
                        botRunning || !wallets.some((w) => w.selected)
                          ? "opacity-50"
                          : "bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 border border-blue-800/50"
                      }`}
                      disabled={botRunning || !wallets.some((w) => w.selected)}
                    >
                      <DollarSign size={12} className="mr-1" />
                      Fund
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

      {/* Wallet list - increased height since search is removed */}
      <div className="max-h-[calc(100vh-240px)] overflow-y-auto pr-1 hide-scrollbar">
        {wallets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 px-3 text-center bg-gray-800/20 rounded-lg border border-dashed border-gray-800">
            <WalletIcon className="h-8 w-8 text-gray-600 mb-2" />
            <p className="text-gray-400 text-xs">No wallets available</p>
            <Button
              onClick={generateWallets}
              size="sm"
              variant="ghost"
              className="mt-2 h-7 text-xs"
              disabled={botRunning}
            >
              <Plus size={12} className="mr-1" />
              Generate Wallets
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className={`p-2 rounded-md flex items-center ${
                  wallet.selected
                    ? "bg-gradient-to-r from-blue-900/20 to-blue-800/10 border border-blue-800/30"
                    : "bg-gray-800/20 border border-gray-800/30 hover:bg-gray-800/30"
                } transition-colors`}
              >
                <input
                  type="checkbox"
                  checked={wallet.selected}
                  onChange={() => toggleWalletSelection(wallet.id)}
                  className="mr-2 h-3 w-3 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                  disabled={botRunning}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        Number.parseFloat(wallet.balance) > 0 ? "bg-green-500" : "bg-gray-500"
                      } mr-1.5`}
                    />
                    <p className="text-xs font-medium text-gray-300 truncate">{wallet.address}</p>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <div className="flex items-center">
                      <span className="text-[10px] text-gray-500">Balance:</span>
                      <span
                        className={`text-[10px] font-medium ml-1 ${
                          Number.parseFloat(wallet.balance) > 0 ? "text-green-400" : "text-gray-400"
                        }`}
                      >
                        {wallet.balance} SOL
                      </span>
                    </div>
                    {wallet.selected && <CheckCircle2 className="h-3 w-3 text-blue-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
