"use client"

import type React from "react"
import { ChevronDown } from "lucide-react"

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  shortcut?: string
  onClick: () => void
  hasSubmenu?: boolean
  isActive?: boolean
}

export function MenuItem({ icon, label, shortcut, onClick, hasSubmenu = false, isActive = false }: MenuItemProps) {
  return (
    <button
      className={`w-full px-3 py-2.5 text-sm flex items-center hover:bg-[#2a2a2a] ${isActive ? "bg-[#2a2a2a]" : ""}`}
      onClick={onClick}
    >
      <span className="mr-3 text-gray-400">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {shortcut && <span className="text-xs text-gray-500">{shortcut}</span>}
      {hasSubmenu && <ChevronDown size={14} className="ml-1 text-gray-400" />}
    </button>
  )
}
