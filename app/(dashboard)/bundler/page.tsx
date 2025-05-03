"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { TopNavigation } from "../trading/_components/TopNavigation"
import { LeftSidebar } from "./components/LeftSidebar"
import { RightSidebar } from "./components/RightSidebar"
import { MainContent } from "./components/MainContent"
import { Dialogs } from "../trading/_components/Dialogs"
import { TradeTicker } from "./components/TradeTicker"
import { GeneralSettingsDialog } from "../trading/_components/Dialogs/GeneralSettingsDialog"
import { RiskManagementDialog } from "../trading/_components/Dialogs/RiskManagementDialog"
import { TokenMetaWizardModal } from "./components/TokenMetaWizardModal"
import type { BundlerConfig, BundlerStats, BundlerTransaction, ActivityLog, Wallet, BundlerMode } from "./types"

export default function BundlerPage() {
  // State for UI controls
  const [activeTab, setActiveTab] = useState("Wallets")
  const [activeRightTab, setActiveRightTab] = useState("Stats")
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const dialogRef = useRef<HTMLDivElement>(null)
  const [activeSettingsDialog, setActiveSettingsDialog] = useState<string | null>(null)
  const [showLeftSidebar, setShowLeftSidebar] = useState(false)
  const [showRightSidebar, setShowRightSidebar] = useState(false)

  // Token Metadata Wizard Modal state
  const [isTokenWizardOpen, setIsTokenWizardOpen] = useState(false)

  // Define bundler modes
  const [bundlerModes] = useState<BundlerMode[]>([
    {
      id: "BLOCK0",
      name: "Block0",
      description: "Execute transactions at the beginning of a new block",
      color: "#4caf50",
    },
    {
      id: "DELAYED",
      name: "Delayed",
      description: "Execute transactions with a specified delay",
      color: "#2196f3",
    },
    {
      id: "STAGGERED",
      name: "Staggered",
      description: "Execute transactions in a staggered pattern",
      color: "#ff9800",
    },
    {
      id: "SNIPER_KILLER",
      name: "Sniper Killer",
      description: "Prevent front-running by snipers",
      color: "#f44336",
    },
    {
      id: "QUICK_PROFITS",
      name: "Quick Profits",
      description: "Optimize for quick profit taking",
      color: "#9c27b0",
    },
  ])

  // Bundler state
  const [bundlerRunning, setBundlerRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [bundlerConfig, setBundlerConfig] = useState<BundlerConfig>({
    rpcUrl: "https://api.mainnet-beta.solana.com",
    maxTransactionsPerBundle: 5,
    priorityFee: 0.00001,
    bundleInterval: 30,
    autoBundle: true,
    gasLimit: 500000,
    bundlerMode: "BLOCK0", // Default mode
  })

  // Stats and transactions
  const [bundlerStats, setBundlerStats] = useState<BundlerStats>({
    totalBundles: 0,
    totalTransactions: 0,
    averageGasUsed: 0,
    totalFeeSaved: 0,
    successRate: 100,
    lastBundleTime: null,
  })

  // Sample transactions
  const [transactions, setTransactions] = useState<BundlerTransaction[]>([
    {
      id: "tx-1",
      hash: "0x7f9a12e123b456c789d0e123f456a789b0c123d4",
      status: "completed",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      gasUsed: 125000,
      fee: 0.0025,
      bundleId: "bundle-1",
    },
    {
      id: "tx-2",
      hash: "0x8e2b34f567a891c234d5e678f901a234b5c678d9",
      status: "pending",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      gasUsed: 95000,
      fee: 0.0018,
      bundleId: "bundle-2",
    },
  ])

  // Activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: "log-1",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      type: "info",
      message: "Bundler initialized and ready",
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      type: "info",
      message: "Connected to RPC endpoint",
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "success",
      message: "Bundle #1 successfully submitted with 3 transactions",
    },
  ])

  // Add wallet state and functions
  const [walletCount, setWalletCount] = useState(5)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Add the generateWallets function
  const generateWallets = () => {
    const newWallets = Array.from({ length: walletCount }, (_, i) => ({
      id: `wallet-${Date.now()}-${i}`,
      address: `${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      balance: 0,
      selected: false,
    }))
    setWallets([...wallets, ...newWallets])
    addLog({
      type: "success",
      message: `Generated ${walletCount} new wallets`,
    })
  }

  // Add the fundWallets function
  const fundWallets = () => {
    setWallets(wallets.map((wallet) => (wallet.selected ? { ...wallet, balance: wallet.balance + 1 } : wallet)))
    const selectedCount = wallets.filter((w) => w.selected).length
    addLog({
      type: "success",
      message: `Funded ${selectedCount} wallets with 1 SOL each`,
    })
  }

  // Add the fundWallet function for individual funding
  const fundWallet = (id: string) => {
    setWallets(wallets.map((wallet) => (wallet.id === id ? { ...wallet, balance: wallet.balance + 1 } : wallet)))
    addLog({
      type: "success",
      message: `Funded wallet ${id.substring(0, 10)}... with 1 SOL`,
    })
  }

  // Add the burnWallets function
  const burnWallets = () => {
    const selectedCount = wallets.filter((w) => w.selected).length
    setWallets(wallets.filter((wallet) => !wallet.selected))
    setSelectAll(false)
    addLog({
      type: "warning",
      message: `Removed ${selectedCount} wallets`,
    })
  }

  // Add the toggleSelectAll function
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setWallets(wallets.map((wallet) => ({ ...wallet, selected: newSelectAll })))
  }

  // Add the toggleWalletSelection function
  const toggleWalletSelection = (id: string) => {
    const updatedWallets = wallets.map((wallet) =>
      wallet.id === id ? { ...wallet, selected: !wallet.selected } : wallet,
    )
    setWallets(updatedWallets)
    setSelectAll(updatedWallets.every((wallet) => wallet.selected) && updatedWallets.length > 0)
  }

  // Add function to cycle through bundler modes
  const cycleBundlerMode = (direction: "next" | "prev") => {
    const currentIndex = bundlerModes.findIndex((mode) => mode.id === bundlerConfig.bundlerMode)
    let newIndex

    if (direction === "next") {
      newIndex = (currentIndex + 1) % bundlerModes.length
    } else {
      newIndex = (currentIndex - 1 + bundlerModes.length) % bundlerModes.length
    }

    const newMode = bundlerModes[newIndex]

    // Update the bundler config with the new mode
    setBundlerConfig({
      ...bundlerConfig,
      bundlerMode: newMode.id,
    })

    addLog({
      type: "info",
      message: `Bundler mode changed to ${newMode.name}`,
    })
  }

  // Function to toggle the token wizard modal
  const toggleTokenWizard = () => {
    setIsTokenWizardOpen(!isTokenWizardOpen)
  }

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Simulate bundler activity when running
  useEffect(() => {
    if (!bundlerRunning) return

    const interval = setInterval(() => {
      // Simulate new transaction
      if (Math.random() > 0.7) {
        const newTx: BundlerTransaction = {
          id: `tx-${Date.now()}`,
          hash: `0x${Math.random().toString(16).substring(2, 42)}`,
          status: Math.random() > 0.9 ? "failed" : Math.random() > 0.3 ? "completed" : "pending",
          timestamp: new Date(),
          gasUsed: Math.floor(Math.random() * 200000) + 50000,
          fee: Number((Math.random() * 0.005 + 0.001).toFixed(6)),
          bundleId: `bundle-${Math.floor(bundlerStats.totalBundles / 5) + 1}`,
        }

        setTransactions((prev) => [newTx, ...prev].slice(0, 50))

        addLog({
          type: newTx.status === "failed" ? "error" : newTx.status === "completed" ? "success" : "info",
          message: `Transaction ${newTx.hash.substring(0, 10)}... ${newTx.status === "pending" ? "queued for bundling" : newTx.status === "completed" ? "successfully bundled" : "failed to bundle"}`,
        })
      }

      // Simulate bundle creation
      if (Math.random() > 0.9) {
        const bundleSize = Math.floor(Math.random() * 4) + 2
        const bundleId = bundlerStats.totalBundles + 1

        setBundlerStats((prev) => ({
          ...prev,
          totalBundles: prev.totalBundles + 1,
          totalTransactions: prev.totalTransactions + bundleSize,
          averageGasUsed: Math.floor(
            (prev.averageGasUsed * prev.totalTransactions + bundleSize * 120000) /
              (prev.totalTransactions + bundleSize),
          ),
          totalFeeSaved: prev.totalFeeSaved + bundleSize * 0.001,
          successRate: Math.max(80, Math.min(100, prev.successRate + (Math.random() > 0.8 ? -1 : 0.5))),
          lastBundleTime: new Date(),
        }))

        addLog({
          type: "success",
          message: `Bundle #${bundleId} created with ${bundleSize} transactions using ${bundlerConfig.bundlerMode} mode`,
        })
      }

      // Add random log entries occasionally
      if (Math.random() > 0.8) {
        const logMessages = [
          "Monitoring mempool for transactions...",
          "Optimizing bundle parameters...",
          "Checking gas prices...",
          "Validating transaction signatures...",
          "Calculating optimal bundle size...",
        ]

        addLog({
          type: "info",
          message: logMessages[Math.floor(Math.random() * logMessages.length)],
        })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [bundlerRunning, bundlerStats, bundlerConfig.bundlerMode])

  const addLog = ({ type, message }: { type: ActivityLog["type"]; message: string }) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      type,
      message,
    }
    setActivityLogs((prev) => [...prev, newLog])
  }

  const clearLogs = () => {
    setActivityLogs([])
  }

  const handleMenuClick = (menu: string, e: React.MouseEvent) => {
    e.preventDefault()
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    })
    setActiveMenu(activeMenu === menu ? null : menu)
  }

  const handleSettingsDialogOpen = (dialogName: string) => {
    setActiveSettingsDialog(dialogName)
    setActiveMenu(null)
  }

  const handleSettingsDialogClose = () => {
    setActiveSettingsDialog(null)
  }

  const handleBundlerConfigChange = (field: keyof BundlerConfig, value: string | number) => {
    setBundlerConfig({
      ...bundlerConfig,
      [field]: value,
    })
  }

  const toggleBundlerRunning = () => {
    if (bundlerRunning) {
      // Stopping the bundler
      setBundlerRunning(false)
      addLog({
        type: "warning",
        message: "Bundler stopped. No longer monitoring for transactions.",
      })
    } else {
      // Starting the bundler
      setIsLoading(true)
      addLog({
        type: "info",
        message: `Starting bundler in ${bundlerModes.find((m) => m.id === bundlerConfig.bundlerMode)?.name} mode and connecting to RPC...`,
      })

      // Simulate connection delay
      setTimeout(() => {
        setBundlerRunning(true)
        setIsLoading(false)
        addLog({
          type: "success",
          message: `Bundler started successfully in ${bundlerModes.find((m) => m.id === bundlerConfig.bundlerMode)?.name} mode. Monitoring for transactions...`,
        })
      }, 2000)
    }
  }

  return (
    <div className="flex flex-col h-screen text-white font-poppins">
      {/* Top navigation bar */}
      <TopNavigation activeMenu={activeMenu} handleMenuClick={handleMenuClick} />

      {/* Menu Dialogs */}
      <Dialogs
        activeMenu={activeMenu}
        menuPosition={menuPosition}
        dialogRef={dialogRef}
        onClose={() => setActiveMenu(null)}
        onOpenSettings={handleSettingsDialogOpen}
      />

      {/* Settings Dialogs - rendered at the root level */}
      {activeSettingsDialog === "generalSettings" && <GeneralSettingsDialog onClose={handleSettingsDialogClose} />}
      {activeSettingsDialog === "riskManagement" && <RiskManagementDialog onClose={handleSettingsDialogClose} />}

      {/* Token Metadata Wizard Modal */}
      <TokenMetaWizardModal isOpen={isTokenWizardOpen} onClose={() => setIsTokenWizardOpen(false)} />

      {/* Mobile sidebar toggle buttons - only visible on small screens */}
      <div className="md:hidden flex justify-between px-2 py-1 border-b border-[#222]">
        <button className="px-3 py-1 bg-[#222] rounded text-xs" onClick={() => setShowLeftSidebar(!showLeftSidebar)}>
          {showLeftSidebar ? "Hide" : "Show"} Controls
        </button>
        <button className="px-3 py-1 bg-[#222] rounded text-xs" onClick={() => setShowRightSidebar(!showRightSidebar)}>
          {showRightSidebar ? "Hide" : "Show"} Data
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative" style={{ height: "calc(100vh - 80px)" }}>
        {/* Left sidebar - responsive */}
        <div
          className={`${
            showLeftSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } absolute md:relative z-10 md:z-0 h-full transition-transform duration-300 ease-in-out
          w-full md:w-[300px] lg:w-[300px] border-r border-[#222]`}
        >
          <LeftSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            bundlerConfig={bundlerConfig}
            bundlerRunning={bundlerRunning}
            isLoading={isLoading}
            wallets={wallets}
            walletCount={walletCount}
            selectAll={selectAll}
            bundlerModes={bundlerModes}
            setWalletCount={setWalletCount}
            generateWallets={generateWallets}
            fundWallets={fundWallets}
            burnWallets={burnWallets}
            toggleSelectAll={toggleSelectAll}
            toggleWalletSelection={toggleWalletSelection}
            fundWallet={fundWallet}
            handleBundlerConfigChange={handleBundlerConfigChange}
            toggleBundlerRunning={toggleBundlerRunning}
            cycleBundlerMode={cycleBundlerMode}
            openTokenWizard={toggleTokenWizard}
          />
        </div>

        {/* Main content area - responsive */}
        <div className="flex-1 overflow-hidden">
          <MainContent
            bundlerStats={bundlerStats}
            bundlerRunning={bundlerRunning}
            transactions={transactions}
            bundlerMode={bundlerModes.find((m) => m.id === bundlerConfig.bundlerMode)?.name || "Block0"}
          />
        </div>

        {/* Right sidebar - responsive */}
        <div
          className={`${
            showRightSidebar ? "translate-x-0" : "translate-x-full md:translate-x-0"
          } absolute md:relative right-0 z-10 md:z-0 h-full transition-transform duration-300 ease-in-out
          w-full md:w-[300px] lg:w-[300px] border-l border-[#222]`}
        >
          <RightSidebar
            activeTab={activeRightTab}
            setActiveTab={setActiveRightTab}
            bundlerStats={bundlerStats}
            transactions={transactions}
            activityLogs={activityLogs}
            bundlerRunning={bundlerRunning}
            clearLogs={clearLogs}
          />
        </div>
      </div>

      {/* Transaction Ticker */}
      <TradeTicker transactions={transactions} bundlerRunning={bundlerRunning} />
    </div>
  )
}
