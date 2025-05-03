"use client"

import { ChevronDown } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="flex justify-between items-center mb-6">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <div className="bg-[#FF8C00] p-1 rounded mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" fill="white" />
            <path d="M12 6L8 8V16L12 18L16 16V8L12 6Z" fill="#1a1a1a" />
          </svg>
        </div>
        <span className="font-bold text-xl tracking-tight">
          STAKING<span className="bg-[#FF8C00] text-white px-1 rounded text-xs align-top">AI</span>
        </span>
      </Link>

      {/* User profile and language selector */}
      <div className="flex items-center">
        {/* User profile */}
        <div className="flex items-center mr-4">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-2">
            <span className="text-white">🇯🇵</span>
          </div>
          <div className="text-xs">
            <div>Jordan</div>
            <div className="text-gray-400">Verified</div>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center border border-gray-700 rounded px-2 py-1">
          <span className="mr-1">🇩🇪</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  )
}
