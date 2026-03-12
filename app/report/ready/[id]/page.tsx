'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function ReportReadyPage() {
  const router = useRouter()
  const params = useParams()
  const reportId = params.id as string
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('mt_first_name')
    if (stored) setFirstName(stored)
  }, [])

  return (
    <main style={{
      backgroundColor: '#ffffff', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden'
    }}>
      {/* Dot grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
        backgroundSize: '28px 28px', opacity: 0.35
      }} />

      {/* Blue glow */}
      <div className="animate-pulse-glow" style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(37,99,235,0.08) 0%, transparent 65%)',
        filter: 'blur(60px)', borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '480px', textAlign: 'center' }}>

        {/* Checkmark icon */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 2rem',
          background: 'rgba(37,99,235,0.08)', border: '2px solid rgba(37,99,235,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: '100px', padding: '5px 14px', marginBottom: '1.5rem',
          fontSize: '0.72rem', color: '#2563eb', letterSpacing: '0.06em',
          textTransform: 'uppercase', fontWeight: 700
        }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
          Assessment Complete
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(1.7rem, 5vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1,
          letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '1rem'
        }}>
          Your MyTwenties Report{' '}
          <span className="gradient-text">Is Ready</span>
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: '1rem', color: '#64748b', lineHeight: 1.7,
          maxWidth: '380px', margin: '0 auto 2.5rem'
        }}>
          Your personalised profile has been built. Take your time with what&apos;s inside — it was written specifically for you.
        </p>

        {/* Primary CTA */}
        <Link href={`/report/${reportId}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '0.875rem' }}>
          <button className="gradient-btn" style={{
            width: '100%', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff',
            padding: '1rem', borderRadius: '14px', border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(37,99,235,0.28)', fontFamily: 'inherit'
          }}>
            View My Report →
          </button>
        </Link>

        {/* Secondary CTA */}
        <Link href="/assessment" style={{ textDecoration: 'none', display: 'block', marginBottom: '2.5rem' }}>
          <button style={{
            width: '100%', fontSize: '0.9rem', fontWeight: 600, color: '#64748b',
            padding: '0.875rem', borderRadius: '14px', border: '1px solid #e2e8f0',
            background: '#ffffff', cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
          }}>
            Retake Assessment
          </button>
        </Link>

        {/* Identity chip */}
        {firstName && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: '#f8faff', border: '1px solid #e2e8f0',
            borderRadius: '100px', padding: '8px 16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: '#2563eb'
            }}>
              {firstName[0].toUpperCase()}
            </div>
            <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 500 }}>
              {firstName} &middot; Assessment Complete
            </span>
          </div>
        )}
      </div>
    </main>
  )
}
