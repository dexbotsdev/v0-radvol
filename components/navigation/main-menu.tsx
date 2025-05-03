"use client"

import { usePathname } from "next/navigation"
import { MenuItem } from "@/components/navigation/menu-item"
import { DashboardIcon, TransactionsIcon, InvestmentIcon, PlansIcon, StatsIcon, ProfileIcon } from "@/components/icons"
import { BarChart2 } from "lucide-react"

export function MainMenu() {
  const pathname = usePathname()

  const menuItems = [
    { icon: <DashboardIcon />, label: "Dashboard", href: "/dashboard" },
    { icon: <TransactionsIcon />, label: "Transactions", href: "/transactions" },
    { icon: <InvestmentIcon />, label: "Investment", href: "/investment" },
    { icon: <BarChart2 size={18} />, label: "Trading", href: "/trading" },
    { icon: <PlansIcon />, label: "Our Plans", href: "/plans" },
    { icon: <StatsIcon />, label: "Fund Stats", href: "/fund-stats" },
    { icon: <ProfileIcon />, label: "My Profile", href: "/profile" },
  ]

  return (
    <div className="mb-8">
      <div className="text-xs text-gray-400 mb-4 uppercase tracking-wider">MENU</div>
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <MenuItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={pathname === item.href}
          />
        ))}
      </nav>
    </div>
  )
}
