export type BundlerConfig = {
  rpcUrl: string
  maxTransactionsPerBundle: number
  priorityFee: number
  bundleInterval: number
  autoBundle: boolean
  gasLimit: number
  bundlerMode: string // Add this new field
}

export type BundlerStats = {
  totalBundles: number
  totalTransactions: number
  averageGasUsed: number
  totalFeeSaved: number
  successRate: number
  lastBundleTime: Date | null
}

export type BundlerTransaction = {
  id: string
  hash: string
  status: "pending" | "completed" | "failed"
  timestamp: Date
  gasUsed: number
  fee: number
  bundleId: string
}

export type ActivityLog = {
  id: string
  timestamp: Date
  type: "info" | "warning" | "error" | "success"
  message: string
}

export type Bundle = {
  id: string
  timestamp: Date
  status: "pending" | "completed" | "failed"
  transactionCount: number
  gasUsed: number
  fee: number
}

export type Wallet = {
  id: string
  address: string
  balance: number
  selected: boolean
}

// Add a new type for bundler modes
export type BundlerMode = {
  id: string
  name: string
  description: string
  color: string
}
