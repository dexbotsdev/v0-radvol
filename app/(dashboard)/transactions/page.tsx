import { PageHeader } from "@/components/ui/page-header"

export default function TransactionsPage() {
  return (
    <div className="py-6">
      <PageHeader title="Transactions" description="View and manage your transaction history" />
      <div className="mt-6 p-4 bg-[#222222] rounded-md">
        <p className="text-gray-400">Transactions history will be displayed here</p>
      </div>
    </div>
  )
}
