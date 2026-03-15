'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function BeginPage() {
  const router = useRouter()
  const [ageConfirmed, setAgeConfirmed] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('mt_user_id')) {
      router.push('/start')
    }
  }, [router])

  return (
    <main style={{
      backgroundColor: 'var(--brand-bg)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden'
    }}>
      {/* Soft glow */}
      <div className="animate-pulse-glow" style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(37,99,235,0.07) 0%, transparent 65%)',
        filter: 'blur(50px)', borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '480px' }}>

        {/* Badge */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)',
            borderRadius: '100px', padding: '6px 18px',
            fontSize: '0.73rem', color: '#2563eb', letterSpacing: '0.07em',
            textTransform: 'uppercase', fontWeight: 700
          }}>
            Before you begin
          </div>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: 900, lineHeight: 1.1,
          letterSpacing: '-0.03em', color: 'var(--brand-text)', textAlign: 'center', marginBottom: '0.75rem'
        }}>
          Find somewhere quiet.<br />
          <span className="gradient-text">This is worth your full attention.</span>
        </h1>

        <p style={{
          textAlign: 'center', color: 'var(--brand-text-mid)', fontSize: '1rem',
          lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem'
        }}>
          The more honestly you answer, the more accurately your report will reflect who you actually are.
        </p>

        {/* Info cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            { icon: '⏱', label: 'Takes about 25 minutes', sub: 'Don\'t rush it — your answers shape your entire report' },
            { icon: '🔒', label: 'Your answers are private', sub: 'Never shared, never sold. You can delete your data anytime.' },
            { icon: '✏️', label: 'There are no right answers', sub: 'Answer as you actually are, not as you think you should be.' },
          ].map(({ icon, label, sub }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'flex-start', gap: '1rem',
              background: 'var(--brand-bg-subtle)', borderRadius: '14px', padding: '1rem 1.25rem',
              border: '1px solid var(--brand-border)'
            }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-text)', margin: '0 0 2px' }}>{label}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--brand-text-mid)', margin: 0, lineHeight: 1.5 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Age checkbox */}
        <label style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          cursor: 'pointer', marginBottom: '1.75rem',
          background: 'var(--brand-bg-subtle)', borderRadius: '12px', padding: '0.875rem 1.25rem',
          border: `1px solid ${ageConfirmed ? 'rgba(37,99,235,0.3)' : 'var(--brand-border)'}`,
          transition: 'border-color 0.2s'
        }}>
          <div
            onClick={() => setAgeConfirmed(v => !v)}
            style={{
              width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
              background: ageConfirmed ? 'linear-gradient(135deg, #2563eb, #06b6d4)' : 'var(--brand-card)',
              border: ageConfirmed ? 'none' : '2px solid var(--brand-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s ease', cursor: 'pointer'
            }}
          >
            {ageConfirmed && (
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--brand-text-strong)', fontWeight: 500, userSelect: 'none' }}
            onClick={() => setAgeConfirmed(v => !v)}>
            I confirm I am 18 years or older
          </span>
        </label>

        {/* CTA */}
        <button
          className="gradient-btn"
          disabled={!ageConfirmed}
          onClick={() => router.push('/assessment')}
          style={{
            width: '100%', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff',
            padding: '1rem', borderRadius: '14px', border: 'none',
            cursor: ageConfirmed ? 'pointer' : 'not-allowed',
            opacity: ageConfirmed ? 1 : 0.45,
            boxShadow: ageConfirmed ? '0 8px 30px rgba(37,99,235,0.3)' : 'none',
            transition: 'all 0.2s ease', fontFamily: 'inherit'
          }}
        >
          I&apos;m ready — let&apos;s begin →
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--brand-text-subtle)', lineHeight: 1.6 }}>
          By continuing you agree to our{' '}
          <a href="/privacy" style={{ color: '#2563eb', textDecoration: 'none' }}>Privacy Policy</a>
          {' '}and{' '}
          <a href="/terms" style={{ color: '#2563eb', textDecoration: 'none' }}>Terms of Use</a>
        </p>

      </div>
    </main>
  )
}
