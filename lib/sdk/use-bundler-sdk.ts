"use client"

import { useState, useEffect } from "react"
import { getBundlerSDK } from "./index"
import type { PlatformType, BundlerSDK, PlatformSettings } from "./interfaces"

interface UseBundlerSDKOptions {
  platform: PlatformType
  platformSettings: PlatformSettings
}

export function useBundlerSDK({ platform, platformSettings }: UseBundlerSDKOptions): {
  sdk: BundlerSDK | null
  loading: boolean
  error: string | null
} {
  const [sdk, setSdk] = useState<BundlerSDK | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    try {
      const bundlerSdk = getBundlerSDK(platform, platformSettings)
      setSdk(bundlerSdk)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to initialize SDK")
    } finally {
      setLoading(false)
    }
  }, [platform, platformSettings])

  return { sdk, loading, error }
}
