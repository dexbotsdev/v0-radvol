import type React from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Footer } from "@/components/layout/footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white font-['Segoe_UI',var(--font-montserrat),sans-serif]">
      <div className="max-w-7xl mx-auto w-full p-4 bg-[#1a1a1a] rounded-lg shadow-lg">
        <Header />

        <div className="flex flex-col lg:flex-row">
          <Sidebar />
          <main className="flex-1 lg:pl-2">{children}</main>
        </div>

        <Footer />
      </div>
    </div>
  )
}
