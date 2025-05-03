import { PageHeader } from "@/components/ui/page-header"

export default function DashboardPage() {
  return (
    <div className="py-6">
      <PageHeader title="Dashboard" description="Overview of your account and performance metrics" />
      <div className="mt-6 p-4 bg-[#222222] rounded-md">
        <p className="text-gray-400">Dashboard content will be displayed here</p>
      </div>
    </div>
  )
}
