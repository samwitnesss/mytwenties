'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function CompleteInner() {
  const params = useSearchParams()
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPhoneForm, setShowPhoneForm] = useState(false)
  const [userId, setUserId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const uid = params.get('userId')
    const fn = params.get('firstName')
    const em = params.get('email')
    const needsPhone = params.get('needsPhone')

    if (!uid || !fn || !em) {
      router.replace('/start?error=incomplete')
      return
    }

    setUserId(uid)
    setFirstName(fn)
    setEmail(em)

    if (needsPhone === '1') {
      setShowPhoneForm(true)
    } else {
      // No phone needed — set localStorage and continue
      localStorage.setItem('mt_user_id', uid)
      localStorage.setItem('mt_first_name', fn)
      localStorage.setItem('mt_email', em)
      router.replace('/assessment')
    }
  }, [params, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!phone.trim()) {
      setError('Please enter your phone number.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, phone: phone.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      // Phone saved — set localStorage and continue
      localStorage.setItem('mt_user_id', userId)
      localStorage.setItem('mt_first_name', firstName)
      localStorage.setItem('mt_email', email)
      router.replace('/begin')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (!showPhoneForm) {
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

  return (
    <main style={{
      backgroundColor: 'var(--brand-bg)', minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background orb */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="animate-pulse-glow" style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(50px)'
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px' }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '1.5rem',
            fontSize: '0.8rem', color: '#2563eb', letterSpacing: '0.05em', fontWeight: 600
          }}>
            One more thing
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', color: 'var(--brand-text)' }}>
            Hey {firstName} — what&apos;s your{' '}
            <span className="gradient-text">number?</span>
          </h1>
          <p style={{ color: 'var(--brand-text-mid)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            We&apos;ll only use this to send you your results and follow up if you want.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--brand-text-muted)', marginBottom: '8px' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(+61) 4XX XXX XXX"
              autoComplete="tel"
              autoFocus
              style={{
                width: '100%', padding: '14px 16px',
                background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
                borderRadius: '12px', color: 'var(--brand-text)', fontSize: '1rem',
                outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = 'var(--brand-border)'}
            />
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.85rem', padding: '10px 14px', background: 'rgba(220,38,38,0.06)', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.15)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gradient-btn"
            style={{
              fontSize: '1.05rem', fontWeight: 700, color: '#ffffff',
              padding: '1rem', borderRadius: '12px', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem',
              opacity: loading ? 0.7 : 1, fontFamily: 'inherit'
            }}
          >
            {loading ? 'Saving...' : 'Continue →'}
          </button>
        </form>
      </div>
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
