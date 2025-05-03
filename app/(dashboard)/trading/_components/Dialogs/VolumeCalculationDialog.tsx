"use client"

import { useState, useEffect } from "react"
import { X, AlertCircle, Wallet } from "lucide-react"
import type { BotConfig } from "../../types"

interface VolumeCalculationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  botConfig: BotConfig
  currentPrice: number
  walletCount: number
}

export function VolumeCalculationDialog({
  isOpen,
  onClose,
  onConfirm,
  botConfig,
  currentPrice,
  walletCount,
}: VolumeCalculationDialogProps) {
  const [calculatedValues, setCalculatedValues] = useState({
    hourlyVolume: 0,
    solPerWallet: 0,
    devWalletFees: 0,
    tokenAccountCreationCost: 0,
    txnFeesPerHour: 0,
    hourlyVolumeInSol: 0,
    hourlyVolumeInUsdt: 0,
    totalWalletFunds: 0,
  })

  const SOL_PRICE_USD = 145 // Fixed SOL price in USD as specified

  // Recalculate when any of these values change
  useEffect(() => {
    if (isOpen) {
      calculateVolume()
    }
  }, [
    isOpen,
    botConfig,
    currentPrice,
    walletCount,
    botConfig.minTradeAmount,
    botConfig.maxTradeAmount,
    botConfig.numberOfBuys,
    botConfig.numberOfSells,
    botConfig.intervalMinutes,
    botConfig.tradesPerInterval,
  ])

  const calculateVolume = () => {
    // Extract values from botConfig
    const { maxTradeAmount, numberOfBuys, numberOfSells, intervalMinutes, tradesPerInterval } = botConfig

    // Volume = Duration (Hrs) × 60 × Number of Trades Per Minute × (Buys + Sells) × Max Trade Amount × SOL Price ($145)
    const durationHrs = intervalMinutes // Now in hours
    const tradesPerMinute = tradesPerInterval // Number of trades per minute

    const totalVolumeInSol = durationHrs * 60 * tradesPerMinute * (numberOfBuys + numberOfSells) * maxTradeAmount
    const totalVolumeInUsdt = totalVolumeInSol * SOL_PRICE_USD

    // Calculate hourly volumes
    const hourlyVolumeInSol = totalVolumeInSol / durationHrs
    const hourlyVolumeInUsdt = totalVolumeInUsdt / durationHrs

    // Updated: Txn Fees = Duration (Hrs) × 60 × Number of Trades Per Minute × (Buys + Sells) * 0.0005 sol
    const txnFeePerTrade = 0.0005 // SOL (updated from 0.00005)
    const txnFeesTotal = durationHrs * 60 * tradesPerMinute * (numberOfBuys + numberOfSells) * txnFeePerTrade
    const txnFeesPerHour = txnFeesTotal / durationHrs

    // Updated: Token Account creation Funds = 2 * 0.0023098
    const tokenAccountCreationCost = 2 * 0.0023098 // Fixed cost, not per wallet

    // Total Wallet Funds Required = Wallets Count * 0.005 Sol
    const solPerWallet = 0.005
    const totalWalletFunds = walletCount * solPerWallet

    // Dev wallet fees (5x the max trade amount)
    const devWalletFees = botConfig.maxTradeAmount * 5

    setCalculatedValues({
      hourlyVolume: hourlyVolumeInUsdt,
      solPerWallet,
      devWalletFees,
      tokenAccountCreationCost,
      txnFeesPerHour,
      hourlyVolumeInSol,
      hourlyVolumeInUsdt,
      totalWalletFunds,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#121212] border border-[#333] rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Volume Calculation</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#333]">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-400 mt-0.5" size={18} />
              <div>
                <p className="text-sm text-blue-300">
                  These calculations are based on the formula:
                  <br />
                  Volume = Duration (Hrs) × 60 × Trades Per Min × (Buys + Sells) × Max Trade × SOL Price ($145)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Trading Configuration</h3>
            <div className="bg-[#1a1a1a] p-3 rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Max Trade Amount:</span>
                <span className="text-xs">{botConfig.maxTradeAmount} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Duration (Hrs):</span>
                <span className="text-xs">{botConfig.intervalMinutes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Trades Per Minute:</span>
                <span className="text-xs">{botConfig.tradesPerInterval}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Buys Per Trade:</span>
                <span className="text-xs">{botConfig.numberOfBuys}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Sells Per Trade:</span>
                <span className="text-xs">{botConfig.numberOfSells}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">SOL Price (Fixed):</span>
                <span className="text-xs">${SOL_PRICE_USD.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Estimated Volume</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1a1a1a] p-3 rounded-md">
                <div className="text-xs text-gray-400">Hourly (SOL)</div>
                <div className="text-lg font-semibold">
                  {calculatedValues.hourlyVolumeInSol.toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL
                </div>
              </div>

              <div className="bg-[#1a1a1a] p-3 rounded-md">
                <div className="text-xs text-gray-400">Hourly (USDT)</div>
                <div className="text-lg font-semibold">
                  ${calculatedValues.hourlyVolumeInUsdt.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">SOL Requirements</h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-gray-400" />
                  <span className="text-sm">Per Wallet (0.005 SOL)</span>
                </div>
                <div className="font-semibold">
                  {calculatedValues.solPerWallet.toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL
                </div>
              </div>

              <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-gray-400" />
                  <span className="text-sm">Total Wallet Funds ({walletCount} wallets)</span>
                </div>
                <div className="font-semibold">
                  {calculatedValues.totalWalletFunds.toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL
                </div>
              </div>

              <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-gray-400" />
                  <span className="text-sm">Token Account Creation</span>
                </div>
                <div className="font-semibold">
                  {calculatedValues.tokenAccountCreationCost.toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
                  SOL
                </div>
              </div>

              <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-gray-400" />
                  <span className="text-sm">Txn Fees (per hour)</span>
                </div>
                <div className="font-semibold">
                  {calculatedValues.txnFeesPerHour.toLocaleString(undefined, { maximumFractionDigits: 6 })} SOL
                </div>
              </div>

              <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-gray-400" />
                  <span className="text-sm">Dev Wallet (5x max trade)</span>
                </div>
                <div className="font-semibold">
                  {calculatedValues.devWalletFees.toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-[#333] hover:bg-[#444] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              Start Bot
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
