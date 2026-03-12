'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const DISCOVERED_ITEMS = [
  { threshold: 20, label: 'Archetype mapped' },
  { threshold: 40, label: 'Strength Stack identified' },
  { threshold: 60, label: 'Blind spots surfaced' },
  { threshold: 80, label: 'Direction Compass built' },
  { threshold: 95, label: 'Your report is ready' },
]

const MESSAGES = [
  'Mapping your archetype...',
  'Identifying your hidden dynamics...',
  'Building your direction compass...',
  'Writing your personalised report...',
  'Calculating your energy patterns...',
  'Analysing your relationships...',
  'Finding your famous parallels...',
  'Almost there...'
]

const TESTIMONIALS = [
  '"This is the most accurate thing I\'ve ever read about myself."',
  '"I genuinely teared up reading my report. It felt like someone finally understood me."',
  '"I sent this to my mum and she said \'that\'s exactly you.\'"',
  '"I\'ve done Myers-Briggs, Enneagram, all of it. Nothing comes close to this."',
  '"I screenshot half the report and put it on my story."',
  '"I didn\'t expect a free tool to go this deep. I upgraded immediately."',
]

export default function GeneratingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [testimonialKey, setTestimonialKey] = useState(0)
  const [revealed, setRevealed] = useState<string[]>([])
  const circumference = 2 * Math.PI * 45

  // Track reportId so we can redirect as soon as generation completes
  const reportIdRef = useRef<string | null>(null)
  const redirectedRef = useRef(false)

  function doRedirect(reportId: string) {
    if (redirectedRef.current) return
    redirectedRef.current = true
    setProgress(100)
    setTimeout(() => {
      router.push(`/report/ready/${reportId}`)
    }, 600)
  }

  useEffect(() => {
    const userId = localStorage.getItem('mt_user_id')
    const firstName = localStorage.getItem('mt_first_name')

    if (!userId) {
      router.push('/')
      return
    }

    // Kick off report generation
    fetch('/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, firstName }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.reportId) {
          reportIdRef.current = data.reportId
          doRedirect(data.reportId)
        }
      })
      .catch(() => {
        // Fall back to polling below
      })

    // Visual progress animation — runs for up to 120s, caps at 95
    const startTime = Date.now()
    const MAX_VISUAL_DURATION = 120000

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      // Logarithmic curve: fast early, slows to cap at 95%
      const raw = Math.min((elapsed / MAX_VISUAL_DURATION) * 100, 95)
      // Make it feel like progress — faster to 70%, then slow
      const pct = elapsed < 16000
        ? Math.min((elapsed / 16000) * 70, 70)
        : 70 + Math.min(((elapsed - 16000) / (MAX_VISUAL_DURATION - 16000)) * 25, 25)

      setProgress(Math.min(pct, raw < pct ? raw : pct))

      setRevealed(prev => {
        const next = [...prev]
        for (const item of DISCOVERED_ITEMS) {
          const threshold = item.threshold
          if (Math.min(pct, raw < pct ? raw : pct) >= threshold && !next.includes(item.label)) {
            next.push(item.label)
          }
        }
        return next
      })
    }, 100)

    // Poll for readiness every 3s (backup if the generate call above failed/timed out)
    const pollInterval = setInterval(async () => {
      if (redirectedRef.current) return
      try {
        const res = await fetch(`/api/reports/status?userId=${userId}`)
        const data = await res.json()
        if (data.ready && data.reportId) {
          reportIdRef.current = data.reportId
          doRedirect(data.reportId)
        }
      } catch {
        // ignore
      }
    }, 3000)

    // Hard cap at 120s — redirect to status-based fallback
    const maxTimer = setTimeout(async () => {
      if (redirectedRef.current) return
      try {
        const res = await fetch(`/api/reports/status?userId=${userId}`)
        const data = await res.json()
        if (data.ready && data.reportId) {
          doRedirect(data.reportId)
        } else {
          router.push('/report/preview')
        }
      } catch {
        router.push('/report/preview')
      }
    }, 120000)

    // Message rotation every 2.5s
    const messageInterval = setInterval(() => {
      setMessageIndex(i => (i + 1) % MESSAGES.length)
    }, 2500)

    // Testimonial rotation every 4s
    const testimonialInterval = setInterval(() => {
      setTestimonialIndex(i => (i + 1) % TESTIMONIALS.length)
      setTestimonialKey(k => k + 1)
    }, 4000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(pollInterval)
      clearInterval(messageInterval)
      clearInterval(testimonialInterval)
      clearTimeout(maxTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const strokeOffset = circumference - (progress / 100) * circumference

  return (
    <main style={{
      backgroundColor: '#f8faff', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden'
    }}>
      {/* Subtle background orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="animate-pulse-glow" style={{
          position: 'absolute', top: '20%', left: '30%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(50px)'
        }} />
        <div className="animate-float-delayed" style={{
          position: 'absolute', bottom: '25%', right: '25%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)'
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '440px', width: '100%' }}>
        {/* Circular progress ring */}
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2rem' }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="45" fill="none" stroke="#e2e8f0" strokeWidth="4" />
            <circle
              cx="60" cy="60" r="45"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              style={{ transition: 'stroke-dashoffset 0.2s linear' }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>
          Building your report...
        </h1>

        {/* Rotating status message */}
        <p key={messageIndex} className="animate-fade-in" style={{
          fontSize: '1rem', color: '#0891b2', marginBottom: '1.75rem', minHeight: '1.5em'
        }}>
          {MESSAGES[messageIndex]}
        </p>

        {/* Accumulating discovered items */}
        {revealed.length > 0 && (
          <div style={{
            background: '#ffffff', borderRadius: '16px', padding: '1rem 1.25rem',
            border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            marginBottom: '1.5rem', textAlign: 'left'
          }}>
            {revealed.map(label => (
              <div key={label} className="animate-fade-in" style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '6px 0', borderBottom: '1px solid #f1f5f9'
              }}>
                <span style={{
                  width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6rem', color: '#2563eb', fontWeight: 800
                }}>✓</span>
                <span style={{ fontSize: '0.875rem', color: '#334155', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Rotating testimonials */}
        <div style={{
          background: '#ffffff', borderRadius: '16px', padding: '1.25rem 1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <p key={testimonialKey} className="animate-testimonial" style={{
            fontSize: '0.9rem', color: '#475569', lineHeight: 1.65, margin: 0,
            fontStyle: 'italic'
          }}>
            {TESTIMONIALS[testimonialIndex]}
          </p>
        </div>
      </div>
    </main>
  )
}
