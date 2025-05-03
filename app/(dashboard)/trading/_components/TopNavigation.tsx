"use client"

import type React from "react"

interface TopNavigationProps {
  activeMenu: string | null
  handleMenuClick: (menu: string, e: React.MouseEvent) => void
}

export function TopNavigation({ activeMenu, handleMenuClick }: TopNavigationProps) {
  const menuItems = ["CONFIG"]

  return (
    <div className="flex items-center justify-between px-2 md:px-4 py-2 header border-b border-[#222]">
      <div className="flex items-center overflow-x-auto hide-scrollbar">
        {menuItems.map((menu) => (
          <button
            key={menu}
            className={`text-xs whitespace-nowrap px-2 md:px-3 py-1 ${
              activeMenu === menu ? "text-white" : "text-gray-400 hover:text-white"
            }`}
            onClick={(e) => handleMenuClick(menu, e)}
          >
            {menu}
          </button>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <button className="text-gray-400 hover:text-white">
          <span className="text-xl">−</span>
        </button>
        <button className="text-gray-400 hover:text-white">
          <span className="text-xl">□</span>
        </button>
        <button className="text-gray-400 hover:text-white">
          <span className="text-xl">×</span>
        </button>
      </div>
    </div>
  )
}
