"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { AssetRow } from "@/components/dashboard/asset-row"
import { cryptoAssets } from "@/lib/data"

export function PortfolioTable() {
  const [sortColumn, setSortColumn] = useState("allocation")
  const [sortDirection, setSortDirection] = useState("desc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  // Sort the assets based on the current sort column and direction
  const sortedAssets = [...cryptoAssets].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      const numA = Number.parseFloat(aValue.replace(/[^0-9.-]+/g, ""))
      const numB = Number.parseFloat(bValue.replace(/[^0-9.-]+/g, ""))

      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDirection === "asc" ? numA - numB : numB - numA
      }

      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  return (
    <div className="overflow-x-auto">
      {/* Table header */}
      <div className="grid grid-cols-6 text-xs text-gray-400 mb-2 px-2">
        <div className="col-span-1">ASSETS</div>
        <div className="col-span-1 text-right">BALANCE</div>
        <div className="col-span-1 text-right">PRICE</div>
        <div className="col-span-1 text-right">CHANGE 24H</div>
        <div
          className="col-span-1 text-right flex items-center justify-end cursor-pointer"
          onClick={() => handleSort("value")}
        >
          VALUE
          {sortColumn === "value" && (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
        </div>
        <div
          className="col-span-1 text-right flex items-center justify-end cursor-pointer"
          onClick={() => handleSort("allocation")}
        >
          ALLOCATION
          {sortColumn === "allocation" &&
            (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
        </div>
      </div>

      {/* Table content */}
      <div className="space-y-px">
        {sortedAssets.map((asset) => (
          <AssetRow
            key={asset.symbol}
            symbol={asset.symbol}
            name={asset.name}
            iconBg={asset.iconBg}
            iconText={asset.iconText}
            balance={asset.balance}
            price={asset.price}
            change={asset.change}
            changePositive={asset.changePositive}
            value={asset.value}
            allocation={asset.allocation}
          />
        ))}
      </div>
    </div>
  )
}
