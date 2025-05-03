"use client"
import { Play, Pause, X, RefreshCw, Settings, BarChart2 } from "lucide-react"
import { MenuItem } from "../shared/MenuItem"

interface BotDialogProps {
  onClose: () => void
}

export function BotDialog({ onClose }: BotDialogProps) {
  return (
    <div className="w-64 header py-1 animate-in fade-in zoom-in-95 duration-100">
      <div className="px-2 py-1 text-sm font-medium text-white border-b border-[#333]">Bot Controls</div>
      <div className="py-1">
        <MenuItem icon={<Play size={16} className="text-green-500" />} label="Start Bot" onClick={onClose} />
        <MenuItem icon={<Pause size={16} className="text-yellow-500" />} label="Pause Bot" onClick={onClose} />
        <MenuItem icon={<X size={16} className="text-red-500" />} label="Stop Bot" onClick={onClose} />
        <div className="border-t border-[#333] my-1"></div>
        <MenuItem icon={<RefreshCw size={16} />} label="Reset Statistics" onClick={onClose} />
        <MenuItem icon={<Settings size={16} />} label="Bot Settings" onClick={onClose} />
        <div className="border-t border-[#333] my-1"></div>
        <MenuItem icon={<BarChart2 size={16} />} label="Performance Report" onClick={onClose} />
      </div>
    </div>
  )
}
