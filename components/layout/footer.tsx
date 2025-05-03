import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-8 pt-4 border-t border-gray-800 flex flex-col sm:flex-row justify-between text-xs text-gray-500">
      <div>StakingAI 2023. All Rights Reserved.</div>
      <div className="flex gap-4 mt-2 sm:mt-0">
        <Link href="/faqs" className="text-[#FF8C00] hover:text-[#FFA500]">
          FAQs
        </Link>
        <Link href="/terms" className="text-[#FF8C00] hover:text-[#FFA500]">
          Nutzungsbedingungen
        </Link>
        <Link href="/privacy" className="text-[#FF8C00] hover:text-[#FFA500]">
          Privacy Policy
        </Link>
      </div>
    </footer>
  )
}
