export function ActionButtons() {
  return (
    <div className="flex gap-2 mb-8">
      <button className="border border-green-600 text-green-500 px-4 py-1 rounded text-sm hover:bg-green-900/20 transition uppercase">
        Deposit
      </button>
      <button className="border border-red-600 text-red-500 px-4 py-1 rounded text-sm hover:bg-red-900/20 transition uppercase">
        Withdraw
      </button>
    </div>
  )
}
