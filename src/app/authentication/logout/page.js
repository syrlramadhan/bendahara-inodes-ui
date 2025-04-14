'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    // Hapus token
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    // Redirect ke halaman login
    router.push('/authentication/sign-in')
  }, [router])

  return null
} 