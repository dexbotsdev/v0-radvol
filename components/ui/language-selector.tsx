"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button className="flex items-center border border-gray-700 rounded px-2 py-1" onClick={() => setIsOpen(!isOpen)}>
        <span className="mr-1">🇩🇪</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-[#222222] border border-gray-700 rounded shadow-lg z-10">
          <button
            className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <span className="mr-2">🇩🇪</span>
            <span>German</span>
          </button>
          <button
            className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <span className="mr-2">🇬🇧</span>
            <span>English</span>
          </button>
          <button
            className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <span className="mr-2">🇫🇷</span>
            <span>French</span>
          </button>
        </div>
      )}
    </div>
  )
}
