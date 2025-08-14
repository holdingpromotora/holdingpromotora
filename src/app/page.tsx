'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen banking-gradient flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-banking-neon-blue mx-auto mb-4"></div>
        <p className="text-xl">Redirecionando para o login...</p>
      </div>
    </div>
  )
}
