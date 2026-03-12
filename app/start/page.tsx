'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

function StartPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) {
      const messages: Record<string, string> = {
        auth_failed: 'Google sign-in failed. Please try again.',
        no_code: 'Sign-in was cancelled. Please try again.',
        user_creation_failed: 'Could not create your account. Please try again.',
        unexpected: 'Something went wrong. Please try again.',
        incomplete: 'Sign-in incomplete. Please try again.',
      }
      setError(messages[urlError] ?? 'Sign-in failed. Please try again.')
    }
  }, [searchParams])

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` }
      })
      if (oauthError) {
        setError('Google sign-in failed. Please try again.')
        setGoogleLoading(false)
      }
      // On success, browser redirects to Google — no further action needed here
    } catch {
      setError('Something went wrong. Please try again.')
      setGoogleLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim() || !email.trim()) {
      setError('Please fill in both fields.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: firstName.trim(), email: email.trim() })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      localStorage.setItem('mt_user_id', data.userId)
      localStorage.setItem('mt_first_name', data.firstName)
      localStorage.setItem('mt_email', data.email)
      router.push('/begin')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main style={{ backgroundColor: 'var(--brand-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="animate-pulse-glow" style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(50px)'
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px' }}>
        {/* Back link */}
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'var(--brand-text-mid)', fontSize: '0.85rem', textDecoration: 'none',
          marginBottom: '2rem', transition: 'color 0.2s'
        }}>
          ← Back
        </Link>

        {/* Brand */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '1.5rem',
            fontSize: '0.8rem', color: '#2563eb', letterSpacing: '0.05em', fontWeight: 600
          }}>
            Step 1 of 1 to begin
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', color: 'var(--brand-text)' }}>
            Let&apos;s find out what you&apos;re{' '}
            <span className="gradient-text">built for.</span>
          </h1>
          <p style={{ color: 'var(--brand-text-mid)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            We&apos;ll use your name to personalise your report.
          </p>
        </div>

        {/* Google sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          style={{
            width: '100%', padding: '13px 16px', marginBottom: '1rem',
            background: 'var(--brand-card)', border: '1.5px solid var(--brand-border)',
            borderRadius: '12px', cursor: googleLoading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            fontSize: '0.95rem', fontWeight: 600, color: 'var(--brand-text)', fontFamily: 'inherit',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            opacity: googleLoading ? 0.7 : 1,
            transition: 'box-shadow 0.2s, border-color 0.2s'
          }}
          onMouseEnter={e => { if (!googleLoading) (e.currentTarget as HTMLButtonElement).style.borderColor = '#3b82f6' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brand-border)' }}
        >
          {/* Google G icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--brand-border)' }} />
          <span style={{ color: 'var(--brand-text-subtle)', fontSize: '0.78rem', fontWeight: 500 }}>or continue with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--brand-border)' }} />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--brand-text-muted)', marginBottom: '8px' }}>
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Your first name"
              autoComplete="given-name"
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
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
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
            disabled={loading || googleLoading}
            className="gradient-btn"
            style={{
              fontSize: '1.05rem', fontWeight: 700, color: '#ffffff',
              padding: '1rem', borderRadius: '12px', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem',
              opacity: loading ? 0.7 : 1, fontFamily: 'inherit'
            }}
          >
            {loading ? 'Starting...' : 'Begin →'}
          </button>
        </form>

        <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--brand-text-subtle)', lineHeight: 1.6 }}>
          Your responses are private. We don&apos;t share your data.
        </p>
      </div>
    </main>
  )
}

export default function StartPage() {
  return (
    <Suspense>
      <StartPageInner />
    </Suspense>
  )
}
