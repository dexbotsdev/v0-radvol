import type React from "react"
import Link from "next/link"

export function MenuItem({
  icon,
  label,
  href,
  active = false,
}: {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center text-xs ${
        active ? "bg-[#FF8C00] text-white px-3 py-2 rounded" : "text-gray-300 hover:text-white"
      }`}
    >
      <div className="w-5 h-5 mr-2 flex items-center justify-center">{icon}</div>
      {label}
    </Link>
  )
}
