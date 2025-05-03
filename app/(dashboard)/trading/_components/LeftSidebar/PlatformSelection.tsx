"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Platform } from "../../types"

interface PlatformSelectionProps {
  platforms?: Platform[]
  selectedPlatform?: string
  cyclePlatform?: (direction: "next" | "prev") => void
  botRunning?: boolean
  disabled?: boolean
  platform?: string
  setPlatform?: (platform: string) => void
  strategyMode?: string
  setStrategyMode?: (mode: string) => void
}

export function PlatformSelection({
  platforms = [],
  selectedPlatform = "",
  cyclePlatform,
  botRunning = false,
  disabled = false,
  platform,
  setPlatform,
  strategyMode,
  setStrategyMode,
}: PlatformSelectionProps) {
  // Safely find the currently selected platform with fallbacks
  const currentPlatform =
    platforms && platforms.length > 0
      ? platforms.find((p) => p.id === (selectedPlatform || platform)) || platforms[0]
      : { id: "unknown", name: "Unknown Platform", description: "No platforms available", color: "#888" }

  // Handle platform cycling based on which props are available
  const handleCyclePlatform = (direction: "next" | "prev") => {
    if (cyclePlatform) {
      cyclePlatform(direction)
    } else if (setPlatform && platforms && platforms.length > 0) {
      const currentIndex = platforms.findIndex((p) => p.id === platform)
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % platforms.length
          : (currentIndex - 1 + platforms.length) % platforms.length
      setPlatform(platforms[newIndex].id)
    }
  }

  return (
    <div className="mb-4">
      <div className="text-xs text-gray-400 mb-1">Platform</div>
      <div className="flex items-center justify-between bg-[#1a1a1a] rounded-md p-2">
        <button
          className="p-1 hover:bg-[#333] rounded-md disabled:opacity-50"
          onClick={() => handleCyclePlatform("prev")}
          disabled={botRunning || disabled || !platforms || platforms.length <= 1}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex-1 text-center">
          <div className="text-sm font-medium" style={{ color: currentPlatform.color }}>
            {currentPlatform.name}
          </div>
          <div className="text-xs text-gray-400">{currentPlatform.description}</div>
        </div>

        <button
          className="p-1 hover:bg-[#333] rounded-md disabled:opacity-50"
          onClick={() => handleCyclePlatform("next")}
          disabled={botRunning || disabled || !platforms || platforms.length <= 1}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
