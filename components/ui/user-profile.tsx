export function UserProfile({
  name,
  status,
  avatar,
}: {
  name: string
  status: string
  avatar: string
}) {
  return (
    <div className="flex items-center mr-4">
      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-2">
        <span className="text-white">{avatar}</span>
      </div>
      <div className="text-xs">
        <div>{name}</div>
        <div className="text-gray-400">{status}</div>
      </div>
    </div>
  )
}
