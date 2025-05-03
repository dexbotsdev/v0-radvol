"use client"
import { useState } from "react"
import { X, Save } from "lucide-react"

interface GeneralSettingsDialogProps {
  onClose: () => void
}

export function GeneralSettingsDialog({ onClose }: GeneralSettingsDialogProps) {
  const [rpcUrl, setRpcUrl] = useState("https://api.mainnet-beta.solana.com")
  const [privateKey, setPrivateKey] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)

  const handleSave = () => {
    // In a real app, this would save to backend or localStorage
    console.log("Saving general settings:", { rpcUrl, privateKey })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="rightsidebar border border-[#333] rounded-md w-full max-w-md shadow-xl my-4">
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <h2 className="text-lg font-medium">General Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-gray-400">Default RPC URL</label>
            <input
              type="text"
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
              placeholder="https://api.mainnet-beta.solana.com"
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500">The RPC endpoint used for blockchain interactions</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-400">Default Funding Wallet Private Key</label>
            <div className="relative">
              <input
                type={showPrivateKey ? "text" : "password"}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="Enter your private key"
                className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm pr-24"
              />
              <button
                type="button"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                {showPrivateKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              <span className="text-yellow-500">⚠️ Warning:</span> Store your private key securely. Never share it with
              anyone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-[#333]">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-[#333] rounded hover:bg-[#333]">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-[#FF8C00] text-white rounded hover:bg-[#FF7C00] flex items-center"
          >
            <Save size={16} className="mr-1" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
