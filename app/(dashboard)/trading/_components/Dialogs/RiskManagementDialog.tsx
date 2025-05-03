"use client"
import { useState } from "react"
import { X, Save } from "lucide-react"

interface RiskManagementDialogProps {
  onClose: () => void
}

export function RiskManagementDialog({ onClose }: RiskManagementDialogProps) {
  const [rpcType, setRpcType] = useState("default")
  const [bundleTrades, setBundleTrades] = useState(true)
  const [customRpcUrl, setCustomRpcUrl] = useState("")

  const handleSave = () => {
    // In a real app, this would save to backend or localStorage
    console.log("Saving risk management settings:", {
      rpcType,
      bundleTrades,
      customRpcUrl: rpcType === "custom" ? customRpcUrl : null,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="rightsidebar border border-[#333] rounded-md w-full max-w-md shadow-xl my-4">
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <h2 className="text-lg font-medium">Risk Management</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm text-gray-400">RPC Configuration</label>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="default-rpc"
                  name="rpc-type"
                  checked={rpcType === "default"}
                  onChange={() => setRpcType("default")}
                  className="mr-2"
                />
                <label htmlFor="default-rpc" className="text-sm">
                  Use Default System RPC
                </label>
              </div>
              <p className="text-xs text-gray-500 ml-5">Use the system's default RPC endpoint for all transactions</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="custom-rpc"
                  name="rpc-type"
                  checked={rpcType === "custom"}
                  onChange={() => setRpcType("custom")}
                  className="mr-2"
                />
                <label htmlFor="custom-rpc" className="text-sm">
                  Use Custom Personal RPC
                </label>
              </div>

              {rpcType === "custom" && (
                <input
                  type="text"
                  value={customRpcUrl}
                  onChange={(e) => setCustomRpcUrl(e.target.value)}
                  placeholder="Enter custom RPC URL"
                  className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm ml-5"
                />
              )}
              <p className="text-xs text-gray-500 ml-5">Use your own RPC endpoint for better privacy and reliability</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-gray-400">Transaction Settings</label>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm">Bundle Transactions</div>
                <p className="text-xs text-gray-500">Combine multiple trades into a single transaction when possible</p>
              </div>

              <div
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                  bundleTrades ? "bg-[#FF8C00]" : "bg-[#333]"
                }`}
                onClick={() => setBundleTrades(!bundleTrades)}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    bundleTrades ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
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
