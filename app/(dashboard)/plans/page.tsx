import { PageHeader } from "@/components/ui/page-header"

export default function PlansPage() {
  return (
    <div className="py-6">
      <PageHeader title="Our Plans" description="Explore available staking plans and options" />
      <div className="mt-6 p-4 bg-[#222222] rounded-md">
        <p className="text-gray-400">Staking plans will be displayed here</p>
      </div>
    </div>
  )
}
