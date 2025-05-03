export function AssetRow({
  symbol,
  name,
  iconBg,
  iconText,
  balance,
  price,
  change,
  changePositive,
  value,
  allocation,
}: {
  symbol: string
  name: string
  iconBg: string
  iconText: string
  balance: string
  price: string
  change: string
  changePositive: boolean
  value: string
  allocation: string
}) {
  return (
    <div className="grid grid-cols-6 items-center bg-[#222222] rounded p-2">
      <div className="col-span-1 flex items-center">
        <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center mr-2`}>
          <span className="text-white font-bold text-xs">{iconText}</span>
        </div>
        <div>
          <div className="font-medium">{symbol}</div>
          <div className="text-xs text-gray-400">{name}</div>
        </div>
      </div>
      <div className="col-span-1 text-right font-mono text-sm">{balance}</div>
      <div className="col-span-1 text-right font-mono text-sm">{price}</div>
      <div className={`col-span-1 text-right ${changePositive ? "text-green-500" : "text-red-500"} font-mono text-sm`}>
        {changePositive ? "" : "-"}
        {change}
      </div>
      <div className="col-span-1 text-right font-mono text-sm">{value}</div>
      <div className="col-span-1 text-right font-mono text-sm">{allocation}</div>
    </div>
  )
}
