import { PageHeader } from "@/components/ui/page-header"

export default function InvestmentPage() {
  return (
    <div className="py-6">
      <PageHeader title="Investment" description="Manage your investment portfolio and strategies" />
      <div className="mt-6 p-4 bg-[#222222] rounded-md">
        <p className="text-gray-400">Investment options will be displayed here</p>
      </div>
    </div>
  )
}
