"use client"

import type React from "react"
import { FileDialog } from "./FileDialog"
import { BotDialog } from "./BotDialog"
import { ConfigDialog } from "./ConfigDialog"
import { StrategyDialog } from "./StrategyDialog"
import { ViewDialog } from "./ViewDialog"
import { HelpDialog } from "./HelpDialog"

interface DialogsProps {
  activeMenu: string | null
  menuPosition: { top: number; left: number }
  dialogRef: React.RefObject<HTMLDivElement>
  onClose: () => void
  onOpenSettings: (dialogName: string) => void
}

export function Dialogs({ activeMenu, menuPosition, dialogRef, onClose, onOpenSettings }: DialogsProps) {
  if (!activeMenu) return null

  return (
    <div
      className="fixed z-50 header border border-[#333] rounded-md shadow-lg overflow-hidden"
      style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
      ref={dialogRef}
    >
      {activeMenu === "FILE" && <FileDialog onClose={onClose} />}
      {activeMenu === "BOT" && <BotDialog onClose={onClose} />}
      {activeMenu === "CONFIG" && <ConfigDialog onClose={onClose} onOpenSettings={onOpenSettings} />}
      {activeMenu === "STRATEGY" && <StrategyDialog onClose={onClose} />}
      {activeMenu === "VIEW" && <ViewDialog onClose={onClose} />}
      {activeMenu === "HELP" && <HelpDialog onClose={onClose} />}
    </div>
  )
}
