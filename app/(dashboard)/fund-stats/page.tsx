"use client"

import { PerformanceHeader } from "@/components/dashboard/performance-header"
import { PortfolioTabs } from "@/components/dashboard/portfolio-tabs"
import { PortfolioTable } from "@/components/dashboard/portfolio-table"
import { useState } from "react"

export default function FundStatsPage() {
  const [activeTab, setActiveTab] = useState("Portfolio")

  return (
    <>
      <PerformanceHeader />
      <PortfolioTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <PortfolioTable />
    </>
  )
}
