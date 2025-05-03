"use client"

import { useEffect, useRef } from "react"
import { Trash2, Info } from "lucide-react"
import { ActivityLogItem } from "../shared/ActivityLogItem"
import type { ActivityLog } from "../../types"

interface LogsTabProps {
  activityLogs?: ActivityLog[]
  clearLogs: () => void
}

export function LogsTab({ activityLogs = [], clearLogs }: LogsTabProps) {
  const logContainerRef = useRef<HTMLDivElement>(null)
  const logs = activityLogs || [] // Ensure logs is always an array

  // Auto-scroll logs to top when new logs are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0
    }
  }, [logs])

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-2 border-b border-[#222] bg-[#1a1a1a] flex justify-between items-center">
        <h3 className="text-xs font-medium text-gray-300">Activity Logs</h3>
        <div className="flex space-x-1">
          <button
            className="text-gray-400 hover:text-white p-1"
            title="Clear logs"
            onClick={clearLogs}
            disabled={logs.length === 0}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <div
        className="flex-1 overflow-y-auto p-2 text-xs bg-[#0a0a0a] max-h-[calc(100vh-200px)] md:max-h-none"
        ref={logContainerRef}
      >
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-2">
            <div className="flex flex-col items-center justify-center h-32">
              <Info size={24} className="mb-2 text-gray-400" />
              <p>No activity logs yet</p>
              <p className="mt-1 text-gray-600">Start the bot to see activity logs</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {[...logs].reverse().map((log) => (
              <ActivityLogItem key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
