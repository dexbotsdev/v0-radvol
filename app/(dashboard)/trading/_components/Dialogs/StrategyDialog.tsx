"use client"
import { TrendingUp, Plus, Settings, BarChart2 } from "lucide-react"
import { MenuItem } from "../shared/MenuItem"

interface StrategyDialogProps {
  onClose: () => void
}

export function StrategyDialog({ onClose }: StrategyDialogProps) {
  return (
    <div className="w-64 py-1 animate-in fade-in zoom-in-95 duration-100">
      <div className="px-2 py-1 text-sm font-medium text-white border-b border-[#333]">Trading Strategies</div>
      <div className="py-1">
        <MenuItem icon={<TrendingUp size={16} />} label="PSAR Strategy" isActive onClick={onClose} />
        <MenuItem icon={<TrendingUp size={16} />} label="Moving Average" onClick={onClose} />
        <MenuItem icon={<TrendingUp size={16} />} label="RSI Strategy" onClick={onClose} />
        <MenuItem icon={<TrendingUp size={16} />} label="MACD Strategy" onClick={onClose} />
        <div className="border-t border-[#333] my-1"></div>
        <MenuItem icon={<Plus size={16} />} label="Create New Strategy" onClick={onClose} />
        <MenuItem icon={<Settings size={16} />} label="Strategy Parameters" onClick={onClose} />
        <div className="border-t border-[#333] my-1"></div>
        <MenuItem icon={<BarChart2 size={16} />} label="Backtest Strategy" onClick={onClose} />
      </div>
    </div>
  )
}
