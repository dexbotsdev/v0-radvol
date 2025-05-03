"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Upload, Check, X } from "lucide-react"

type WizardStep = "basic" | "details" | "social" | "review"

interface TokenMetadata {
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  description: string
  website: string
  twitter: string
  telegram: string
  discord: string
  logoUrl: string
}

interface TokenMetaWizardModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (tokenMetadata: TokenMetadata) => void
}

export function TokenMetaWizardModal({ isOpen, onClose, onSubmit }: TokenMetaWizardModalProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("basic")
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata>({
    name: "",
    symbol: "",
    decimals: 9,
    totalSupply: "1000000000",
    description: "",
    website: "",
    twitter: "",
    telegram: "",
    discord: "",
    logoUrl: "",
  })

  const updateMetadata = (field: keyof TokenMetadata, value: string | number) => {
    setTokenMetadata({
      ...tokenMetadata,
      [field]: value,
    })
  }

  const goToNextStep = () => {
    if (currentStep === "basic") setCurrentStep("details")
    else if (currentStep === "details") setCurrentStep("social")
    else if (currentStep === "social") setCurrentStep("review")
  }

  const goToPreviousStep = () => {
    if (currentStep === "details") setCurrentStep("basic")
    else if (currentStep === "social") setCurrentStep("details")
    else if (currentStep === "review") setCurrentStep("social")
  }

  const handleSubmit = () => {
    // In a real app, this would submit the token metadata to a backend
    console.log("Submitting token metadata:", tokenMetadata)
    alert("Token metadata submitted successfully!")
    // Reset form

    onSubmit(tokenMetadata)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-100">
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <h2 className="text-xl font-medium">Token Metadata Wizard</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-between items-center px-6 pt-4">
          <div className="flex items-center space-x-2 w-full">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "basic" ||
                currentStep === "details" ||
                currentStep === "social" ||
                currentStep === "review"
                  ? "bg-[#FF8C00] text-white"
                  : "bg-[#333] text-gray-400"
              }`}
            >
              1
            </div>
            <div className="h-1 w-12 bg-[#333]">
              <div
                className={`h-full bg-[#FF8C00] ${
                  currentStep === "details" || currentStep === "social" || currentStep === "review" ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "details" || currentStep === "social" || currentStep === "review"
                  ? "bg-[#FF8C00] text-white"
                  : "bg-[#333] text-gray-400"
              }`}
            >
              2
            </div>
            <div className="h-1 w-12 bg-[#333]">
              <div
                className={`h-full bg-[#FF8C00] ${
                  currentStep === "social" || currentStep === "review" ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "social" || currentStep === "review"
                  ? "bg-[#FF8C00] text-white"
                  : "bg-[#333] text-gray-400"
              }`}
            >
              3
            </div>
            <div className="h-1 w-12 bg-[#333]">
              <div className={`h-full bg-[#FF8C00] ${currentStep === "review" ? "w-full" : "w-0"}`}></div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "review" ? "bg-[#FF8C00] text-white" : "bg-[#333] text-gray-400"
              }`}
            >
              4
            </div>
          </div>
        </div>

        {/* Step title */}
        <div className="px-6 pt-4">
          <h3 className="text-lg font-medium">
            {currentStep === "basic"
              ? "Basic Information"
              : currentStep === "details"
                ? "Token Details"
                : currentStep === "social"
                  ? "Social Media"
                  : "Review Information"}
          </h3>
          <p className="text-sm text-gray-400">
            {currentStep === "basic"
              ? "Enter the basic details of your token"
              : currentStep === "details"
                ? "Provide additional information about your token"
                : currentStep === "social"
                  ? "Add your token's social media links"
                  : "Review your token metadata before submitting"}
          </p>
        </div>

        {/* Step content */}
        <div className="p-6 space-y-4">
          {currentStep === "basic" && (
            <>
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Token Name</label>
                <input
                  type="text"
                  value={tokenMetadata.name}
                  onChange={(e) => updateMetadata("name", e.target.value)}
                  placeholder="e.g. Freedom Token"
                  className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Token Symbol</label>
                <input
                  type="text"
                  value={tokenMetadata.symbol}
                  onChange={(e) => updateMetadata("symbol", e.target.value)}
                  placeholder="e.g. FREE"
                  className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Decimals</label>
                  <input
                    type="number"
                    value={tokenMetadata.decimals}
                    onChange={(e) => updateMetadata("decimals", Number.parseInt(e.target.value))}
                    min="0"
                    max="18"
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Total Supply</label>
                  <input
                    type="text"
                    value={tokenMetadata.totalSupply}
                    onChange={(e) => updateMetadata("totalSupply", e.target.value)}
                    placeholder="e.g. 1000000000"
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {currentStep === "details" && (
            <>
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Description</label>
                <textarea
                  value={tokenMetadata.description}
                  onChange={(e) => updateMetadata("description", e.target.value)}
                  placeholder="Describe your token and its purpose..."
                  className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm h-32"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Token Logo</label>
                <div className="flex items-center space-x-4">
                  {tokenMetadata.logoUrl ? (
                    <div className="relative w-16 h-16 bg-[#222] rounded-lg overflow-hidden">
                      <img
                        src={tokenMetadata.logoUrl || "/placeholder.svg"}
                        alt="Token Logo"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => updateMetadata("logoUrl", "")}
                        className="absolute top-0 right-0 bg-red-500/80 rounded-bl-lg p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-[#222] border border-[#333] rounded-lg flex items-center justify-center">
                      <Upload size={24} className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <button
                      onClick={() => updateMetadata("logoUrl", "https://via.placeholder.com/200x200?text=Token+Logo")}
                      className="px-3 py-1.5 bg-[#333] hover:bg-[#444] rounded text-sm"
                    >
                      Upload Logo
                    </button>
                    <p className="text-xs text-gray-500 mt-1">Recommended: 200x200px PNG</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Website URL</label>
                <input
                  type="url"
                  value={tokenMetadata.website}
                  onChange={(e) => updateMetadata("website", e.target.value)}
                  placeholder="https://yourtoken.com"
                  className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          {currentStep === "social" && (
            <>
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Twitter</label>
                <input
                  type="text"
                  value={tokenMetadata.twitter}
                  onChange={(e) => updateMetadata("twitter", e.target.value)}
                  placeholder="https://twitter.com/yourtoken"
                  className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Telegram</label>
                <input
                  type="text"
                  value={tokenMetadata.telegram}
                  onChange={(e) => updateMetadata("telegram", e.target.value)}
                  placeholder="https://t.me/yourtoken"
                  className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Discord</label>
                <input
                  type="text"
                  value={tokenMetadata.discord}
                  onChange={(e) => updateMetadata("discord", e.target.value)}
                  placeholder="https://discord.gg/yourtoken"
                  className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          {currentStep === "review" && (
            <div className="bg-[#222] border border-[#333] rounded-lg p-4">
              <div className="flex items-center mb-4">
                {tokenMetadata.logoUrl ? (
                  <img
                    src={tokenMetadata.logoUrl || "/placeholder.svg"}
                    alt="Token Logo"
                    className="w-12 h-12 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#333] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg font-bold">{tokenMetadata.symbol.substring(0, 2)}</span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium">{tokenMetadata.name || "Unnamed Token"}</h3>
                  <p className="text-sm text-gray-400">{tokenMetadata.symbol || "NO SYMBOL"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Decimals</p>
                  <p>{tokenMetadata.decimals}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Supply</p>
                  <p>{tokenMetadata.totalSupply}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400">Description</p>
                  <p className="text-sm">{tokenMetadata.description || "No description provided"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400">Website</p>
                  <p>{tokenMetadata.website || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Twitter</p>
                  <p>{tokenMetadata.twitter || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Telegram</p>
                  <p>{tokenMetadata.telegram || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Discord</p>
                  <p>{tokenMetadata.discord || "Not provided"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between p-4 border-t border-[#333]">
          <button
            onClick={goToPreviousStep}
            className={`px-4 py-2 flex items-center space-x-2 rounded ${
              currentStep === "basic" ? "invisible" : "bg-[#333] hover:bg-[#444]"
            }`}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          {currentStep === "review" ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#FF8C00] hover:bg-[#FF7C00] text-white rounded flex items-center space-x-2"
            >
              <Check size={16} />
              <span>Submit</span>
            </button>
          ) : (
            <button
              onClick={goToNextStep}
              className="px-4 py-2 bg-[#FF8C00] hover:bg-[#FF7C00] text-white rounded flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
