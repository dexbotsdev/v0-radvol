export function AccountBalance({
  amount,
  currency,
}: {
  amount: string
  currency: string
}) {
  return (
    <div className="mb-6">
      <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">MAIN ACCOUNT BALANCE</div>
      <div className="text-[28px] font-bold text-[#FF8C00]">
        {amount} <span className="text-sm">{currency}</span>
      </div>
      <div className="text-sm text-gray-400">
        {amount} {currency}
      </div>
    </div>
  )
}
