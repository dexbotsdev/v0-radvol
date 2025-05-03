"use client"

import { usePathname } from "next/navigation"
import { MenuItem } from "@/components/navigation/menu-item"
import { HomeIcon } from "@/components/icons"

export function AdditionalMenu() {
  const pathname = usePathname()

  return (
    <div className="mb-8">
      <div className="text-xs text-gray-400 mb-4 uppercase tracking-wider">ADDITIONAL</div>
      <MenuItem icon={<HomeIcon />} label="Go to Home" href="/" active={pathname === "/"} />
    </div>
  )
}
