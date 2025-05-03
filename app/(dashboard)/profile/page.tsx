import { PageHeader } from "@/components/ui/page-header"

export default function ProfilePage() {
  return (
    <div className="py-6">
      <PageHeader title="My Profile" description="Manage your account settings and preferences" />
      <div className="mt-6 p-4 bg-[#222222] rounded-md">
        <p className="text-gray-400">Profile settings will be displayed here</p>
      </div>
    </div>
  )
}
