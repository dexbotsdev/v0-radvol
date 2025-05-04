"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Play, Pause, BarChart3, Zap, PaintBucket, TrendingUp, Minimize2, Plus, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Volume generation modes
type VolumeMode = "Turbo" | "Pulse" | "Painter" | "Bump" | "Micro"

// Wallet type
type Wallet = {
  id: number
  address: string
  balance: number
  transactions: number
  isActive: boolean
}

// Add the mock Pumpfun SDK
// In a real implementation, you would import from the actual SDK
// import { PumpfunSDK } from 'pumpfun-sdk'
const PumpfunSDK = {
  initialize: (token: string) => {
    console.log(`Initializing Pumpfun SDK with token: ${token}`)
    return {
      createWallets: async (count: number) => {
        console.log(`Creating ${count} wallets`)
        const wallets = []
        for (let i = 0; i < count; i++) {
          wallets.push({
            id: i + 1,
            address: `Wallet${i + 1}_${Math.random().toString(36).substring(2, 10)}`,
            balance: Number.parseFloat((Math.random() * 2 + 0.5).toFixed(4)),
            transactions: 0,
            isActive: false,
          })
        }
        return wallets
      },
      executeStrategy: async (strategy: string, params: any, wallets: any[], callback: (log: string) => void) => {
        console.log(`Executing ${strategy} strategy with params:`, params)
        console.log(`Using ${wallets.length} wallets`)

        // Simulate strategy execution
        let interval: NodeJS.Timeout
        let completedTransactions = 0
        const totalTransactions = params.totalTransactions || 10

        return new Promise<void>((resolve) => {
          interval = setInterval(() => {
            completedTransactions++
            const randomWalletIndex = Math.floor(Math.random() * wallets.length)
            const wallet = wallets[randomWalletIndex]

            callback(
              `${strategy}: Transaction ${completedTransactions}/${totalTransactions} from wallet ${wallet.address}`,
            )

            if (completedTransactions >= totalTransactions) {
              clearInterval(interval)
              callback(`${strategy} strategy completed successfully`)
              resolve()
            }
          }, params.interval || 1000)
        })
      },
      stopStrategy: () => {
        console.log("Stopping all strategies")
        return Promise.resolve()
      },
      airdropTokens: async (wallets: any[], amount: number, callback: (log: string) => void) => {
        console.log(`Airdropping tokens to ${wallets.length} wallets`)

        // Simulate airdrop
        for (let i = 0; i < wallets.length; i++) {
          const wallet = wallets[i]
          callback(`Airdropping ${amount} tokens to wallet ${wallet.address}`)
          await new Promise((resolve) => setTimeout(resolve, 500))
        }

        callback(`Airdrop completed to ${wallets.length} wallets`)
        return Promise.resolve()
      },
    }
  },
}

export default function VolumeGenerator() {
  // General settings
  const [walletCount, setWalletCount] = useState(5)
  const [minBuyAmount, setMinBuyAmount] = useState(0.01)
  const [maxBuyAmount, setMaxBuyAmount] = useState(0.05)
  const [enableHolders, setEnableHolders] = useState(false)
  const [volumeMode, setVolumeMode] = useState<VolumeMode>("Turbo")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAirdropping, setIsAirdropping] = useState(false)
  const [showTokenDialog, setShowTokenDialog] = useState(false)

  // New form fields
  const [duration, setDuration] = useState(30) // minutes
  const [tradesPerInterval, setTradesPerInterval] = useState(5)

  // Wallets
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [selectedWallets, setSelectedWallets] = useState<Set<number>>(new Set())

  // Status and logs
  const [logs, setLogs] = useState<string[]>([])
  const [totalVolume, setTotalVolume] = useState(0)
  const [successRate, setSuccessRate] = useState(100)
  const [avgPrice, setAvgPrice] = useState(0)

  // Add a reference to the SDK
  const [sdk, setSDK] = useState<any>(null)
  const [tokenAddress, setTokenAddress] = useState("")
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")

  // Initialize SDK when token address changes
  useEffect(() => {
    if (tokenAddress) {
      const newSDK = PumpfunSDK.initialize(tokenAddress)
      setSDK(newSDK)
      addLog(`Initialized Pumpfun SDK with token: ${tokenAddress}`)
    }
  }, [tokenAddress])

  // Handle mode change
  const handleModeChange = (value: string) => {
    setVolumeMode(value as VolumeMode)
  }

  // Handle token addition
  const handleAddToken = () => {
    if (!tokenAddress) {
      addLog("Error: Token address is required")
      return
    }

    addLog(`Added token: ${tokenName || tokenAddress}`)
    setShowTokenDialog(false)
  }

  // Generate wallets
  const generateWallets = async () => {
    if (!sdk) {
      addLog("Error: SDK not initialized. Please enter a token address.")
      return
    }

    try {
      addLog(`Generating ${walletCount} wallets...`)
      const newWallets = await sdk.createWallets(walletCount)
      setWallets(newWallets)
      addLog(`Successfully generated ${walletCount} wallets for volume generation`)
    } catch (error) {
      addLog(`Error generating wallets: ${error}`)
    }
  }

  // Handle airdrop
  const handleAirdrop = async () => {
    if (!sdk) {
      addLog("Error: SDK not initialized. Please enter a token address.")
      return
    }

    if (wallets.length === 0) {
      addLog("Error: No wallets available. Please generate wallets first.")
      return
    }

    try {
      setIsAirdropping(true)
      addLog(`Starting airdrop to ${wallets.length} wallets`)

      // Get selected wallets or all wallets if none selected
      const walletsToAirdrop = selectedWallets.size > 0 ? wallets.filter((w) => selectedWallets.has(w.id)) : wallets

      // Airdrop amount (using max buy amount as default)
      const airdropAmount = maxBuyAmount * 10

      await sdk.airdropTokens(walletsToAirdrop, airdropAmount, (log: string) => addLog(log))

      addLog(`Airdrop completed successfully`)
    } catch (error) {
      addLog(`Error during airdrop: ${error}`)
    } finally {
      setIsAirdropping(false)
    }
  }

  // Add a function to update wallet stats during strategy execution
  const updateWalletStats = (walletId: number, transactionAmount: number) => {
    setWallets((prev) =>
      prev.map((wallet) => {
        if (wallet.id === walletId) {
          return {
            ...wallet,
            transactions: wallet.transactions + 1,
            // Simulate balance changes based on transaction
            balance: Number(
              (wallet.balance + (Math.random() > 0.5 ? transactionAmount : -transactionAmount * 0.9)).toFixed(4),
            ),
          }
        }
        return wallet
      }),
    )
  }

  // Add a function to simulate real-time strategy progress
  const simulateStrategyProgress = (
    strategy: string,
    params: any,
    wallets: any[],
    onLog: (log: string) => void,
    onComplete: () => void,
  ) => {
    let transactions = 0
    const totalTx = params.totalTransactions || 20
    const interval = params.interval || 1000
    const shouldCreateNewWallets = ["Turbo", "Micro", "Bump"].includes(strategy)

    // Different patterns for different strategies
    const getNextAmount = () => {
      switch (strategy) {
        case "Turbo":
          return Number((minBuyAmount + Math.random() * (maxBuyAmount - minBuyAmount)).toFixed(4))
        case "Pulse":
          // Pulse has bursts of activity
          return transactions % params.burstSize === 0
            ? Number((maxBuyAmount * 0.8).toFixed(4))
            : Number((minBuyAmount + Math.random() * (maxBuyAmount - minBuyAmount)).toFixed(4))
        case "Painter":
          // Painter follows a pattern
          if (params.pattern === "Ascending") {
            const progress = transactions / totalTx
            return Number((minBuyAmount + progress * (maxBuyAmount - minBuyAmount)).toFixed(4))
          } else if (params.pattern === "Descending") {
            const progress = transactions / totalTx
            return Number((maxBuyAmount - progress * (maxBuyAmount - minBuyAmount)).toFixed(4))
          } else {
            return Number((minBuyAmount + Math.random() * (maxBuyAmount - minBuyAmount)).toFixed(4))
          }
        case "Bump":
          // Bump creates price spikes
          const progress = transactions / totalTx
          if (progress < 0.3) {
            return Number((minBuyAmount + progress * 3 * (maxBuyAmount - minBuyAmount)).toFixed(4))
          } else if (progress < 0.7) {
            return Number(maxBuyAmount.toFixed(4))
          } else {
            return params.gradualDescent
              ? Number((maxBuyAmount - (progress - 0.7) * 3 * (maxBuyAmount - minBuyAmount)).toFixed(4))
              : Number(minBuyAmount.toFixed(4))
          }
        case "Micro":
          // Micro uses very small transactions
          return Number((params.transactionSize * (1 + (Math.random() * params.randomization) / 100)).toFixed(4))
        default:
          return Number((minBuyAmount + Math.random() * (maxBuyAmount - minBuyAmount)).toFixed(4))
      }
    }

    const timer = setInterval(() => {
      if (transactions >= totalTx) {
        clearInterval(timer)
        onLog(`${strategy} strategy completed successfully`)
        onComplete()
        return
      }

      transactions++

      // Create a new wallet for Turbo, Micro, and Bump modes
      if (shouldCreateNewWallets) {
        const newWalletId = Date.now() // Use timestamp for unique ID
        const newWallet = {
          id: newWalletId,
          address: `Wallet${newWalletId}_${Math.random().toString(36).substring(2, 10)}`,
          balance: Number.parseFloat((Math.random() * 0.5 + 0.1).toFixed(4)),
          transactions: 0,
          isActive: true,
        }

        // Prepend the new wallet to the wallets array
        setWallets((prev) => [newWallet, ...prev])

        // Use the new wallet for this transaction
        const amount = getNextAmount()

        // Update wallet stats
        updateWalletStats(newWalletId, amount)

        // Update total volume
        setTotalVolume((prev) => Number((prev + amount).toFixed(2)))

        // Log the transaction
        const txType = Math.random() > 0.5 ? "Buy" : "Sell"
        onLog(`${strategy}: ${txType} ${amount} SOL using new wallet ${newWallet.address.substring(0, 10)}...`)
      } else {
        // Use existing wallets for other modes
        const walletIndex = Math.floor(Math.random() * wallets.length)
        const wallet = wallets[walletIndex]
        const amount = getNextAmount()

        // Update wallet stats
        updateWalletStats(wallet.id, amount)

        // Update total volume
        setTotalVolume((prev) => Number((prev + amount).toFixed(2)))

        // Log the transaction
        const txType = Math.random() > 0.5 ? "Buy" : "Sell"
        onLog(`${strategy}: ${txType} ${amount} SOL using wallet ${wallet.address.substring(0, 10)}...`)
      }

      // Update success rate occasionally
      if (transactions % 5 === 0) {
        setSuccessRate((prev) => {
          const change = (Math.random() * 2 - 1) * 2 // -2 to +2 percent change
          return Math.min(100, Math.max(80, Number((prev + change).toFixed(1))))
        })
      }

      // Update average price occasionally
      if (transactions % 3 === 0) {
        setAvgPrice((prev) => {
          const change = Math.random() * 0.2 - 0.1 // -0.1 to +0.1 change
          return Number((prev + change).toFixed(4))
        })
      }
    }, interval)

    // Return a function to stop the simulation
    return () => clearInterval(timer)
  }

  // Add export function for wallets
  const exportWallets = () => {
    if (wallets.length === 0) {
      addLog("No wallets to export")
      return
    }

    // Create CSV content
    const csvContent = [
      // Header row
      ["Wallet ID", "Address", "Balance", "Transactions"].join(","),
      // Data rows
      ...wallets.map((wallet) => [wallet.id, wallet.address, wallet.balance, wallet.transactions].join(",")),
    ].join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `volume-bot-wallets-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    addLog(`Exported ${wallets.length} wallets to CSV`)
  }

  // Update the toggleVolumeGeneration function to use the simulation
  const toggleVolumeGeneration = async () => {
    if (isGenerating) {
      // Stop generation
      setIsGenerating(false)
      addLog(`Stopped ${volumeMode} volume generation`)
      // Reset wallet active states
      setWallets(wallets.map((wallet) => ({ ...wallet, isActive: false })))
    } else {
      // Start generation
      if (!tokenAddress) {
        addLog("Error: Token address is required. Please enter a token address.")
        setShowTokenDialog(true)
        return
      }

      if (wallets.length === 0) {
        await generateWallets()
      }

      if (wallets.length === 0) {
        addLog("Error: No wallets available. Please generate wallets first.")
        return
      }

      try {
        setIsGenerating(true)
        addLog(`Starting ${volumeMode} volume generation with ${wallets.length} wallets`)

        // Set all wallets to active
        setWallets(wallets.map((wallet) => ({ ...wallet, isActive: true })))

        // Simulate some initial stats
        setTotalVolume(Number.parseFloat((Math.random() * 10).toFixed(2)))
        setSuccessRate(Number.parseFloat((85 + Math.random() * 15).toFixed(1)))
        setAvgPrice(Number.parseFloat((0.5 + Math.random() * 2).toFixed(4)))

        // Execute the appropriate strategy based on the selected mode
        const strategyParams: any = {
          totalTransactions: tradesPerInterval * 10, // Reduced for demo
          interval: 1000 / tradesPerInterval,
          duration: duration,
          enableHolders: enableHolders,
        }

        // Simulate the strategy execution
        simulateStrategyProgress(
          volumeMode,
          strategyParams,
          wallets,
          (log: string) => addLog(log),
          () => {
            setIsGenerating(false)
            setWallets(wallets.map((wallet) => ({ ...wallet, isActive: false })))
            addLog(`${volumeMode} strategy execution completed`)
          },
        )
      } catch (error) {
        addLog(`Error starting strategy: ${error}`)
        setIsGenerating(false)
        setWallets(wallets.map((wallet) => ({ ...wallet, isActive: false })))
      }
    }
  }

  // Add log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 99)])
  }

  // Handle select all wallets
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(wallets.map((w) => w.id))
      setSelectedWallets(allIds)
    } else {
      setSelectedWallets(new Set())
    }
  }

  // Handle wallet selection
  const handleWalletSelect = (id: number, checked: boolean) => {
    setSelectedWallets((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  // Get mode icon
  const getModeIcon = (mode: VolumeMode) => {
    switch (mode) {
      case "Turbo":
        return <Zap className="h-3.5 w-3.5" />
      case "Pulse":
        return <BarChart3 className="h-3.5 w-3.5" />
      case "Painter":
        return <PaintBucket className="h-3.5 w-3.5" />
      case "Bump":
        return <TrendingUp className="h-3.5 w-3.5" />
      case "Micro":
        return <Minimize2 className="h-3.5 w-3.5" />
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Card className="bg-[#0a0a0a]">
        <CardContent className="flex items-center justify-between p-2">
          <div>
            <h1 className="text-sm font-bold text-[#f4f4f5]">Volume Generator Bot</h1>
            <p className="text-[10px] text-[#f4f4f599]">{wallets.length} wallets configured</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-[#f4f4f5]">Total Volume</p>
              <p className="text-sm font-bold text-[#f4f4f5]">{totalVolume.toFixed(2)} SOL</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#f4f4f5]">Success Rate</p>
              <p className="text-sm font-bold text-[#f4f4f5]">{successRate}%</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#f4f4f5]">Avg Price</p>
              <p className="text-sm font-bold text-[#f4f4f5]">{avgPrice} SOL</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        {/* Left column - Volume Mode */}
        <Card className="bg-[#0a0a0a] col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-[#f4f4f5]">Volume Mode</CardTitle>
              <div className="flex items-center gap-2">
                <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="h-6 text-[10px] app-button-primary"
                      onClick={() => setShowTokenDialog(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Token
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] app-dialog">
                    <DialogHeader>
                      <DialogTitle className="text-[#f4f4f5]">Add Token</DialogTitle>
                      <DialogDescription className="text-[10px] text-[#f4f4f599]">
                        Enter the token information to generate volume for.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="tokenAddress" className="text-[10px] text-[#f4f4f5]">
                          Token Address*
                        </Label>
                        <Input
                          id="tokenAddress"
                          value={tokenAddress}
                          onChange={(e) => setTokenAddress(e.target.value)}
                          placeholder="Enter token address"
                          className="h-8 app-input text-[10px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="tokenName" className="text-[10px] text-[#f4f4f5]">
                            Token Name
                          </Label>
                          <Input
                            id="tokenName"
                            value={tokenName}
                            onChange={(e) => setTokenName(e.target.value)}
                            placeholder="Optional"
                            className="h-8 app-input text-[10px]"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="tokenSymbol" className="text-[10px] text-[#f4f4f5]">
                            Token Symbol
                          </Label>
                          <Input
                            id="tokenSymbol"
                            value={tokenSymbol}
                            onChange={(e) => setTokenSymbol(e.target.value)}
                            placeholder="Optional"
                            className="h-8 app-input text-[10px]"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="enableHoldersDialog"
                          checked={enableHolders}
                          onCheckedChange={(checked) => setEnableHolders(checked === true)}
                          className="h-4 w-4 border-[#8b5cf6]"
                        />
                        <Label htmlFor="enableHoldersDialog" className="text-[10px] text-[#f4f4f5]">
                          Enable Holders
                        </Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddToken} disabled={!tokenAddress} className="app-button-primary">
                        Add Token
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px] text-[#f4f4f5]">Min Buy (SOL)</Label>
                  <Input
                    type="number"
                    value={minBuyAmount}
                    onChange={(e) => setMinBuyAmount(Number(e.target.value))}
                    min={0.001}
                    max={1}
                    step={0.001}
                    className="h-6 app-input text-[10px]"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-[#f4f4f5]">Max Buy (SOL)</Label>
                  <Input
                    type="number"
                    value={maxBuyAmount}
                    onChange={(e) => setMaxBuyAmount(Number(e.target.value))}
                    min={0.001}
                    max={5}
                    step={0.001}
                    className="h-6 app-input text-[10px]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[10px] text-[#f4f4f5]">Wallet Count</Label>
                <Input
                  type="number"
                  value={walletCount}
                  onChange={(e) => setWalletCount(Number(e.target.value))}
                  min={1}
                  max={50}
                  className="h-6 app-input text-[10px]"
                />
              </div>

              <div>
                <Label className="text-[10px] text-[#f4f4f5]">Volume Strategy</Label>
                <Select value={volumeMode} onValueChange={handleModeChange}>
                  <SelectTrigger className="h-6 app-input text-[10px]">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent className="app-dialog">
                    <SelectItem value="Turbo">
                      <div className="flex items-center">
                        <Zap className="h-3 w-3 mr-1" /> Turbo
                      </div>
                    </SelectItem>
                    <SelectItem value="Pulse">
                      <div className="flex items-center">
                        <BarChart3 className="h-3 w-3 mr-1" /> Pulse
                      </div>
                    </SelectItem>
                    <SelectItem value="Painter">
                      <div className="flex items-center">
                        <PaintBucket className="h-3 w-3 mr-1" /> Painter
                      </div>
                    </SelectItem>
                    <SelectItem value="Bump">
                      <div className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" /> Bump
                      </div>
                    </SelectItem>
                    <SelectItem value="Micro">
                      <div className="flex items-center">
                        <Minimize2 className="h-3 w-3 mr-1" /> Micro
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-2 p-2 border border-[#333867] rounded-md bg-[#17193B20]">
                <div className="space-y-3">
                  <div>
                    <Label className="text-[10px] text-[#f4f4f5]">Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      min={1}
                      max={120}
                      className="h-6 app-input text-[10px]"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-[#f4f4f5]">No Of Trades per Interval</Label>
                    <Input
                      type="number"
                      value={tradesPerInterval}
                      onChange={(e) => setTradesPerInterval(Number(e.target.value))}
                      min={1}
                      max={50}
                      className="h-6 app-input text-[10px]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="enableHolders"
                      checked={enableHolders}
                      onCheckedChange={(checked) => setEnableHolders(checked === true)}
                      className="h-4 w-4 border-[#8b5cf6]"
                    />
                    <Label htmlFor="enableHolders" className="text-[10px] text-[#f4f4f5]">
                      Enable Holders
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span className="text-[10px] text-[#f4f4f5]">Selected Strategy: {volumeMode}</span>
                  </div>
                </div>
              </div>

              {tokenAddress && (
                <div className="mt-2 p-2 bg-[#333867] rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-medium text-[#f4f4f5]">Current Token</p>
                      <p className="text-[9px] text-[#f4f4f599] truncate max-w-[180px]">
                        {tokenName || tokenSymbol ? `${tokenName} (${tokenSymbol})` : tokenAddress}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-[#f4f4f5]"
                      onClick={() => setShowTokenDialog(true)}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Buttons moved to bottom of card */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Button
                  className="h-6 text-[10px] app-button-primary"
                  onClick={generateWallets}
                  disabled={isGenerating || !tokenAddress}
                >
                  Generate Wallets
                </Button>
                <Button
                  className="h-6 text-[10px] app-button-primary"
                  onClick={toggleVolumeGeneration}
                  disabled={(wallets.length === 0 && !isGenerating) || !tokenAddress}
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <Pause className="h-3 w-3" />
                      Stop
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Play className="h-3 w-3" />
                      Start
                    </div>
                  )}
                </Button>
                <Button
                  className="h-6 text-[10px] app-button-primary"
                  onClick={handleAirdrop}
                  disabled={isGenerating || isAirdropping || wallets.length === 0 || !tokenAddress}
                >
                  <div className="flex items-center gap-2">
                    <Send className="h-3 w-3" />
                    Airdrop
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right columns - Activity Log and Wallets */}
        <div className="flex flex-col gap-2">
          <Card className="bg-[#0a0a0a]">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm text-[#f4f4f5]">Estimates & Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] text-[#f4f4f599]">Est. Total Transactions</p>
                    <p className="text-sm font-bold text-[#f4f4f5]">{tradesPerInterval * duration}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#f4f4f599]">Est. Volume Range</p>
                    <p className="text-sm font-bold text-[#f4f4f5]">
                      {(minBuyAmount * tradesPerInterval * duration).toFixed(2)} -{" "}
                      {(maxBuyAmount * tradesPerInterval * duration).toFixed(2)} SOL
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] text-[#f4f4f599]">Strategy</p>
                    <div className="flex items-center">
                      {getModeIcon(volumeMode)}
                      <p className="text-sm font-bold text-[#f4f4f5] ml-1">{volumeMode}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#f4f4f599]">Wallets</p>
                    <p className="text-sm font-bold text-[#f4f4f5]">{wallets.length}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#333867]">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-[#f4f4f599]">Est. Completion Time</p>
                  <p className="text-sm font-bold text-[#f4f4f5]">
                    {new Date(Date.now() + duration * 60 * 1000).toLocaleTimeString()}
                  </p>
                </div>
                <div className="mt-2 h-1.5 w-full bg-[#333867] rounded-full overflow-hidden">
                  {isGenerating && (
                    <div
                      className="h-full bg-[#2879fe] animate-pulse"
                      style={{
                        width: `${Math.min(100, (totalVolume / (maxBuyAmount * tradesPerInterval * duration)) * 100)}%`,
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0a0a]">
            <CardContent className="p-2 h-[400px] overflow-auto">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-[10px] text-[#f4f4f5]">Activity Log</Label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-5 w-5 p-0 border-[#333867] text-[#f4f4f5]"
                  onClick={() => setLogs([])}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                {logs.length === 0 ? (
                  <p className="text-[10px] text-[#f4f4f599] italic">No activity yet</p>
                ) : (
                  logs.map((log, index) => (
                    <div
                      key={index}
                      className="text-[9px] text-[#f4f4f5] border-b border-[#333867] border-opacity-20 pb-1"
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
