"use client"

export function PortfolioTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
}) {
  const tabs = ["Overview", "Portfolio", "Financials", "Trades"]

  return (
    <div className="border-b border-gray-800 mb-6">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab ? "text-[#FF8C00] border-b-2 border-[#FF8C00]" : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
