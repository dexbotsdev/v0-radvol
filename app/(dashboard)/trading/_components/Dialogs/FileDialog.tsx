"use client"
import { Upload, Download, X } from "lucide-react"
import { MenuItem } from "../shared/MenuItem"

interface FileDialogProps {
  onClose: () => void
}

export function FileDialog({ onClose }: FileDialogProps) {
  return (
    <div className="w-64 header py-1 animate-in fade-in zoom-in-95 duration-100">
      <div className="px-2 py-1 text-sm font-medium text-white border-b border-[#333]">File Operations</div>
      <div className="py-1">
        <div className="border-t border-[#333] my-1"></div>
        <MenuItem icon={<Upload size={16} />} label="Import Wallets" onClick={onClose} />
        <MenuItem icon={<Download size={16} />} label="Export Wallets" onClick={onClose} />
        <div className="border-t border-[#333] my-1"></div>
        <MenuItem icon={<X size={16} />} label="Exit" shortcut="Alt+F4" onClick={onClose} />
      </div>
    </div>
  )
}
