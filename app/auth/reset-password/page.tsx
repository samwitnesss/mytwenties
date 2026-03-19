'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

function ResetPasswordInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [exchanging, setExchanging] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function exchangeCode() {
      const code = searchParams.get('code')
      if (!code) {
        setError('Invalid or expired reset link. Please request a new one.')
        setExchanging(false)
        return
      }

      try {
        const supabase = createClient()
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          setError('This reset link has expired. Please request a new one.')
        }
      } catch {
        setError('Something went wrong. Please request a new reset link.')
      }
      setExchanging(false)
    }

    exchangeCode()
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password || !confirmPassword) {
      setError('Please fill in both fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        setError(updateError.message || 'Failed to update password. Please try again.')
        setLoading(false)
        return
      }

      setSuccess(true)
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
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="animate-pulse-glow" style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(50px)'
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '420px' }}>
        {exchanging ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', margin: '0 auto 16px',
              border: '3px solid #e2e8f0', borderTopColor: '#2563eb',
              animation: 'spin-slow 0.8s linear infinite'
            }} />
            <p style={{ color: 'var(--brand-text-mid)', fontSize: '0.9rem' }}>
              Verifying reset link&hellip;
            </p>
          </div>
        ) : success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px', margin: '0 auto 1.5rem',
              background: 'rgba(34,197,94,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem'
            }}>
              ✓
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', color: 'var(--brand-text)' }}>
              Password{' '}
              <span className="gradient-text">updated</span>
            </h1>
            <p style={{ color: 'var(--brand-text-mid)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Your password has been reset. You can now log in with your new password.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="gradient-btn"
              style={{
                width: '100%', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff',
                padding: '1rem', borderRadius: '12px', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              Log In →
            </button>
          </div>
        ) : error && !password ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px', margin: '0 auto 1.5rem',
              background: 'rgba(220,38,38,0.08)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem'
            }}>
              !
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', color: 'var(--brand-text)' }}>
              Link expired
            </h1>
            <p style={{ color: 'var(--brand-text-mid)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {error}
            </p>
            <Link
              href="/login"
              className="gradient-btn"
              style={{
                display: 'block', width: '100%', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff',
                padding: '1rem', borderRadius: '12px', border: 'none', textAlign: 'center',
                textDecoration: 'none', fontFamily: 'inherit'
              }}
            >
              Back to Login →
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)',
                borderRadius: '100px', padding: '6px 16px', marginBottom: '1.5rem',
                fontSize: '0.8rem', color: '#2563eb', letterSpacing: '0.05em', fontWeight: 600
              }}>
                Almost done
              </div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', color: 'var(--brand-text)' }}>
                Set a new{' '}
                <span className="gradient-text">password</span>
              </h1>
              <p style={{ color: 'var(--brand-text-mid)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Choose a new password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--brand-text-muted)', marginBottom: '8px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
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

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--brand-text-muted)', marginBottom: '8px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
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
                {loading ? 'Updating...' : 'Update Password →'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordInner />
    </Suspense>
  )
}
