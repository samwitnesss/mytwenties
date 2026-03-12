'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function CompleteInner() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const userId = params.get('userId')
    const firstName = params.get('firstName')
    const email = params.get('email')

    if (userId && firstName && email) {
      localStorage.setItem('mt_user_id', userId)
      localStorage.setItem('mt_first_name', firstName)
      localStorage.setItem('mt_email', email)
      router.replace('/assessment')
    } else {
      router.replace('/start?error=incomplete')
    }
  }, [params, router])

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: '#ffffff', gap: '16px'
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        border: '3px solid #e2e8f0', borderTopColor: '#2563eb',
        animation: 'spin-slow 0.8s linear infinite'
      }} />
      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Setting up your account&hellip;</p>
    </main>
  )
}

export default function AuthComplete() {
  return (
    <Suspense>
      <CompleteInner />
    </Suspense>
  )
}
