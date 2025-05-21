'use client'

import React, { useEffect, useState } from 'react'
import i18n from '@/i18n/i18n'

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(i18n.isInitialized)

  useEffect(() => {
    const handleInit = () => setReady(true)

    if (!i18n.isInitialized) {
      i18n.on('initialized', handleInit)
    }

    return () => {
      i18n.off('initialized', handleInit)
    }
  }, [])

  if (!ready) return null

  return <>{children}</>
}
