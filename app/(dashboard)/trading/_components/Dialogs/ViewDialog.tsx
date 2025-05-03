"use client"
import { Columns, BarChart2, Sliders, Maximize2, Moon, Sun } from "lucide-react"
import { MenuItem } from "../shared/MenuItem"

interface ViewDialogProps {
  onClose: () => void
}

export function ViewDialog({ onClose }: ViewDialogProps) {
  return (
    <div className="w-64 py-1 animate-in fade-in zoom-in-95 duration-100">
      <div className="px-2 py-1 text-sm font-medium text-white border-b border-[#333]">View Options</div>
      <div className="py-1">
        <MenuItem icon={<Columns size={16} />} label="Layout" hasSubmenu onClick={onClose} />
        <MenuItem icon={<BarChart2 size={16} />} label="Chart Type" hasSubmenu onClick={onClose} />
        <MenuItem icon={<Sliders size={16} />} label="Indicators" hasSubmenu onClick={onClose} />
        <div className="border-t border-[#333] my-1"></div>
        <MenuItem icon={<Maximize2 size={16} />} label="Full Screen" shortcut="F11" onClick={onClose} />
        <div className="border-t border-[#333] my-1"></div>
        <MenuItem icon={<Moon size={16} />} label="Dark Theme" isActive onClick={onClose} />
        <MenuItem icon={<Sun size={16} />} label="Light Theme" onClick={onClose} />
      </div>
    </div>
  )
}
