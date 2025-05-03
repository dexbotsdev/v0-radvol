import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

interface ActivityLog {
  timestamp: string
  message: string
  type: "info" | "success" | "warning" | "error"
  details?: string
}

export function ActivityLogItem({ log }: { log: ActivityLog }) {
  const getIcon = () => {
    switch (log.type) {
      case "info":
        return <Info size={12} className="text-blue-400" />
      case "success":
        return <CheckCircle size={12} className="text-green-400" />
      case "warning":
        return <AlertTriangle size={12} className="text-yellow-400" />
      case "error":
        return <AlertCircle size={12} className="text-red-400" />
      default:
        return <Info size={12} className="text-blue-400" />
    }
  }

  const getBgColor = () => {
    switch (log.type) {
      case "info":
        return "bg-blue-900/10 border-blue-900/30"
      case "success":
        return "bg-green-900/10 border-green-900/30"
      case "warning":
        return "bg-yellow-900/10 border-yellow-900/30"
      case "error":
        return "bg-red-900/10 border-red-900/30"
      default:
        return "bg-gray-800/20 border-gray-800/30"
    }
  }

  return (
    <div className={`p-2 rounded-md border ${getBgColor()}`}>
      <div className="flex items-start">
        <div className="mt-0.5 mr-1.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium truncate">{log.message}</p>
            <span className="text-2xs text-gray-500 ml-2 whitespace-nowrap">{log.timestamp}</span>
          </div>
          {log.details && <p className="text-2xs text-gray-400 mt-0.5">{log.details}</p>}
        </div>
      </div>
    </div>
  )
}
