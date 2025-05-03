"use client"

import type React from "react"
import { useState, useRef } from "react"
import { getBundlerSDK } from "../index"
import type { PlatformType } from "../types"

export default function BackupRestoreExample() {
  const [platform, setPlatform] = useState<PlatformType>("raydium")
  const [status, setStatus] = useState<{ type: "success" | "error" | "info" | null; message: string }>({
    type: null,
    message: "",
  })
  const [restoreOptions, setRestoreOptions] = useState({
    clearExisting: false,
    restoreTokens: true,
    restorePositions: true,
    restoreTransactions: true,
    restoreSettings: true,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize SDK
  const sdk = getBundlerSDK(platform, "https://api.example.com")

  // Create and download backup
  const handleCreateBackup = () => {
    try {
      sdk.downloadBackup()
      setStatus({
        type: "success",
        message: "Backup created and downloaded successfully!",
      })
    } catch (error) {
      setStatus({
        type: "error",
        message: `Error creating backup: ${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  // Handle file selection for restore
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setStatus({
      type: "info",
      message: `Selected file: ${file.name}`,
    })
  }

  // Restore from file
  const handleRestore = async () => {
    const files = fileInputRef.current?.files
    if (!files || files.length === 0) {
      setStatus({
        type: "error",
        message: "Please select a backup file first",
      })
      return
    }

    const file = files[0]
    setStatus({
      type: "info",
      message: "Restoring from backup...",
    })

    try {
      const result = await sdk.restoreFromFile(file, restoreOptions)

      if (result.success) {
        setStatus({
          type: "success",
          message: `${result.message}. Restored: ${result.restored.tokens} tokens, ${result.restored.positions} positions, ${result.restored.transactions} transactions, ${result.restored.settings} settings.`,
        })
      } else {
        setStatus({
          type: "error",
          message: result.message,
        })
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: `Error restoring backup: ${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  // Handle option changes
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    setRestoreOptions((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Bundler SDK Backup & Restore</h1>

      {/* Platform Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as PlatformType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="raydium">Raydium</option>
          <option value="pump">Pump</option>
          <option value="bnb">BNB Chain</option>
        </select>
      </div>

      {/* Backup Section */}
      <div className="mb-6 p-4 border border-gray-200 rounded-md">
        <h2 className="text-lg font-semibold mb-4">Create Backup</h2>
        <p className="text-sm text-gray-600 mb-4">
          This will create a backup of all your data and download it as a JSON file.
        </p>
        <button
          onClick={handleCreateBackup}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Download Backup
        </button>
      </div>

      {/* Restore Section */}
      <div className="mb-6 p-4 border border-gray-200 rounded-md">
        <h2 className="text-lg font-semibold mb-4">Restore from Backup</h2>

        {/* File Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Backup File</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Restore Options */}
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Restore Options</h3>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="clearExisting"
                checked={restoreOptions.clearExisting}
                onChange={handleOptionChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Clear existing data before restore</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="restoreTokens"
                checked={restoreOptions.restoreTokens}
                onChange={handleOptionChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Restore tokens</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="restorePositions"
                checked={restoreOptions.restorePositions}
                onChange={handleOptionChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Restore positions</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="restoreTransactions"
                checked={restoreOptions.restoreTransactions}
                onChange={handleOptionChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Restore transactions</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="restoreSettings"
                checked={restoreOptions.restoreSettings}
                onChange={handleOptionChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Restore settings</span>
            </label>
          </div>
        </div>

        {/* Restore Button */}
        <button
          onClick={handleRestore}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Restore from Backup
        </button>
      </div>

      {/* Status Messages */}
      {status.type && (
        <div
          className={`p-4 rounded-md ${
            status.type === "success"
              ? "bg-green-50 text-green-800"
              : status.type === "error"
                ? "bg-red-50 text-red-800"
                : "bg-blue-50 text-blue-800"
          }`}
        >
          <p>{status.message}</p>
        </div>
      )}
    </div>
  )
}
