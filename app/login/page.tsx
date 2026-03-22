'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showChoice, setShowChoice] = useState(false)
  const [choiceData, setChoiceData] = useState<{ firstName: string; reportId: string } | null>(null)
  const [showForgot, setShowForgot] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    setError('')

    try {
      // Authenticate with Supabase
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (signInError) {
        if (signInError.message?.toLowerCase().includes('invalid login')) {
          setError('Incorrect email or password. Please try again.')
        } else {
          setError(signInError.message || 'Login failed. Please try again.')
        }
        setLoading(false)
        return
      }

      // Authenticated — look up user in mytwenties_users
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

      // Accelerator users with a report get a choice screen
      if (data.tier === 'accelerator' && data.reportId) {
        localStorage.setItem('mt_report_id', data.reportId)
        setChoiceData({ firstName: data.firstName, reportId: data.reportId })
        setShowChoice(true)
        setLoading(false)
        return
      }

      // Route based on report state + tier
      if (data.reportId) {
        localStorage.setItem('mt_report_id', data.reportId)
        router.push(`/report/ready/${data.reportId}`)
      } else if (data.pendingReportId) {
        router.push('/generating')
      } else if (data.tier === 'accelerator') {
        router.push('/portal')
      } else {
        setError('no_report')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email first.')
      return
    }
    setResetLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password` }
      )

      if (resetError) {
        setError(resetError.message || 'Failed to send reset email. Please try again.')
        setResetLoading(false)
        return
      }

      setResetSent(true)
      setResetLoading(false)
    } catch {
      setError('Something went wrong. Please try again.')
      setResetLoading(false)
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

        {showChoice && choiceData ? (
          <>
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)',
                borderRadius: '100px', padding: '6px 16px', marginBottom: '1.5rem',
                fontSize: '0.78rem', color: '#2563eb', letterSpacing: '0.05em', fontWeight: 600
              }}>
                Welcome back, {choiceData.firstName}
              </div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', color: 'var(--brand-text)' }}>
                Where would you like{' '}
                <span className="gradient-text">to go?</span>
              </h1>
              <p style={{ color: 'var(--brand-text-mid)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Choose where you&apos;d like to pick up.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button
                onClick={() => router.push(`/report/ready/${choiceData.reportId}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '20px 22px', borderRadius: '14px',
                  border: '1.5px solid var(--brand-border)', background: 'var(--brand-card)',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#3b82f6'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(37,99,235,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--brand-border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(37,99,235,0.08)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0
                }}>
                  📊
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--brand-text)' }}>
                    View My Report
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--brand-text-mid)' }}>
                    Your personalised MyTwenties profile
                  </p>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--brand-text-mid)', fontSize: '1.2rem' }}>→</span>
              </button>

              <button
                onClick={() => router.push('/portal')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '20px 22px', borderRadius: '14px',
                  border: '1.5px solid rgba(37,99,235,0.3)', background: 'rgba(37,99,235,0.04)',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#2563eb'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(37,99,235,0.15)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', flexShrink: 0
                }}>
                  🚀
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--brand-text)' }}>
                    Accelerator Portal
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--brand-text-mid)' }}>
                    Your coaching assets & roadmap
                  </p>
                </div>
                <span style={{ marginLeft: 'auto', color: '#2563eb', fontSize: '1.2rem' }}>→</span>
              </button>
            </div>
          </>
        ) : (
          <>
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
                Log in with your email and password.
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

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--brand-text-muted)' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setShowForgot(true); setError(''); setResetSent(false) }}
                    style={{
                      background: 'none', border: 'none', color: '#2563eb',
                      fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
                      fontFamily: 'inherit', padding: 0
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
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
                {loading ? 'Logging in...' : 'Log In →'}
              </button>
            </form>

            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--brand-text-subtle)' }}>
              Never taken the assessment?{' '}
              <Link href="/start" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                Start here →
              </Link>
            </p>

            {/* Forgot password overlay */}
            {showForgot && (
              <div style={{
                position: 'fixed', inset: 0, zIndex: 50,
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1.5rem'
              }}
                onClick={e => { if (e.target === e.currentTarget) setShowForgot(false) }}
              >
                <div style={{
                  background: 'var(--brand-bg)', borderRadius: '16px',
                  padding: '2rem', width: '100%', maxWidth: '400px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }}>
                  {resetSent ? (
                    <>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        background: 'rgba(34,197,94,0.1)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.4rem', marginBottom: '1.25rem'
                      }}>
                        ✓
                      </div>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '0.5rem' }}>
                        Check your email
                      </h2>
                      <p style={{ color: 'var(--brand-text-mid)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        We sent a password reset link to{' '}
                        <strong style={{ color: 'var(--brand-text)' }}>{email}</strong>.
                        Click the link in the email to set a new password.
                      </p>
                      <button
                        type="button"
                        onClick={() => { setShowForgot(false); setResetSent(false) }}
                        className="gradient-btn"
                        style={{
                          width: '100%', fontSize: '1rem', fontWeight: 700, color: '#ffffff',
                          padding: '0.85rem', borderRadius: '12px', border: 'none',
                          cursor: 'pointer', fontFamily: 'inherit'
                        }}
                      >
                        Back to Login
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '0.5rem' }}>
                        Reset your password
                      </h2>
                      <p style={{ color: 'var(--brand-text-mid)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        Enter your email and we&apos;ll send you a link to reset your password.
                      </p>
                      <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                        {error && (
                          <p style={{ color: '#dc2626', fontSize: '0.85rem', padding: '10px 14px', background: 'rgba(220,38,38,0.06)', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.15)', margin: 0 }}>
                            {error}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={resetLoading}
                          className="gradient-btn"
                          style={{
                            width: '100%', fontSize: '1rem', fontWeight: 700, color: '#ffffff',
                            padding: '0.85rem', borderRadius: '12px', border: 'none',
                            cursor: resetLoading ? 'not-allowed' : 'pointer',
                            opacity: resetLoading ? 0.7 : 1, fontFamily: 'inherit'
                          }}
                        >
                          {resetLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <button
                          type="button"
                          onClick={() => { setShowForgot(false); setError('') }}
                          style={{
                            background: 'none', border: 'none', color: 'var(--brand-text-mid)',
                            fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit',
                            padding: '4px 0'
                          }}
                        >
                          ← Back to login
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
