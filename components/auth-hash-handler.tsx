'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export function AuthHashHandler() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const urlParams = new URLSearchParams(hash.substring(1))
    const accessToken = urlParams.get('access_token')

    if (accessToken) {
      // Implicit-flow hash token (e.g. from inviteUserByEmail).
      // Forward to the callback page which handles it via /api/auth/exchange.
      router.replace(`/${locale}/auth/callback${hash}`)
    }
  }, [router, locale])

  return null
}
