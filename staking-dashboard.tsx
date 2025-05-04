"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

export default function StakingDashboard() {
  const [activeTab, setActiveTab] = useState("Portfolio")

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white font-['Segoe_UI',Montserrat,sans-serif]">
      <div className="max-w-7xl mx-auto w-full p-4 border border-[#282b31] bg-gradient-to-b from-[#32353c] to-[rgba(0,0,0,0.31)] rounded-lg shadow-lg">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-[#FF8C00] p-1 rounded mr-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" fill="white" />
                <path d="M12 6L8 8V16L12 18L16 16V8L12 6Z" fill="#1a1a1a" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">
              STAKING<span className="bg-[#FF8C00] text-white px-1 rounded text-xs align-top">AI</span>
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-2">
                <span className="text-white">🇯🇵</span>
              </div>
              <div className="text-xs">
                <div>Jordan</div>
                <div className="text-gray-400">Verified</div>
              </div>
            </div>
            <div className="flex items-center border border-gray-700 rounded px-2 py-1">
              <span className="mr-1">🇩🇪</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row">
          {/* Left sidebar */}
          <div className="w-full lg:w-80 lg:pr-6 lg:border-r border-[#282b31] mb-6 lg:mb-0">
            <div className="mb-6">
              <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">MAIN ACCOUNT BALANCE</div>
              <div className="text-[28px] font-bold text-[#FF8C00]">
                41,231,441.33 <span className="text-sm">EUR</span>
              </div>
              <div className="text-sm text-gray-400">41,231,441.33 EUR</div>
            </div>

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

            <div className="flex gap-2 mb-8">
              <button className="border border-green-600 text-green-500 px-4 py-1 rounded text-sm hover:bg-green-900/20 transition uppercase">
                Deposit
              </button>
              <button className="border border-red-600 text-red-500 px-4 py-1 rounded text-sm hover:bg-red-900/20 transition uppercase">
                Withdraw
              </button>
            </div>

            <div className="mb-8">
              <div className="text-xs text-gray-400 mb-4 uppercase tracking-wider">MENU</div>
              <nav className="space-y-4">
                <MenuItem icon={<DashboardIcon />} label="Dashboard" />
                <MenuItem icon={<TransactionsIcon />} label="Transactions" />
                <MenuItem icon={<InvestmentIcon />} label="Investment" />
                <MenuItem icon={<PlansIcon />} label="Our Plans" />
                <MenuItem icon={<StatsIcon />} label="Fund Stats" active />
                <MenuItem icon={<ProfileIcon />} label="My Profile" />
              </nav>
            </div>

            <div className="mb-8">
              <div className="text-xs text-gray-400 mb-4 uppercase tracking-wider">ADDITIONAL</div>
              <MenuItem icon={<HomeIcon />} label="Go to Home" />
            </div>

            <div className="mt-auto pt-8">
              <Link href="#" className="text-sm text-gray-300 hover:text-white">
                Contact
              </Link>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 lg:pl-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">StakingAI performance</h1>
              <p className="text-sm text-gray-400">You have full control to manage your own account setting.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-[#282b31] mb-6">
              <div className="flex">
                {["Overview", "Portfolio", "Financials", "Trades"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === tab
                        ? "text-[#FF8C00] border-b-2 border-[#FF8C00]"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Portfolio Table */}
            <PortfolioTable />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-[#282b31] flex flex-col sm:flex-row justify-between text-xs text-gray-500">
          <div>StakingAI 2023. All Rights Reserved.</div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="#" className="text-[#FF8C00] hover:text-[#FFA500]">
              FAQs
            </Link>
            <Link href="#" className="text-[#FF8C00] hover:text-[#FFA500]">
              Nutzungsbedingungen
            </Link>
            <Link href="#" className="text-[#FF8C00] hover:text-[#FFA500]">
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

// Modular Components
function MenuItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href="#"
      className={`flex items-center text-sm ${
        active ? "bg-[#FF8C00] text-white px-3 py-2 rounded" : "text-gray-300 hover:text-white"
      }`}
    >
      <div className="w-6 h-6 mr-3 flex items-center justify-center">{icon}</div>
      {label}
    </Link>
  )
}

function PortfolioTable() {
  return (
    <div className="overflow-x-auto">
      {/* Table header */}
      <div className="grid grid-cols-6 text-xs text-gray-400 mb-2 px-2">
        <div className="col-span-1">ASSETS</div>
        <div className="col-span-1 text-right">BALANCE</div>
        <div className="col-span-1 text-right">PRICE</div>
        <div className="col-span-1 text-right">CHANGE 24H</div>
        <div className="col-span-1 text-right">VALUE</div>
        <div className="col-span-1 text-right">ALLOCATION</div>
      </div>

      {/* Table content */}
      <div className="space-y-px">
        <AssetRow
          symbol="WETH"
          name="Wrapped Ether"
          iconBg="bg-gray-700"
          iconText="W"
          balance="100.09658478"
          price="$1,573.18"
          change="0.67%"
          changePositive={true}
          value="$157,469.95"
          allocation="24.91%"
        />

        <AssetRow
          symbol="WBTC"
          name="Wrapped BTC"
          iconBg="bg-orange-500"
          iconText="₿"
          balance="5.9848912"
          price="$22,545.48"
          change="1.12%"
          changePositive={true}
          value="$134,932.24"
          allocation="21.34%"
        />

        <AssetRow
          symbol="AAVE"
          name="Aave Token"
          iconBg="bg-blue-500"
          iconText="A"
          balance="1,839.03596851"
          price="$77.18"
          change="1.94%"
          changePositive={true}
          value="$80,189.31"
          allocation="12.68%"
        />

        <AssetRow
          symbol="LINK"
          name="ChainLink Token"
          iconBg="bg-blue-600"
          iconText="L"
          balance="9,921.79439251"
          price="$6.95"
          change="0.70%"
          changePositive={true}
          value="$68,972.07"
          allocation="10.91%"
        />

        <AssetRow
          symbol="CRV"
          name="Curve DAO Token"
          iconBg="bg-gradient-to-r from-blue-500 to-purple-500"
          iconText="C"
          balance="69,898.0351947"
          price="$0.95"
          change="2.69%"
          changePositive={true}
          value="$66,700.75"
          allocation="10.55%"
        />

        <AssetRow
          symbol="1INCH"
          name="1INCH Toke"
          iconBg="bg-gray-700"
          iconText="1"
          balance="75,974.0105836"
          price="$0.53"
          change="1.13%"
          changePositive={true}
          value="$40,116.74"
          allocation="6.35%"
        />

        <AssetRow
          symbol="MANA"
          name="Decentraland MANA"
          iconBg="bg-red-500"
          iconText="M"
          balance="52,926.8487954"
          price="$0.61"
          change="7.54%"
          changePositive={true}
          value="$32,567.69"
          allocation="5.15%"
        />

        <AssetRow
          symbol="COMP"
          name="Compound"
          iconBg="bg-green-500"
          iconText="C"
          balance="696.12996181"
          price="$46.13"
          change="2.71%"
          changePositive={true}
          value="$32,115.32"
          allocation="5.08%"
        />

        <AssetRow
          symbol="OCEAN"
          name="Ocean Toke"
          iconBg="bg-gray-700"
          iconText="O"
          balance="49,686.6673688"
          price="$0.39"
          change="0.22%"
          changePositive={false}
          value="$19,597.61"
          allocation="3.10%"
        />

        <AssetRow
          symbol="USDC"
          name="USD Coin"
          iconBg="bg-blue-500"
          iconText="$"
          balance="0.000"
          price="$1.00"
          change="0.37%"
          changePositive={false}
          value="$0.00"
          allocation="0.00%"
        />
      </div>
    </div>
  )
}

function AssetRow({
  symbol,
  name,
  iconBg,
  iconText,
  balance,
  price,
  change,
  changePositive,
  value,
  allocation,
}: {
  symbol: string
  name: string
  iconBg: string
  iconText: string
  balance: string
  price: string
  change: string
  changePositive: boolean
  value: string
  allocation: string
}) {
  return (
    <div className="grid grid-cols-6 items-center border border-[#282b31] bg-gradient-to-b from-[#2a2d36] to-[#1a1c22] rounded p-2">
      <div className="col-span-1 flex items-center">
        <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center mr-2`}>
          <span className="text-white font-bold text-xs">{iconText}</span>
        </div>
        <div>
          <div className="font-medium">{symbol}</div>
          <div className="text-xs text-gray-400">{name}</div>
        </div>
      </div>
      <div className="col-span-1 text-right font-mono text-sm">{balance}</div>
      <div className="col-span-1 text-right font-mono text-sm">{price}</div>
      <div className={`col-span-1 text-right ${changePositive ? "text-green-500" : "text-red-500"} font-mono text-sm`}>
        {changePositive ? "" : "-"}
        {change}
      </div>
      <div className="col-span-1 text-right font-mono text-sm">{value}</div>
      <div className="col-span-1 text-right font-mono text-sm">{allocation}</div>
    </div>
  )
}

// Icons
function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function TransactionsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H20M4 12H20M4 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function InvestmentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 4V20M18 10L12 4L6 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PlansIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 9H5M19 15H5M6 5L18 5C18.5523 5 19 5.44772 19 6V18C19 18.5523 18.5523 19 18 19H6C5.44772 19 5 18.5523 5 18V6C5 5.44772 5.44772 5 6 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function StatsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8H8V16H16V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4H20V20H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
