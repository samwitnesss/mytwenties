'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email.')
      return
    }
    setLoading(true)
    setError('')

    try {
      // Look up user by email
      const res = await fetch('/api/users/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })
      const data = await res.json()

      if (!res.ok || !data.userId) {
        setError("We couldn't find an account with that email. Have you taken the assessment yet?")
        setLoading(false)
        return
      }

      localStorage.setItem('mt_user_id', data.userId)
      localStorage.setItem('mt_first_name', data.firstName)
      localStorage.setItem('mt_email', data.email)

      // Route based on report state
      if (data.reportId) {
        localStorage.setItem('mt_report_id', data.reportId)
        router.push(`/report/ready/${data.reportId}`)
      } else if (data.pendingReportId) {
        router.push('/generating')
      } else {
        setError('no_report')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main style={{
      backgroundColor: 'var(--brand-bg)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.35
        }} />
        <div className="animate-pulse-glow" style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.08) 0%, transparent 65%)',
          filter: 'blur(50px)', borderRadius: '50%'
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'var(--brand-text-mid)', fontSize: '0.85rem', textDecoration: 'none',
          marginBottom: '2rem'
        }}>
          ← Back
        </Link>

        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '1.5rem',
            fontSize: '0.78rem', color: '#2563eb', letterSpacing: '0.05em', fontWeight: 600
          }}>
            Welcome back
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', color: 'var(--brand-text)' }}>
            Access your{' '}
            <span className="gradient-text">report</span>
          </h1>
          <p style={{ color: 'var(--brand-text-mid)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Enter the email you used when you took the assessment.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--brand-text-muted)', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
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

          {error === 'no_report' ? (
            <div style={{
              fontSize: '0.875rem', padding: '14px 16px',
              background: 'rgba(37,99,235,0.06)', borderRadius: '10px',
              border: '1px solid rgba(37,99,235,0.2)', lineHeight: 1.6,
              color: 'var(--brand-text-muted)'
            }}>
              You have an account but haven&apos;t completed the assessment yet.{' '}
              <Link href="/assessment" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                Continue the assessment →
              </Link>
            </div>
          ) : error ? (
            <div style={{
              color: '#dc2626', fontSize: '0.85rem', padding: '10px 14px',
              background: 'rgba(220,38,38,0.06)', borderRadius: '8px',
              border: '1px solid rgba(220,38,38,0.15)', lineHeight: 1.5
            }}>
              {error}
              {error.includes("taken the assessment") && (
                <span> <Link href="/start" style={{ color: '#2563eb', fontWeight: 600 }}>Start it here →</Link></span>
              )}
            </div>
          ) : null}

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
            {loading ? 'Looking up your account...' : 'Access My Report →'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--brand-text-subtle)' }}>
          Never taken the assessment?{' '}
          <Link href="/start" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Start here →
          </Link>
        </p>
      </div>
    </main>
  )
}
