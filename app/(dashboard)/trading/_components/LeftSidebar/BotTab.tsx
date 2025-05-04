"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Square, Loader2 } from "lucide-react"
import type { BotConfig, StrategyMode, Platform, PairData } from "../../types"
import { VolumeCalculationDialog } from "../Dialogs/VolumeCalculationDialog"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BotTabProps {
  botConfig: BotConfig
  botRunning: boolean
  isLoading: boolean
  strategyModes: StrategyMode[]
  platforms: Platform[]
  selectedPlatform: string
  handleBotConfigChange: (field: keyof BotConfig, value: string | number | object) => void
  toggleBotRunning: (
    platform: string,
    strategyMode: string,
    config: BotConfig,
    platformInfo: any,
    poolInfo: any,
  ) => void
  saveBotConfig: () => void
  cycleStrategyMode: (direction: "next" | "prev") => void
  cyclePlatform: (direction: "next" | "prev") => void
  currentPrice?: number
  walletCount?: number
  updateChartData?: (data: any[]) => void
}

interface PoolOwnerInfo {
  owner: string
  programName: string
}

export function BotTab({
  botConfig,
  botRunning,
  isLoading,
  strategyModes,
  platforms = [], // Provide default empty array
  selectedPlatform,
  handleBotConfigChange,
  toggleBotRunning,
  saveBotConfig,
  cycleStrategyMode,
  cyclePlatform,
  currentPrice = 0.0001, // Default price if not provided
  walletCount = 5, // Default wallet count if not provided
  updateChartData,
}: BotTabProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [showVolumeDialog, setShowVolumeDialog] = useState(false)
  const [fetchingData, setFetchingData] = useState(false)
  const [tokenPrice, setTokenPrice] = useState(currentPrice)
  const [tokenAddress, setTokenAddress] = useState(botConfig.tokenAddress)
  const [config, setConfig] = useState(botConfig)
  const [pairData, setPairData] = useState<PairData | null>(null)
  const [isLoadingState, setIsLoadingState] = useState(false)
  const [poolOwnerInfo, setPoolOwnerInfo] = useState<PoolOwnerInfo | null>(null)
  const [fetchingOwner, setFetchingOwner] = useState(false)

  // New state for the updated layout
  const [availablePairs, setAvailablePairs] = useState<PairData[]>([])
  const [selectedPairId, setSelectedPairId] = useState<string>("")
  const [pairsLoaded, setPairsLoaded] = useState(false)
  const [pairSelected, setPairSelected] = useState(false)

  // Add a new state variable for the selected platform type
  const [selectedPlatformType, setSelectedPlatformType] = useState<string>("raydium")

  // Known program IDs and their names
  const KNOWN_PROGRAMS: Record<string, string> = {
    "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Raydium AMM",
    JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4: "Jupiter",
    whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc: "Orca Whirlpools",
    "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP": "Orca",
    pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA: "PumpSwap",
    "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P": "PumpFun",
    Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB: "Meteora DYN",
    CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK: "Raydium CAMM",
    CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C: "Raydium CPMM",
    LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo: "Meteora DLMM",
  }

  // Update local config state when botConfig changes from parent
  useEffect(() => {
    setConfig(botConfig)
    setTokenAddress(botConfig.tokenAddress)
  }, [botConfig])

  // Find the currently selected strategy with null check
  const currentStrategy =
    strategyModes && strategyModes.length > 0
      ? strategyModes.find((mode) => mode.id === botConfig.strategyMode) || strategyModes[0]
      : null

  const handleTokenAddressChange = (value: string) => {
    // Clear any previous errors
    setTokenError(null)

    // Update the token address
    setTokenAddress(value)
    handleBotConfigChange("tokenAddress", value)

    // Reset pair selection when token address changes
    setPairsLoaded(false)
    setPairSelected(false)
    setSelectedPairId("")
    setAvailablePairs([])
    setPoolOwnerInfo(null)
  }

  const handleConfigChange = (field: keyof BotConfig, value: string | number | object) => {
    const updatedConfig = {
      ...config,
      [field]: value,
    }

    setConfig(updatedConfig)
    handleBotConfigChange(field, value)
  }

  // Function to fetch pool owner information
  const fetchPoolOwner = async (pairAddress: string) => {
    setFetchingOwner(true)
    try {
      // Use Solana RPC to get account info
      const response = await fetch("https://go.getblock.io/4136d34f90a6488b84214ae26f0ed5f4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getAccountInfo",
          params: [
            pairAddress,
            {
              encoding: "jsonParsed",
            },
          ],
        }),
      })

      const data = await response.json()

      if (data.result && data.result.value) {
        const owner = data.result.value.owner
        const programName = KNOWN_PROGRAMS[owner] || "Unknown Program"

        const poolInfo = {
          owner,
          programName,
        }

        setPoolOwnerInfo(poolInfo)

        // Update the config with pool information
        handleConfigChange("poolInfo", {
          poolAddress: pairAddress,
          programId: owner,
          programName: programName,
        })
      } else {
        const poolInfo = {
          owner: "Not available",
          programName: "Unknown",
        }

        setPoolOwnerInfo(poolInfo)

        // Update the config with limited pool information
        handleConfigChange("poolInfo", {
          poolAddress: pairAddress,
          programId: "Not available",
          programName: "Unknown",
        })
      }
    } catch (error) {
      console.error("Error fetching pool owner:", error)

      const poolInfo = {
        owner: "Error fetching",
        programName: "Unknown",
      }

      setPoolOwnerInfo(poolInfo)

      // Update the config with error state
      handleConfigChange("poolInfo", {
        poolAddress: pairAddress,
        programId: "Error fetching",
        programName: "Unknown",
      })
    } finally {
      setFetchingOwner(false)
    }
  }

  // New function to load pairs for a token
  const handleLoadPairs = async () => {
    if (!tokenAddress) {
      toast({
        title: "Error",
        description: "Please enter a token address",
        variant: "destructive",
      })
      return
    }

    setIsLoadingState(true)
    setTokenError(null)
    setPairsLoaded(false)
    setPairSelected(false)
    setSelectedPairId("")
    setPoolOwnerInfo(null)

    try {
      // Fetch token data from DEX Screener
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`)

      if (!response.ok) {
        throw new Error(`DEX Screener API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.pairs && data.pairs.length > 0) {
        setAvailablePairs(data.pairs)
        setPairsLoaded(true)

        toast({
          title: "Success",
          description: `Found ${data.pairs.length} pairs for this token`,
        })
      } else {
        setTokenError("No pairs found for this token address")
        setAvailablePairs([])
      }
    } catch (error) {
      console.error("Error fetching token pairs:", error)
      setTokenError("Error fetching token pairs. Please try again.")
      setAvailablePairs([])
    } finally {
      setIsLoadingState(false)
    }
  }

  // Handle pair selection
  const handlePairSelection = async (pairId: string) => {
    const selectedPair = availablePairs.find((pair) => pair.pairAddress === pairId)

    if (selectedPair) {
      setPairData(selectedPair)
      setSelectedPairId(pairId)
      setPairSelected(true)

      // Update token price
      const price = Number(selectedPair.priceNative) || 0.0001
      setTokenPrice(price)

      // Update token address in config
      handleBotConfigChange("tokenAddress", selectedPair.baseToken.address)

      // Update pair information in config
      handleBotConfigChange("pairInfo", {
        pairAddress: selectedPair.pairAddress,
        baseToken: selectedPair.baseToken,
        quoteToken: selectedPair.quoteToken,
        dexId: selectedPair.dexId,
      })

      toast({
        title: "Pair Selected",
        description: `Selected ${selectedPair.baseToken.symbol}/${selectedPair.quoteToken.symbol} on ${selectedPair.dexId}`,
      })

      // Fetch pool owner information
      await fetchPoolOwner(selectedPair.pairAddress)
    }
  }

  // Inside the BotTab component, add this code to handle the start button click:

  const handleStartClick = async () => {
    if (!tokenAddress) {
      toast({
        title: "Error",
        description: "Please enter a token address",
        variant: "destructive",
      })
      return
    }

    // Ensure numberOfBuys and numberOfSells are properly set
    const updatedConfig = {
      ...config,
      numberOfBuys: config.numberOfBuys || 1,
      numberOfSells: config.numberOfSells || 0,
    }

    // Update the config state
    setConfig(updatedConfig)

    // Show the volume calculation dialog
    setShowVolumeDialog(true)
  }

  // Update the handleConfirmStart function to include the selected platform type
  const handleConfirmStart = () => {
    // Close the dialog
    setShowVolumeDialog(false)

    // Create platform info
    const platformInfo = {
      id: selectedPlatform,
      name: platforms.find((p) => p.id === selectedPlatform)?.name || selectedPlatform,
      platformType: selectedPlatformType,
    }

    // Create simplified pool info
    const poolInfo = {
      tokenAddress: tokenAddress,
    }

    // Ensure token address is included in the config
    const finalConfig = {
      ...config,
      tokenAddress: tokenAddress,
      platformType: selectedPlatformType,
    }

    // Start the bot with the updated config
    toggleBotRunning(selectedPlatform, finalConfig.strategyMode, finalConfig, platformInfo, poolInfo)
  }

  // Function to truncate addresses for display
  const truncateAddress = (address: string) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="p-3 relative">
      {/* Bot Running Notification - Now a banner instead of a full overlay */}
      {botRunning && (
        <div className="bg-gradient-to-r from-amber-900/80 to-amber-800/80 border border-amber-700/50 rounded-md p-2 mb-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            <h3 className="font-medium text-xs text-amber-300">Bot Running</h3>
          </div>
          <p className="text-2xs text-amber-200/80 mt-1">Some settings are disabled while the bot is running.</p>
        </div>
      )}

      {/* Token Address Input with Load Button */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="tokenAddress" className="text-xs text-gray-400">
            Token Address
          </label>
          {tokenError && <p className="text-xs text-red-500">{tokenError}</p>}
        </div>
        <div className="flex gap-1">
          <Input
            id="tokenAddress"
            type="text"
            className={`flex-1 compact-input ${tokenError ? "border-red-500" : ""}`}
            placeholder="Enter token address"
            value={tokenAddress}
            onChange={(e) => handleTokenAddressChange(e.target.value)}
            disabled={botRunning}
          />
        </div>
      </div>

      {/* Add the platform selection dropdown here: */}
      <div className="mb-3">
        <label htmlFor="platformType" className="block text-xs text-gray-400 mb-2">
          Platform
        </label>
        <Select value={selectedPlatformType} onValueChange={setSelectedPlatformType} disabled={botRunning}>
          <SelectTrigger id="platformType" className="compact-input bg-gray-900/70 border-gray-700/50">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700 text-xs">
            <SelectItem value="raydium" className="text-white text-xs">
              Raydium AMM
            </SelectItem>
            <SelectItem value="pumpfun" className="text-white text-xs">
              PumpFun
            </SelectItem>
            <SelectItem value="pumpswap" className="text-white text-xs">
              PumpSwap
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pair Selection Dropdown - Only show if pairs are loaded */}
      {/* Only show the rest of the UI if a pair is selected */}
      {/* Strategy Selection Widget with null check */}
      {strategyModes && strategyModes.length > 0 && (
        <Card className="card-gradient mb-3">
          <div className="p-3">
            <div className="text-xs text-gray-400 mb-1">Volume Strategy</div>
            <div className="flex items-center justify-between bg-gray-900/50 rounded-md p-2">
              <button
                className="p-1 hover:bg-gray-800 rounded-md disabled:opacity-50"
                onClick={() => cycleStrategyMode("prev")}
                disabled={botRunning}
              >
                <ChevronLeft size={14} />
              </button>

              <div className="flex-1 text-center">
                <div className="text-xs font-medium" style={{ color: currentStrategy?.color || "#888" }}>
                  {currentStrategy?.name || "Unknown Strategy"}
                </div>
                <div className="text-2xs text-gray-400">
                  {currentStrategy?.description || "No description available"}
                </div>
              </div>

              <button
                className="p-1 hover:bg-gray-800 rounded-md disabled:opacity-50"
                onClick={() => cycleStrategyMode("next")}
                disabled={botRunning}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </Card>
      )}

      <div className="mb-3">
        <Button
          className={`w-full py-1.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors text-xs ${
            botRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          } relative z-20`} // Added z-20 to ensure it's above any overlays
          onClick={
            botRunning ? () => toggleBotRunning(selectedPlatform, config.strategyMode, config) : handleStartClick
          }
          disabled={isLoading || fetchingData || isLoadingState}
        >
          {isLoading || fetchingData || isLoadingState ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>{fetchingData ? "Fetching Token Data..." : "Loading..."}</span>
            </>
          ) : botRunning ? (
            <>
              <Square size={14} />
              <span>Stop Bot</span>
            </>
          ) : (
            <>
              <Play size={14} />
              <span>Start Bot</span>
            </>
          )}
        </Button>
      </div>

      <div className="mb-3">
        <button className="text-xs text-blue-400 hover:underline" onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
        </button>
      </div>

      {showAdvanced && (
        <Card className="card-gradient">
          <div className="p-3 space-y-3">
            <div>
              <label htmlFor="minTradeAmount" className="block text-xs text-gray-400 mb-1">
                Min Trade Amount (SOL)
              </label>
              <Input
                id="minTradeAmount"
                type="number"
                step="0.0001"
                min="0.0001"
                className="compact-input"
                value={config.minTradeAmount}
                onChange={(e) => handleConfigChange("minTradeAmount", Number.parseFloat(e.target.value))}
                disabled={botRunning || currentStrategy?.config.minTradeAmount.editable === false}
              />
            </div>

            <div>
              <label htmlFor="maxTradeAmount" className="block text-xs text-gray-400 mb-1">
                Max Trade Amount (SOL)
              </label>
              <Input
                id="maxTradeAmount"
                type="number"
                step="0.0001"
                min="0.0001"
                className="compact-input"
                value={config.maxTradeAmount}
                onChange={(e) => handleConfigChange("maxTradeAmount", Number.parseFloat(e.target.value))}
                disabled={botRunning || currentStrategy?.config.maxTradeAmount.editable === false}
              />
            </div>

            <div>
              <label htmlFor="tradesPerInterval" className="block text-xs text-gray-400 mb-1">
                Trades Per Minute
              </label>
              <Input
                id="tradesPerInterval"
                type="number"
                step="1"
                min="1"
                className="compact-input"
                value={config.tradesPerInterval}
                onChange={(e) => handleConfigChange("tradesPerInterval", Number.parseInt(e.target.value))}
                disabled={botRunning || currentStrategy?.config.tradesPerInterval.editable === false}
              />
            </div>

            <div>
              <label htmlFor="intervalMinutes" className="block text-xs text-gray-400 mb-1">
                Duration (Hrs)
              </label>
              <Input
                id="intervalMinutes"
                type="number"
                step="0.1"
                min="0.1"
                className="compact-input"
                value={config.intervalMinutes}
                onChange={(e) => handleConfigChange("intervalMinutes", Number.parseFloat(e.target.value))}
                disabled={botRunning || currentStrategy?.config.intervalMinutes.editable === false}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="numberOfBuys" className="text-xs text-gray-400">
                  Number of Buys
                </Label>
                <Input
                  id="numberOfBuys"
                  type="number"
                  min="0"
                  value={config.numberOfBuys}
                  onChange={(e) => handleConfigChange("numberOfBuys", Number.parseInt(e.target.value))}
                  className="compact-input mt-1"
                />
                <p className="text-2xs text-gray-500 mt-1">Number of buy transactions</p>
              </div>
              <div>
                <Label htmlFor="numberOfSells" className="text-xs text-gray-400">
                  Number of Sells
                </Label>
                <Input
                  id="numberOfSells"
                  type="number"
                  min="0"
                  value={config.numberOfSells}
                  onChange={(e) => handleConfigChange("numberOfSells", Number.parseInt(e.target.value))}
                  className="compact-input mt-1"
                />
                <p className="text-2xs text-gray-500 mt-1">Number of sell transactions</p>
              </div>
            </div>

            <div>
              <Button className="w-full py-1.5 px-4 compact-button" onClick={saveBotConfig} disabled={botRunning}>
                Save Settings
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Volume Calculation Dialog */}
      <VolumeCalculationDialog
        isOpen={showVolumeDialog}
        onClose={() => setShowVolumeDialog(false)}
        onConfirm={handleConfirmStart}
        botConfig={config}
        currentPrice={tokenPrice}
        walletCount={walletCount}
      />
    </div>
  )
}
