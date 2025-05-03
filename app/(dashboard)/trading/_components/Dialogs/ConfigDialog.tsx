"use client"
import { useState, useEffect } from "react"
import { Settings, DollarSign, Key, Save, Eye, EyeOff } from "lucide-react"
import { MenuItem } from "../shared/MenuItem"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ConfigDialogProps {
  onClose: () => void
  onOpenSettings: (dialogName: string) => void
}

export function ConfigDialog({ onClose, onOpenSettings }: ConfigDialogProps) {
  const [mainWalletKey, setMainWalletKey] = useState("")
  const [fundingWalletKey, setFundingWalletKey] = useState("")
  const [showMainKey, setShowMainKey] = useState(false)
  const [showFundingKey, setShowFundingKey] = useState(false)

  // Load saved keys on mount
  useEffect(() => {
    const savedMainKey = localStorage.getItem("mainWalletPrivateKey")
    const savedFundingKey = localStorage.getItem("fundingWalletPrivateKey")

    if (savedMainKey) setMainWalletKey(savedMainKey)
    if (savedFundingKey) setFundingWalletKey(savedFundingKey)
  }, [])

  const handleMenuClick = (dialogName: string) => {
    onOpenSettings(dialogName)
    onClose() // Close the dropdown menu
  }

  const handleSaveKeys = () => {
    try {
      // Validate keys (basic validation - in a real app you'd want more robust validation)
      if (mainWalletKey && mainWalletKey.length < 32) {
        toast({
          title: "Invalid Main Wallet Key",
          description: "Please enter a valid private key",
          variant: "destructive",
        })
        return
      }

      if (fundingWalletKey && fundingWalletKey.length < 32) {
        toast({
          title: "Invalid Funding Wallet Key",
          description: "Please enter a valid private key",
          variant: "destructive",
        })
        return
      }

      // Save to localStorage (in a real app, you'd want more secure storage)
      if (mainWalletKey) {
        localStorage.setItem("mainWalletPrivateKey", mainWalletKey)
      }

      if (fundingWalletKey) {
        localStorage.setItem("fundingWalletPrivateKey", fundingWalletKey)
      }

      toast({
        title: "Keys Saved",
        description: "Your wallet keys have been saved",
      })
    } catch (error) {
      console.error("Error saving keys:", error)
      toast({
        title: "Error",
        description: "Failed to save wallet keys",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-80 header py-15 mt-15 animate-in fade-in zoom-in-95 duration-100">
      <div className="px-2 py-1 text-sm font-medium text-white border-b border-[#333]">Configuration</div>

      {/* Wallet Keys Section */}
      <div className="p-3 border-b border-[#333]">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Key size={14} className="mr-2" />
          Wallet Keys
        </h3>

        <div className="space-y-3">
          <div>
            <Label htmlFor="mainWalletKey" className="text-xs text-gray-400">
              Main Wallet Private Key
            </Label>
            <div className="relative">
              <Input
                id="mainWalletKey"
                type={showMainKey ? "text" : "password"}
                value={mainWalletKey}
                onChange={(e) => setMainWalletKey(e.target.value)}
                className="bg-[#1a1a1a] border-[#333] pr-8"
                placeholder="Enter main wallet private key"
              />
              <button
                type="button"
                onClick={() => setShowMainKey(!showMainKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showMainKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-amber-500 mt-1">Warning: Store private keys securely</p>
          </div>

          <div>
            <Label htmlFor="fundingWalletKey" className="text-xs text-gray-400">
              Default Funding Wallet Private Key
            </Label>
            <div className="relative">
              <Input
                id="fundingWalletKey"
                type={showFundingKey ? "text" : "password"}
                value={fundingWalletKey}
                onChange={(e) => setFundingWalletKey(e.target.value)}
                className="bg-[#1a1a1a] border-[#333] pr-8"
                placeholder="Enter funding wallet private key"
              />
              <button
                type="button"
                onClick={() => setShowFundingKey(!showFundingKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showFundingKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            onClick={handleSaveKeys}
            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Save size={14} />
            Save Keys
          </Button>
        </div>
      </div>

      {/* Other Configuration Options */}
      <div className="py-2 max-h-[400px] overflow-y-auto">
        <MenuItem
          icon={<Settings size={16} />}
          label="General Settings"
          onClick={() => handleMenuClick("generalSettings")}
        />
        <MenuItem
          icon={<DollarSign size={16} />}
          label="Risk Management"
          onClick={() => handleMenuClick("riskManagement")}
        />
      </div>
    </div>
  )
}
