export function AccountStats({
  profit,
  depositInOrders,
  withdrawInProgress,
}: {
  profit: {
    percentage: string
    amount: string
    period: string
  }
  depositInOrders: string
  withdrawInProgress: string
}) {
  return (
    <div className="space-y-2 mb-6">
      <div className="flex justify-between text-sm">
        <div>Profits ({profit.period})</div>
        <div className="flex items-center">
          <span className="text-green-500 mr-1">{profit.percentage}↑</span>
          <span className="text-[#FF8C00] font-medium">{profit.amount}</span>
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <div>Deposit in orders</div>
        <div className="text-[#FF8C00] font-medium">{depositInOrders}</div>
      </div>
      <div className="flex justify-between text-sm">
        <div>Withdraw in progress</div>
        <div className="text-[#FF8C00] font-medium">{withdrawInProgress}</div>
      </div>
    </div>
  )
}
