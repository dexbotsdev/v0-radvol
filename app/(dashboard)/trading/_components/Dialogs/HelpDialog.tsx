"use client"
import { HelpCircle, MessageSquare, ExternalLink, Info } from "lucide-react"
import { MenuItem } from "../shared/MenuItem"

interface HelpDialogProps {
  onClose: () => void
}

export function HelpDialog({ onClose }: HelpDialogProps) {
  return (
    <div className="w-64 header py-1 animate-in fade-in zoom-in-95 duration-100">
      <div className="px-2 py-1 text-sm font-medium text-white border-b border-[#333]">Help & Support</div>
      <div className="py-1">
        <MenuItem icon={<HelpCircle size={16} />} label="Documentation" onClick={onClose} />
        <MenuItem icon={<MessageSquare size={16} />} label="Support Chat" onClick={onClose} />
        <MenuItem icon={<ExternalLink size={16} />} label="Video Tutorials" onClick={onClose} />
        <div className="border-t border-[#333] my-1"></div>
        <MenuItem icon={<Info size={16} />} label="About" onClick={onClose} />
      </div>
    </div>
  )
}
