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

export function TokenMetaWizard() {
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
    setCurrentStep("basic")
    setTokenMetadata({
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
  }

  return (
    <div className="flex flex-col">
      {/* Step indicator */}
      <div className="flex justify-between items-center mb-3 px-1">
        <div
          className={`h-1.5 flex-1 rounded-full ${
            currentStep === "basic" || currentStep === "details" || currentStep === "social" || currentStep === "review"
              ? "bg-[#FF8C00]"
              : "bg-[#333]"
          }`}
        ></div>
        <div className="mx-1"></div>
        <div
          className={`h-1.5 flex-1 rounded-full ${
            currentStep === "details" || currentStep === "social" || currentStep === "review"
              ? "bg-[#FF8C00]"
              : "bg-[#333]"
          }`}
        ></div>
        <div className="mx-1"></div>
        <div
          className={`h-1.5 flex-1 rounded-full ${
            currentStep === "social" || currentStep === "review" ? "bg-[#FF8C00]" : "bg-[#333]"
          }`}
        ></div>
        <div className="mx-1"></div>
        <div className={`h-1.5 flex-1 rounded-full ${currentStep === "review" ? "bg-[#FF8C00]" : "bg-[#333]"}`}></div>
      </div>

      {/* Step title */}
      <div className="mb-3">
        <h3 className="text-sm font-medium">
          {currentStep === "basic"
            ? "Basic Information"
            : currentStep === "details"
              ? "Token Details"
              : currentStep === "social"
                ? "Social Media"
                : "Review Information"}
        </h3>
        <p className="text-xs text-gray-400">
          {currentStep === "basic"
            ? "Enter the basic details of your token"
            : currentStep === "details"
              ? "Provide additional information"
              : currentStep === "social"
                ? "Add your token's social links"
                : "Review before submitting"}
        </p>
      </div>

      {/* Step content */}
      <div className="space-y-3 mb-3">
        {currentStep === "basic" && (
          <>
            <div className="space-y-1">
              <label className="block text-xs text-gray-400">Token Name</label>
              <input
                type="text"
                value={tokenMetadata.name}
                onChange={(e) => updateMetadata("name", e.target.value)}
                placeholder="e.g. Freedom Token"
                className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-gray-400">Token Symbol</label>
              <input
                type="text"
                value={tokenMetadata.symbol}
                onChange={(e) => updateMetadata("symbol", e.target.value)}
                placeholder="e.g. FREE"
                className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block text-xs text-gray-400">Decimals</label>
                <input
                  type="number"
                  value={tokenMetadata.decimals}
                  onChange={(e) => updateMetadata("decimals", Number.parseInt(e.target.value))}
                  min="0"
                  max="18"
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs text-gray-400">Total Supply</label>
                <input
                  type="text"
                  value={tokenMetadata.totalSupply}
                  onChange={(e) => updateMetadata("totalSupply", e.target.value)}
                  placeholder="e.g. 1000000000"
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-xs"
                />
              </div>
            </div>
          </>
        )}

        {currentStep === "details" && (
          <>
            <div className="space-y-1">
              <label className="block text-xs text-gray-400">Description</label>
              <textarea
                value={tokenMetadata.description}
                onChange={(e) => updateMetadata("description", e.target.value)}
                placeholder="Describe your token..."
                className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-xs h-20"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-gray-400">Token Logo</label>
              <div className="flex items-center space-x-2">
                {tokenMetadata.logoUrl ? (
                  <div className="relative w-12 h-12 bg-[#1e1e1e] rounded-lg overflow-hidden">
                    <img
                      src={tokenMetadata.logoUrl || "/placeholder.svg"}
                      alt="Token Logo"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => updateMetadata("logoUrl", "")}
                      className="absolute top-0 right-0 bg-red-500/80 rounded-bl-lg p-0.5"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-[#1e1e1e] border border-[#333] rounded-lg flex items-center justify-center">
                    <Upload size={16} className="text-gray-500" />
                  </div>
                )}
                <div>
                  <button
                    onClick={() => updateMetadata("logoUrl", "https://via.placeholder.com/200x200?text=Token+Logo")}
                    className="px-2 py-1 bg-[#333] hover:bg-[#444] rounded text-xs"
                  >
                    Upload Logo
                  </button>
                  <p className="text-[10px] text-gray-500 mt-0.5">200x200px PNG</p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-gray-400">Website URL</label>
              <input
                type="url"
                value={tokenMetadata.website}
                onChange={(e) => updateMetadata("website", e.target.value)}
                placeholder="https://yourtoken.com"
                className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-xs"
              />
            </div>
          </>
        )}

        {currentStep === "social" && (
          <>
            <div className="space-y-1">
              <label className="block text-xs text-gray-400">Twitter</label>
              <input
                type="text"
                value={tokenMetadata.twitter}
                onChange={(e) => updateMetadata("twitter", e.target.value)}
                placeholder="https://twitter.com/yourtoken"
                className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-gray-400">Telegram</label>
              <input
                type="text"
                value={tokenMetadata.telegram}
                onChange={(e) => updateMetadata("telegram", e.target.value)}
                placeholder="https://t.me/yourtoken"
                className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-gray-400">Discord</label>
              <input
                type="text"
                value={tokenMetadata.discord}
                onChange={(e) => updateMetadata("discord", e.target.value)}
                placeholder="https://discord.gg/yourtoken"
                className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1.5 text-xs"
              />
            </div>
          </>
        )}

        {currentStep === "review" && (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-2 text-xs">
            <div className="flex items-center mb-2">
              {tokenMetadata.logoUrl ? (
                <img
                  src={tokenMetadata.logoUrl || "/placeholder.svg"}
                  alt="Token Logo"
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <div className="w-8 h-8 bg-[#333] rounded-full mr-2 flex items-center justify-center">
                  <span className="text-xs font-bold">{tokenMetadata.symbol.substring(0, 2)}</span>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium">{tokenMetadata.name || "Unnamed Token"}</h3>
                <p className="text-xs text-gray-400">{tokenMetadata.symbol || "NO SYMBOL"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-400">Decimals</p>
                <p>{tokenMetadata.decimals}</p>
              </div>
              <div>
                <p className="text-gray-400">Supply</p>
                <p>{tokenMetadata.totalSupply}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400">Description</p>
                <p className="text-xs truncate">{tokenMetadata.description || "No description"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400">Website</p>
                <p className="truncate">{tokenMetadata.website || "Not provided"}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          className={`px-2 py-1 flex items-center text-xs rounded ${
            currentStep === "basic" ? "invisible" : "bg-[#333] hover:bg-[#444]"
          }`}
        >
          <ArrowLeft size={12} className="mr-1" />
          Back
        </button>
        {currentStep === "review" ? (
          <button
            onClick={handleSubmit}
            className="px-2 py-1 bg-[#FF8C00] hover:bg-[#FF7C00] text-white rounded text-xs flex items-center"
          >
            <Check size={12} className="mr-1" />
            Submit
          </button>
        ) : (
          <button
            onClick={goToNextStep}
            className="px-2 py-1 bg-[#FF8C00] hover:bg-[#FF7C00] text-white rounded text-xs flex items-center"
          >
            Next
            <ArrowRight size={12} className="ml-1" />
          </button>
        )}
      </div>
    </div>
  )
}
