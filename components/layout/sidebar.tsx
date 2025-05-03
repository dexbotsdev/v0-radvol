"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  DashboardIcon,
  TransactionsIcon,
  InvestmentIcon,
  PlansIcon,
  StatsIcon,
  ProfileIcon,
  HomeIcon,
} from "@/components/icons"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-full lg:w-80 lg:pr-6 lg:border-r border-gray-800 mb-6 lg:mb-0">
      {/* Account Balance */}
      <div className="mb-6">
        <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">MAIN ACCOUNT BALANCE</div>
        <div className="text-[28px] font-bold text-[#FF8C00]">
          41,231,441.33 <span className="text-sm">EUR</span>
        </div>
        <div className="text-sm text-gray-400">41,231,441.33 EUR</div>
      </div>

      {/* Account Stats */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <div>Profits (7d)</div>
          <div className="flex items-center">
            <span className="text-green-500 mr-1">+16%↑</span>
            <span className="text-[#FF8C00] font-medium">8,561.67 EUR</span>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <div>Deposit in orders</div>
          <div className="text-[#FF8C00] font-medium">24,810.12 EUR</div>
        </div>
        <div className="flex justify-between text-sm">
          <div>Withdraw in progress</div>
          <div className="text-[#FF8C00] font-medium">1.00 EUR</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-8">
        <button className="border border-green-600 text-green-500 px-4 py-1 rounded text-sm hover:bg-green-900/20 transition uppercase">
          Deposit
        </button>
        <button className="border border-red-600 text-red-500 px-4 py-1 rounded text-sm hover:bg-red-900/20 transition uppercase">
          Withdraw
        </button>
      </div>

      {/* Main Menu */}
      <div className="mb-8">
        <div className="text-xs text-gray-400 mb-4 uppercase tracking-wider">MENU</div>
        <nav className="space-y-4">
          <MenuItem icon={<DashboardIcon />} label="Dashboard" href="/dashboard" active={pathname === "/dashboard"} />
          <MenuItem
            icon={<TransactionsIcon />}
            label="Transactions"
            href="/transactions"
            active={pathname === "/transactions"}
          />
          <MenuItem
            icon={<InvestmentIcon />}
            label="Investment"
            href="/investment"
            active={pathname === "/investment"}
          />
          <MenuItem icon={<PlansIcon />} label="Our Plans" href="/plans" active={pathname === "/plans"} />
          <MenuItem icon={<StatsIcon />} label="Fund Stats" href="/fund-stats" active={pathname === "/fund-stats"} />
          <MenuItem icon={<ProfileIcon />} label="My Profile" href="/profile" active={pathname === "/profile"} />
        </nav>
      </div>

      {/* Additional Menu */}
      <div className="mb-8">
        <div className="text-xs text-gray-400 mb-4 uppercase tracking-wider">ADDITIONAL</div>
        <MenuItem icon={<HomeIcon />} label="Go to Home" href="/" active={pathname === "/"} />
      </div>

      {/* Contact Link */}
      <div className="mt-auto pt-8">
        <Link href="/contact" className="text-sm text-gray-300 hover:text-white">
          Contact
        </Link>
      </div>
    </div>
  )
}

function MenuItem({
  icon,
  label,
  href,
  active = false,
}: {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center text-sm ${
        active ? "bg-[#FF8C00] text-white px-3 py-2 rounded" : "text-gray-300 hover:text-white"
      }`}
    >
      <div className="w-6 h-6 mr-3 flex items-center justify-center">{icon}</div>
      {label}
    </Link>
  )
}
