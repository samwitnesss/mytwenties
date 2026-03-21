'use client'

import { useEffect, useMemo, useState } from 'react'
import ArchetypeRadar from '@/components/report/ArchetypeRadar'
import EnergyMap from '@/components/report/EnergyMap'
import StrengthStack from '@/components/report/StrengthStack'
import BlindSpotCard from '@/components/report/BlindSpotCard'
import DirectionCard from '@/components/report/DirectionCard'
import FamousParallel from '@/components/report/FamousParallel'
import ShareableCard from '@/components/report/ShareableCard'
import { MockReport } from '@/lib/mock-report'

const CARD = '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)'
const CARD_FEATURE = '0 16px 56px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)'
const CONTENT: React.CSSProperties = { maxWidth: '760px', margin: '0 auto', marginBottom: '3.5rem' }
const CONTENT_WIDE: React.CSSProperties = { maxWidth: '1100px', margin: '0 auto', marginBottom: '3.5rem' }

const CONFETTI_COLORS = ['#2563eb', '#06b6d4', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#ffffff']

function ConfettiEffect() {
  const pieces = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.8}s`,
    duration: `${2.5 + Math.random() * 2}s`,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: `${5 + Math.random() * 9}px`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
  })), [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: p.left, top: '-20px',
          width: p.size, height: p.size,
          background: p.color, borderRadius: p.borderRadius,
          animationDuration: p.duration, animationDelay: p.delay,
        }} />
      ))}
    </div>
  )
}

function UnlockBanner() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 700)
    return () => clearTimeout(t)
  }, [])

  function scrollToMap() {
    document.getElementById('full-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div
      onClick={scrollToMap}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transform: visible ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
        background: 'linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)',
        cursor: 'pointer',
        boxShadow: '0 4px 32px rgba(37,99,235,0.45)',
      }}
    >
      <div style={{
        maxWidth: '760px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '12px', padding: '14px 1.5rem',
      }}>
        <span style={{ fontSize: '1rem' }}>🔓</span>
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
          Your full map is unlocked!
        </span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
          Scroll down to see it
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'bounce-down 1.2s ease-in-out infinite' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <button
          onClick={e => { e.stopPropagation(); setDismissed(true) }}
          style={{
            position: 'absolute', right: '1rem',
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: '26px', height: '26px', cursor: 'pointer', color: '#ffffff',
            fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1
          }}
        >×</button>
      </div>
    </div>
  )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

function PaidGeneratingState({ reportId }: { reportId: string }) {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    // Trigger paid generation
    fetch('/api/reports/generate-paid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId }),
    }).catch(err => console.error('generate-paid fetch error:', err))

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots(d => d.length >= 3 ? '.' : d + '.')
    }, 600)

    // Poll for completion
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/reports/${reportId}/status`)
        if (!res.ok) return
        const { report_type } = await res.json()
        if (report_type === 'paid') {
          clearInterval(pollInterval)
          clearInterval(dotsInterval)
          window.location.reload()
        }
      } catch {
        // silent — keep polling
      }
    }, 3000)

    return () => {
      clearInterval(dotsInterval)
      clearInterval(pollInterval)
    }
  }, [reportId])

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0c3d5e 0%, #0d4f6b 50%, #083347 100%)',
      borderRadius: '28px', padding: '4rem 2rem', textAlign: 'center',
      border: '1px solid rgba(6,182,212,0.25)',
      boxShadow: '0 24px 80px rgba(6,182,212,0.12)',
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 2rem',
        background: 'rgba(6,182,212,0.15)', border: '2px solid rgba(6,182,212,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
      }}>⚡</div>
      <h3 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 900, color: '#ffffff', marginBottom: '0.75rem' }}>
        Building your full report{dots}
      </h3>
      <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 2rem' }}>
        Your Business Blueprint, Career Map, Highest Leverage Move, Reading List, Personal Mentor Prompt, and The Letter are being generated now. Usually takes 1–2 minutes.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: 'rgba(6,182,212,0.6)',
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
        This page will update automatically when ready
      </p>
      <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
        Having trouble? Email sam@mytwenties.app
      </p>
    </div>
  )
}

export default function ReportContent({ report, reportType = 'free', unlocked = false, paidPending = false }: { report: MockReport; reportType?: string; unlocked?: boolean; paidPending?: boolean }) {
  const isMobile = useIsMobile()
  const [firstName, setFirstName] = useState(report.firstName || 'You')
  const [unlocking, setUnlocking] = useState(false)
  const [showConfetti, setShowConfetti] = useState(unlocked && reportType === 'paid')
  const [isAccelerator, setIsAccelerator] = useState(false)

  useEffect(() => {
    // Only fall back to localStorage if the report does not include a name
    if (!report.firstName) {
      const stored = localStorage.getItem('mt_first_name')
      if (stored) setFirstName(stored)
    }
  }, [report.firstName])
  useEffect(() => {
    const userId = localStorage.getItem('mt_user_id')
    if (!userId) return
    fetch(`/api/portal/me?userId=${userId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.tier === 'accelerator') setIsAccelerator(true)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 4500)
      return () => clearTimeout(t)
    }
  }, [showConfetti])

  async function handleUnlock() {
    setUnlocking(true)
    try {
      const userId = localStorage.getItem('mt_user_id')
      const reportId = (report as MockReport & { id?: string }).id
        ?? window.location.pathname.split('/').pop()
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, userId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setUnlocking(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('mt_user_id')
    localStorage.removeItem('mt_first_name')
    localStorage.removeItem('mt_email')
    window.location.href = '/'
  }

  const archetypeMatch = Math.round(report.archetype.primary.score * 100)
  const topStrength = report.strengths[0]?.name ?? 'Identified'

  return (
    <main style={{ backgroundColor: 'var(--brand-bg)', minHeight: '100vh', color: 'var(--brand-text)', overflowX: 'hidden' }}>
      {showConfetti && <ConfettiEffect />}
      {unlocked && reportType === 'paid' && <UnlockBanner />}

      {/* HEADER */}
      <section style={{
        position: 'relative', padding: '5rem 2rem 4.5rem', textAlign: 'center',
        background: 'var(--brand-bg)', borderBottom: '1px solid var(--brand-border)', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.4
        }} />
        <div className="animate-pulse-glow" style={{
          position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '420px',
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.1) 0%, transparent 65%)',
          filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10,
          display: 'flex', gap: '8px', alignItems: 'center'
        }}>
          {isAccelerator && (
            <a href="/portal" style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
              borderRadius: '100px', padding: '7px 18px',
              fontSize: '0.8rem', color: '#ffffff', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(37,99,235,0.25)'
            }}>Accelerator →</a>
          )}
          <button onClick={handleLogout} style={{
            background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
            borderRadius: '100px', padding: '7px 18px',
            fontSize: '0.8rem', color: 'var(--brand-text-mid)', cursor: 'pointer',
            fontFamily: 'inherit', fontWeight: 500, boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>Log out</button>
        </div>

        <div style={{ position: 'relative', maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)',
            borderRadius: '100px', padding: '6px 18px', marginBottom: '2rem',
            fontSize: '0.73rem', color: '#2563eb', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700
          }}>
            MyTwenties · Personal Insights
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--brand-text-subtle)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            Generated {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.03em', color: 'var(--brand-text)', marginBottom: '1.25rem' }}>
            {firstName}&apos;s Insights
          </h1>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem',
            background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.22)',
            borderRadius: '100px', padding: '10px 24px'
          }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb' }}>{report.archetype.primary.name}</span>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--brand-text-mid)', background: 'var(--brand-track)', borderRadius: '100px', padding: '2px 8px' }}>
              {archetypeMatch}% match
            </span>
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', color: 'var(--brand-text-muted)', lineHeight: 1.7, fontStyle: 'italic', maxWidth: '580px', margin: '0 auto 2.5rem' }}>
            &ldquo;{report.identity_profile.headline}&rdquo;
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Top Strength', value: topStrength },
              { label: 'Archetype Match', value: `${archetypeMatch}%` },
              { label: 'Directions', value: `${report.directions.length} paths` },
              { label: 'Sections', value: '12 insights' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'var(--brand-bg-subtle)', border: '1px solid var(--brand-border)',
                borderRadius: '14px', padding: '0.875rem 1.25rem', textAlign: 'center', minWidth: '120px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <p style={{ fontSize: '0.63rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-text)', margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>

        {/* 01 · IDENTITY PROFILE */}
        <div style={CONTENT}>
          <SectionHeader label="01" title="Identity Profile" />
          <div style={{ background: 'var(--brand-card)', borderRadius: '24px', padding: '2.5rem', border: '1px solid var(--brand-border)', boxShadow: CARD_FEATURE }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(6,182,212,0.05) 100%)',
              borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '2rem',
              border: '1px solid rgba(37,99,235,0.18)', borderLeft: '4px solid #2563eb'
            }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Core Truth</p>
              <p style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.2rem)', color: 'var(--brand-text-strong)', lineHeight: 1.7, margin: 0, fontWeight: 600 }}>
                &ldquo;{report.identity_profile.core_truth}&rdquo;
              </p>
            </div>
            <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', lineHeight: 1.9, color: 'var(--brand-text-strong)', marginBottom: '2rem' }}>
              {report.identity_profile.summary}
            </p>
            <div style={{ height: '1px', background: 'var(--brand-border)', marginBottom: '1.5rem' }} />
            <div>
              <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Your Profile Tags</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {report.identity_profile.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: '0.85rem', color: '#2563eb', background: 'rgba(37,99,235,0.07)',
                    borderRadius: '100px', padding: '6px 16px', border: '1px solid rgba(37,99,235,0.2)', fontWeight: 500
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 02 · ARCHETYPE + RADAR — two-column layout */}
        <div style={CONTENT_WIDE}>
          <SectionHeader label="02" title="Your Archetype" />
          {/* Top row: primary card + radar */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'stretch', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {/* Left: primary archetype */}
            <div style={{ flex: '0 0 min(500px, 100%)' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.05) 0%, var(--brand-card) 100%)',
                borderRadius: '24px', padding: '2rem', border: '1px solid rgba(37,99,235,0.22)', boxShadow: CARD_FEATURE, height: '100%'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Primary Archetype</p>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 0 }}>
                      <span className="gradient-text">{report.archetype.primary.name}</span>
                    </h3>
                  </div>
                  <div style={{
                    width: '58px', height: '58px', borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(37,99,235,0.08)', border: '2px solid rgba(37,99,235,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.05rem', fontWeight: 800, color: '#2563eb'
                  }}>{archetypeMatch}%</div>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--brand-text-muted)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                  {report.archetype.primary.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
                  {report.archetype.primary.traits.map(t => (
                    <span key={t} style={{ fontSize: '0.8rem', color: '#2563eb', background: 'rgba(37,99,235,0.07)', borderRadius: '100px', padding: '5px 14px', border: '1px solid rgba(37,99,235,0.2)', fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
                <div style={{ background: 'var(--brand-bg-subtle)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--brand-border)' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Shadow Side</p>
                  <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-mid)', lineHeight: 1.7, margin: 0 }}>{report.archetype.primary.shadow}</p>
                </div>
              </div>
            </div>
            {/* Right: radar */}
            <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
              <ArchetypeRadar scores={report.archetype.radar_scores} primaryAxis={report.archetype.primary.name} />
            </div>
          </div>
          {/* Bottom: secondary archetype spans full width */}
          <div style={{ background: 'var(--brand-card)', borderRadius: '18px', padding: '1.5rem 2rem', border: '1px solid var(--brand-border)', boxShadow: CARD }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              Secondary Archetype · {Math.round(report.archetype.secondary.score * 100)}%
            </p>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '0.5rem' : '2rem', alignItems: 'flex-start' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-text)', margin: 0, flexShrink: 0 }}>{report.archetype.secondary.name}</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-mid)', lineHeight: 1.7, margin: 0 }}>{report.archetype.secondary.description}</p>
            </div>
          </div>
        </div>

        {/* 03 · HIDDEN DYNAMICS */}
        <div style={CONTENT}>
          <SectionHeader label="03" title="Hidden Dynamics" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {report.hidden_dynamics.map((d, i) => (
              <div key={i} style={{ background: 'var(--brand-card)', borderRadius: '20px', padding: '2rem', border: '1px solid var(--brand-border)', boxShadow: CARD }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '0.875rem' }}>{d.name}</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-muted)', lineHeight: 1.75, marginBottom: '1.25rem' }}>{d.description}</p>
                <div style={{ background: 'rgba(6,182,212,0.06)', borderRadius: '12px', padding: '1rem 1.25rem', border: '1px solid rgba(6,182,212,0.18)' }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0891b2', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Implication</p>
                  <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-mid)', lineHeight: 1.7, margin: 0 }}>{d.implication}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 04 · STRENGTH STACK */}
        <div style={CONTENT_WIDE}>
          <SectionHeader label="04" title="Your Strength Stack" />
          <StrengthStack strengths={report.strengths} />
        </div>

        {/* 05 · BLIND SPOTS */}
        <div style={CONTENT}>
          <SectionHeader label="05" title="Your Blind Spots" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {report.blind_spots.map((b, i) => <BlindSpotCard key={i} blindspot={b} />)}
          </div>
        </div>

        {/* 06 · ENERGY MAP */}
        <div style={CONTENT}>
          <SectionHeader label="06" title="Energy Map" />
          <EnergyMap bars={report.energy_map} />
        </div>

      </div>

      {/* THE MIRROR */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(37,99,235,0.04) 0%, rgba(6,182,212,0.03) 100%)',
        padding: '5rem 2rem',
        borderTop: '1px solid var(--brand-border)', borderBottom: '1px solid var(--brand-border)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div className="animate-pulse-glow" style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '600px', height: '350px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(60px)'
          }} />
        </div>
        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>07 · The Mirror</p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: '2.5rem', lineHeight: 1.2, color: 'var(--brand-text)' }}>
            {report.the_mirror.headline}
          </h2>
          <div style={{ textAlign: 'left' }}>
            {report.the_mirror.body.map((para, i) => (
              <p key={i} style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', lineHeight: 1.9, color: 'var(--brand-text-strong)', marginBottom: i < report.the_mirror.body.length - 1 ? '1.5rem' : 0 }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* SECOND CONTENT BLOCK */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>

        {/* 08 · FAMOUS PARALLELS */}
        <div style={CONTENT}>
          <SectionHeader label="08" title="Famous Parallels" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {report.famous_parallels.map((p, i) => <FamousParallel key={i} parallel={p} />)}
          </div>
        </div>

        {/* 09 · DIRECTION COMPASS */}
        <div style={CONTENT}>
          <SectionHeader label="09" title="Direction Compass" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {report.directions.map((d, i) => <DirectionCard key={i} direction={d} rank={i + 1} />)}
          </div>
        </div>

        {/* 10 · DREAM DAY */}
        <div style={CONTENT}>
          <SectionHeader label="10" title="Your Dream Day" />
          <div style={{ background: 'var(--brand-card)', borderRadius: '24px', padding: '2.5rem', border: '1px solid var(--brand-border)', boxShadow: CARD_FEATURE }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
              &ldquo;{report.dream_day.headline}&rdquo;
            </h3>
            {report.dream_day.body.split('\n\n').filter(p => p.trim()).map((para, i) => (
              <p key={i} style={{ fontSize: '0.97rem', lineHeight: 1.9, color: 'var(--brand-text-muted)', marginBottom: '1.25rem' }}>{para}</p>
            ))}
          </div>
        </div>

        {/* 11 · FULL REPORT */}
        <div id="full-map" style={CONTENT}>
          <SectionHeader label="11" title="Your Full Map" />
          {reportType === 'paid' ? (
            <>
              {unlocked && (
                <div className="animate-unlock-banner" style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                  borderRadius: '20px', padding: '1.5rem 2rem', marginBottom: '2rem',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  boxShadow: '0 8px 40px rgba(37,99,235,0.35)'
                }}>
                  <div style={{ fontSize: '1.8rem' }}>🎉</div>
                  <div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 2px', letterSpacing: '-0.01em' }}>Your full map is unlocked</p>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Everything below is yours. Take your time with it.</p>
                  </div>
                </div>
              )}
              <PremiumSections report={report} />
            </>
          ) : paidPending ? (
            <PaidGeneratingState reportId={String((report as MockReport & { id?: string }).id ?? '')} />
          ) : (
            <LockedSection onUnlock={handleUnlock} unlocking={unlocking} />
          )}
        </div>

        {/* ─── GO DEEPER / ACCELERATOR ─────────────────── */}
        <div style={{ maxWidth: '860px', margin: '0 auto', marginBottom: '4rem', background: 'var(--brand-bg-subtle)', borderRadius: '28px', border: '1px solid var(--brand-border)', padding: isMobile ? '2rem 1.25rem' : '3rem 2.5rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)',
              borderRadius: '100px', padding: '5px 14px', marginBottom: '1.25rem',
              fontSize: '0.7rem', color: '#2563eb', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
              The MyTwenties Accelerator
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: 'var(--brand-text)', letterSpacing: '-0.02em', marginBottom: '0.875rem', lineHeight: 1.15 }}>
              Your report is the starting point.<br />The Accelerator is the full journey.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--brand-text-mid)', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto' }}>
              12 weeks. 6 calls with Sam. Every asset built from your situation.
            </p>
          </div>

          {/* Asset grid — unlocked for Accelerator members, locked otherwise */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '0.875rem',
            marginBottom: '2.5rem'
          }}>
            {[
              { icon: '🗺️', name: '30-Day High-Leverage Plan', desc: 'Your first move, sequenced and prioritised.', weeks: 'Weeks 1–2', assetType: 'roadmap' },
              { icon: '📋', name: 'Your Business Plan', desc: 'A real plan built around your wiring, not a template.', weeks: 'Weeks 3–4', assetType: 'business_plan' },
              { icon: '💰', name: 'Offer & Pricing Strategy', desc: 'What to sell, what to charge, and why it works for you.', weeks: 'Weeks 3–4', assetType: 'offer_strategy' },
              { icon: '🎯', name: 'Client Acquisition Playbook', desc: 'How to get your first paying clients without guessing.', weeks: 'Weeks 5–6', assetType: 'client_playbook' },
              { icon: '✨', name: 'Personal Brand Blueprint', desc: 'How to show up online in a way that attracts the right people.', weeks: 'Weeks 7–8', assetType: 'brand_blueprint' },
              { icon: '🗂️', name: 'Portfolio Builder', desc: 'Turn what you\'ve done into proof that you\'re the right choice.', weeks: 'Weeks 7–8', assetType: 'portfolio_builder' },
              { icon: '📊', name: 'Session Notes', desc: 'Key moments, reframes, and next steps from your coaching sessions.', weeks: 'Weeks 1–12', assetType: 'session_notes' },
              { icon: '📅', name: '90-Day Strategic Plan', desc: 'Your next quarter mapped out with clear priorities.', weeks: 'Weeks 11–12', assetType: 'strategic_plan' },
              { icon: '📈', name: 'Growth Roadmap', desc: 'The long-game plan — where you go after the 12 weeks.', weeks: 'Weeks 11–12', assetType: 'growth_roadmap' },
            ].map(({ icon, name, desc, weeks, assetType }) => (
              isAccelerator ? (
                <a key={name} href={`/portal/assets/${assetType}`} style={{
                  display: 'block',
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  border: '1.5px solid #bfdbfe',
                  position: 'relative',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  boxShadow: '0 4px 24px rgba(37,99,235,0.07)',
                  transition: 'box-shadow 0.15s ease',
                }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '0.6rem' }}>{icon}</div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>{name}</p>
                  <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.55, marginBottom: '0.75rem' }}>{desc}</p>
                  <span style={{
                    display: 'inline-block', fontSize: '0.65rem', fontWeight: 700, color: '#16a34a',
                    background: '#dcfce7', border: '1px solid #bbf7d0',
                    borderRadius: '100px', padding: '2px 10px', letterSpacing: '0.04em'
                  }}>Open →</span>
                </a>
              ) : (
                <div key={name} style={{
                  background: 'var(--brand-card)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  border: '1px solid var(--brand-border)',
                  opacity: 0.6,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: '0.875rem', right: '0.875rem', fontSize: '0.7rem', color: 'var(--brand-text-subtle)' }}>🔒</div>
                  <div style={{ fontSize: '1.4rem', marginBottom: '0.6rem' }}>{icon}</div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '0.3rem', paddingRight: '1rem' }}>{name}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--brand-text-muted)', lineHeight: 1.55, marginBottom: '0.75rem' }}>{desc}</p>
                  <span style={{
                    display: 'inline-block', fontSize: '0.65rem', fontWeight: 700, color: '#2563eb',
                    background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)',
                    borderRadius: '100px', padding: '2px 10px', letterSpacing: '0.04em'
                  }}>{weeks}</span>
                </div>
              )
            ))}
          </div>

          {/* Portal CTA (accelerator) or Booking calendar (non-accelerator) */}
          {isAccelerator ? (
            <div style={{ textAlign: 'center' }}>
              <a href="/portal" style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                color: '#ffffff',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '0.01em',
                boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
              }}>
                Go to My Portal →
              </a>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '0.4rem' }}>
                  Book a free Strategy Call with Sam
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--brand-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Every deliverable is built live, on a call, from your specific situation — not a course you watch and forget.
                </p>
              </div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--brand-border)' }}>
                <iframe
                  src="https://api.leadconnectorhq.com/widget/booking/ibvCFYwaWf95LNjupgii"
                  style={{ width: '100%', height: '700px', border: 'none', display: 'block' }}
                  scrolling="yes"
                  title="Book a Free Strategy Call with Sam"
                />
              </div>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--brand-text-subtle)', marginTop: '1rem' }}>
                Free 30-minute call with Sam
              </p>
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  style={{
                    background: 'none', border: '1px solid var(--brand-border)',
                    borderRadius: '10px', padding: '10px 24px',
                    fontSize: '0.88rem', fontWeight: 600, color: 'var(--brand-text-mid)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'border-color 0.2s'
                  }}
                >
                  ← Back to My Report
                </button>
              </div>
            </>
          )}

        </div>

        {/* 13 · SHARE */}
        <div style={{ maxWidth: '760px', margin: '0 auto', marginBottom: '4rem' }}>
          <SectionHeader label="13" title="Share Your Result" />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ShareableCard
              archetype={report.shareable_card.archetype}
              topStrength={report.shareable_card.top_strength}
              cardHeadline={report.shareable_card.card_headline}
              subtext={report.shareable_card.subtext}
              mirrorHeadline={report.the_mirror.headline}
              celebrity={report.famous_parallels[0]?.name}
              radarScores={report.archetype.radar_scores}
            />
          </div>
        </div>

      </div>

      <footer style={{ padding: '2rem 1.5rem', textAlign: 'center', borderTop: '1px solid var(--brand-border)', background: 'var(--brand-card)' }}>
        <p style={{ color: 'var(--brand-text-subtle)', fontSize: '0.8rem' }}>© 2026 MyTwenties · Your data is private.</p>
      </footer>
    </main>
  )
}

function SectionHeader({ label, title }: { label: string, title: string }) {
  return (
    <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
      <span style={{ fontSize: '0.62rem', color: 'var(--brand-text-subtle)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{label}</span>
      <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
        <span className="gradient-text">{title}</span>
      </h2>
    </div>
  )
}

function LockedSection({ onUnlock, unlocking }: { onUnlock: () => void; unlocking: boolean }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0c3d5e 0%, #0d4f6b 50%, #083347 100%)',
      borderRadius: '28px', overflow: 'hidden',
      border: '1px solid rgba(6,182,212,0.25)',
      boxShadow: '0 24px 80px rgba(6,182,212,0.12), 0 4px 16px rgba(0,0,0,0.2)',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(6,182,212,0.2) 0%, transparent 65%)',
        filter: 'blur(50px)', pointerEvents: 'none'
      }} />

      <div style={{ padding: '2.5rem 2.5rem 0', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', pointerEvents: 'none', userSelect: 'none' }}>
          {[
            {
              title: 'Business Blueprint',
              icon: '🏗️',
              sell: 'Your custom business model — the one with the highest probability of success given exactly how you\'re wired. Not a generic framework.',
              preview: `Includes your recommended model, why it fits your archetype, a 5-step action plan, and a realistic path to your first $1k and $5k. Based on your results, the business structure most likely to work for you is`,
              blur: `a model that plays directly into your natural strengths while bypassing the execution patterns that have tripped you up before...`
            },
            {
              title: 'Career Direction Map',
              icon: '🗺️',
              sell: 'Three specific roles named — each with realistic income ranges and a clear explanation of why each one fits your brain.',
              preview: `Most people never find work that fits because they\'re looking at job titles instead of cognitive fit. The three roles most aligned with how you actually think and operate are`,
              blur: `not the obvious ones on any list — and the highest-leverage entry point into each of them given where you\'re starting from...`
            },
            {
              title: 'Highest Leverage Move',
              icon: '⚡',
              sell: 'The single most important action to take in the next 7 days. Not a list — one decision, with the reasoning for why it unlocks everything else.',
              preview: `Of every possible first move available to you right now, this is the one that creates the most momentum given your specific profile and current position:`,
              blur: `a move that most people overlook because it doesn\'t feel dramatic — but it\'s the one that compounds faster than anything else from here...`
            },
            {
              title: 'Reading List',
              icon: '📚',
              sell: 'Five books chosen specifically for your profile — not bestseller lists. The exact five that will hit different given your wiring and where you\'re going.',
              preview: `These aren\'t the obvious recommendations. Based on your archetype and the specific gaps your profile revealed, the five books most likely to move you forward are`,
              blur: `starting with one that almost no one in your position has read but that will immediately reframe the thing you\'ve been stuck on...`
            },
            {
              title: 'Personal Mentor Prompt',
              icon: '🧭',
              sell: 'A custom mentoring framework built from your specific results and Sam\'s coaching methodology — not generic advice. Paste it anywhere and get guidance calibrated to how you actually work.',
              preview: `Cross-referenced against your exact answers and built on a framework developed through 100+ real coaching conversations, this gives you a thinking partner that knows your archetype, blind spots, and direction:`,
              blur: `structured so every response is filtered through your specific psychology and the direction that actually fits your wiring — not a one-size-fits-all playbook...`
            },
            {
              title: 'The Letter',
              icon: '✉️',
              sell: 'A personal letter written directly to you. Not a summary. Not a template. Something real — about what your results actually mean for your life.',
              preview: `There\'s something your results make clear that\'s worth saying directly. Something the numbers point to that\'s hard to see from the inside but important to hear:`,
              blur: `the thing that explains why some things have always felt easy while others have drained you, and what that means for the decision in front of you right now...`
            },
          ].map((item) => (
            <div key={item.title} style={{
              background: 'rgba(255,255,255,0.07)', borderRadius: '18px', padding: '1.75rem',
              border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>{item.title}</h4>
              </div>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#7dd3fc', lineHeight: 1.55, marginBottom: '0.6rem' }}>
                {item.sell}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: 0 }}>
                {item.preview}
                <span style={{ filter: 'blur(5px)', color: 'rgba(255,255,255,0.4)', userSelect: 'none' }}>
                  {' '}{item.blur}
                </span>
              </p>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px', background: 'linear-gradient(to bottom, transparent, #0c3d5e)' }} />
      </div>

      <div style={{ textAlign: 'center', padding: '1rem 2.5rem 3rem', position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)',
          borderRadius: '100px', padding: '6px 18px', marginBottom: '1.25rem',
          fontSize: '0.72rem', color: '#22d3ee', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600
        }}>6 sections locked</div>
        <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, color: '#ffffff', marginBottom: '0.75rem' }}>
          Unlock your complete insights
        </h3>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '460px', margin: '0 auto 0.75rem' }}>
          Business Blueprint, Career Map, your Highest Leverage Move, Reading List, Personal Mentor Prompt, and a letter written directly to you.
        </p>
        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 1.75rem' }}>
          Every section is built from your specific answers — cross-referenced against a framework developed through 100+ real coaching conversations. Not a template. Not generic output. Yours.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
          {[
            { label: '3 therapy sessions', price: '$450', crossed: true },
            { label: 'Career coaching', price: '$300', crossed: true },
            { label: 'Your full insights', price: '$29', crossed: false },
          ].map(({ label, price, crossed }) => (
            <div key={label} style={{
              background: crossed ? 'rgba(255,255,255,0.05)' : 'rgba(6,182,212,0.2)',
              border: `1px solid ${crossed ? 'rgba(255,255,255,0.1)' : 'rgba(6,182,212,0.5)'}`,
              borderRadius: '12px', padding: '0.6rem 1.25rem', textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.7rem', color: crossed ? 'rgba(255,255,255,0.35)' : '#7dd3fc', margin: '0 0 2px', textDecoration: crossed ? 'line-through' : 'none' }}>{label}</p>
              <p style={{ fontSize: '0.95rem', fontWeight: 800, color: crossed ? 'rgba(255,255,255,0.25)' : '#ffffff', margin: 0, textDecoration: crossed ? 'line-through' : 'none' }}>{price}</p>
            </div>
          ))}
        </div>
        <button className="gradient-btn" onClick={onUnlock} disabled={unlocking} style={{
          fontSize: '1.1rem', fontWeight: 700, color: '#ffffff',
          padding: '1rem 2.75rem', borderRadius: '100px', border: 'none',
          cursor: unlocking ? 'wait' : 'pointer',
          boxShadow: '0 8px 30px rgba(59,130,246,0.4)', opacity: unlocking ? 0.7 : 1
        }}>
          {unlocking ? 'Loading...' : 'Unlock Full Insights for $29 →'}
        </button>
        <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>One-time payment · yours forever · No subscription</p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>Not satisfied? Full refund, no questions asked.</p>
      </div>
    </div>
  )
}

function PremiumLabel({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
      <span style={{ fontSize: '1.3rem' }}>{icon}</span>
      <h3 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
        <span className="gradient-text">{title}</span>
      </h3>
    </div>
  )
}

function ReadingListBook({ book, index }: { book: { title: string; author: string; why: string; key_quotes?: string[] }; index: number }) {
  const [open, setOpen] = useState(false)
  const hasQuotes = book.key_quotes && book.key_quotes.length > 0
  return (
    <div style={{ background: 'var(--brand-card)', borderRadius: '16px', border: '1px solid var(--brand-border)', boxShadow: CARD, overflow: 'hidden' }}>
      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', color: '#ffffff', fontWeight: 800 }}>{index + 1}</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '1px' }}>{book.title}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--brand-text-subtle)', marginBottom: '5px' }}>{book.author}</p>
          <p style={{ fontSize: '0.88rem', color: 'var(--brand-text-muted)', lineHeight: 1.7, margin: 0 }}>{book.why}</p>
        </div>
      </div>
      {hasQuotes && (
        <>
          <button
            onClick={() => setOpen(!open)}
            style={{
              width: '100%', padding: '0.75rem 1.5rem',
              background: open ? 'rgba(37,99,235,0.04)' : 'transparent',
              border: 'none', borderTop: '1px solid var(--brand-border)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: 'inherit', transition: 'background 0.2s'
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563eb' }}>
              Key quotes for you
            </span>
            <span style={{ fontSize: '0.75rem', color: '#2563eb', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
          </button>
          {open && (
            <div style={{ padding: '0 1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {book.key_quotes!.map((quote, qi) => (
                <div key={qi} style={{ borderLeft: '3px solid rgba(37,99,235,0.3)', paddingLeft: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--brand-text-muted)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function boldTimeMarkers(text: string): React.ReactNode {
  // Bold time markers like "— this week", "— week 2", "— month 1", "— day 90" etc.
  const parts = text.split(/(—\s*(?:this week|week \d+|month \d+|day \d+|\d+\s*weeks?|\d+\s*months?)[^—]*)/gi)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    /^—\s*(?:this week|week \d+|month \d+|day \d+|\d+\s*weeks?|\d+\s*months?)/i.test(part)
      ? <strong key={i} style={{ fontWeight: 700, color: 'var(--brand-text)' }}>{part}</strong>
      : part
  )
}

function PremiumSections({ report }: { report: MockReport }) {
  const CF = '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)'
  const C = '0 4px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {report.business_blueprint && (
        <div>
          <PremiumLabel icon="🏗️" title="Business Blueprint" />
          <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(37,99,235,0.2)', boxShadow: CF }}>
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '2rem' }}>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '6px' }}>Your model</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, margin: 0 }}>{report.business_blueprint.model}</p>
            </div>
            <div style={{ background: 'var(--brand-card)', padding: '2rem' }}>
              <p style={{ fontSize: '0.95rem', color: 'var(--brand-text-muted)', lineHeight: 1.85, marginBottom: '2rem' }}>{report.business_blueprint.why_it_fits}</p>
              <p style={{ fontSize: '0.68rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '1rem' }}>Your first steps</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {report.business_blueprint.first_steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.72rem', fontWeight: 800, color: '#ffffff' }}>{i + 1}</div>
                    <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-strong)', lineHeight: 1.7, margin: 0, paddingTop: '4px' }}>{boldTimeMarkers(step)}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(37,99,235,0.06)', borderRadius: '14px', padding: '1.25rem 1.5rem', border: '1px solid rgba(37,99,235,0.18)' }}>
                <p style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Realistic timeline</p>
                <p style={{ fontSize: '0.95rem', color: 'var(--brand-text-strong)', lineHeight: 1.75, margin: 0, fontWeight: 600 }}>{report.business_blueprint.realistic_timeline}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {report.career_map && (
        <div>
          <PremiumLabel icon="🗺️" title="Career Direction Map" />
          <div style={{ background: 'var(--brand-card)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--brand-border)', boxShadow: CF, marginBottom: '1rem' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-text)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{report.career_map.headline}</p>
            <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-muted)', lineHeight: 1.85, margin: 0 }}>{report.career_map.why}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {report.career_map.roles.map((role, i) => (
              <div key={i} style={{ background: 'var(--brand-card)', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--brand-border)', boxShadow: C, display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.78rem', fontWeight: 800, color: '#ffffff' }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '8px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--brand-text)', margin: 0 }}>{role.title}</h4>
                    <span style={{ fontSize: '0.82rem', color: '#06b6d4', fontWeight: 700, background: 'rgba(6,182,212,0.1)', borderRadius: '100px', padding: '3px 12px', border: '1px solid rgba(6,182,212,0.25)', wordBreak: 'break-word' }}>{role.income}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--brand-text-muted)', lineHeight: 1.75, margin: 0 }}>{role.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {report.highest_leverage_move && (
        <div>
          <PremiumLabel icon="⚡" title="Highest Leverage Move" />
          <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(6,182,212,0.3)', boxShadow: CF }}>
            <div style={{ background: 'linear-gradient(135deg, #0c1f35 0%, #0c3d5e 100%)', padding: '2rem' }}>
              <p className="gradient-text" style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800, marginBottom: '10px' }}>Do this now</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.4, margin: 0 }}>{report.highest_leverage_move.move}</p>
            </div>
            <div style={{ background: 'var(--brand-card)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.95rem', color: 'var(--brand-text-muted)', lineHeight: 1.85, margin: 0 }}>{report.highest_leverage_move.why_now}</p>
              <div style={{ background: 'rgba(6,182,212,0.06)', borderRadius: '14px', padding: '1.25rem 1.5rem', border: '1px solid rgba(6,182,212,0.2)' }}>
                <p style={{ fontSize: '0.68rem', color: '#0891b2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>How to start this week</p>
                <p style={{ fontSize: '0.95rem', color: 'var(--brand-text-strong)', lineHeight: 1.75, margin: 0 }}>{report.highest_leverage_move.how_to_start}</p>
              </div>
              {report.highest_leverage_move.worst_case && (
                <div style={{ background: 'rgba(37,99,235,0.04)', borderRadius: '14px', padding: '1.25rem 1.5rem', border: '1px solid rgba(37,99,235,0.14)' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '6px' }}>What&apos;s the worst case scenario?</p>
                  <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-muted)', lineHeight: 1.75, margin: 0 }}>{report.highest_leverage_move.worst_case}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {report.reading_list && (
        <div>
          <PremiumLabel icon="📚" title="Your Reading List" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {report.reading_list.map((book, i) => (
              <ReadingListBook key={i} book={book} index={i} />
            ))}
          </div>
        </div>
      )}

      {report.ai_mentor_prompt && (
        <div>
          <PremiumLabel icon="🧭" title="Your Personal Mentor Prompt" />
          <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-muted)', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            This is a custom mentoring framework built from your specific results and cross-referenced against Sam's coaching methodology — developed through 100+ real conversations. Paste it into any AI tool and it becomes a thinking partner that understands your exact archetype, strengths, blind spots, and direction. Every response is filtered through how you actually work, not a one-size-fits-all playbook.
          </p>
          <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(37,99,235,0.2)', boxShadow: C }}>
            <div style={{ background: '#0f172a', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                {['#ef4444','#f59e0b','#10b981'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>Copy · Paste into ChatGPT / Claude / Gemini as System Prompt</span>
            </div>
            <div style={{ background: '#1e293b', padding: '1.75rem', fontFamily: 'monospace', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.9, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <span style={{ color: '#7dd3fc' }}>{report.ai_mentor_prompt}</span>
            </div>
          </div>
        </div>
      )}

      {report.the_letter && (
        <div>
          <PremiumLabel icon="✉️" title="A Letter To You" />
          <div style={{ background: 'var(--brand-card)', borderRadius: '24px', padding: '2.75rem', border: '1px solid var(--brand-border)', boxShadow: CF, borderLeft: '4px solid #2563eb' }}>
            <p style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.75rem' }}>Written for you</p>
            {report.the_letter.map((para, i) => (
              <p key={i} style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', lineHeight: 1.95, color: 'var(--brand-text-strong)', marginBottom: i < report.the_letter!.length - 1 ? '1.5rem' : 0 }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
