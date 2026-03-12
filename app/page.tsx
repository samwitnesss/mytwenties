'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

export default function LandingPage() {
  const isMobile = useIsMobile()
  return (
    <main style={{ backgroundColor: 'var(--brand-bg)', minHeight: '100vh', overflowX: 'hidden', color: 'var(--brand-text)' }}>

      {/* ─── NAV ─────────────────────────────────────── */}
      <nav style={{
        position: isMobile ? 'relative' : 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: isMobile ? 'color-mix(in srgb, var(--brand-bg) 85%, transparent)' : 'transparent',
        backdropFilter: isMobile ? 'blur(8px)' : 'none',
        padding: isMobile ? '0 1.5rem' : 'env(safe-area-inset-top) 2rem 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        minHeight: '60px'
      }}>
        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--brand-text)', letterSpacing: '-0.02em' }}>
          My<span style={{ color: '#2563eb' }}>Twenties</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-text-muted)',
              padding: '8px 18px', borderRadius: '100px',
              border: '1px solid var(--brand-border)', background: 'var(--brand-card)',
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
            }}>
              Log in
            </button>
          </Link>
          <Link href="/start" style={{ textDecoration: 'none' }}>
            <button className="gradient-btn" style={{
              fontSize: '0.85rem', fontWeight: 700, color: '#ffffff',
              padding: '8px 20px', borderRadius: '100px', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit'
            }}>
              Start Free →
            </button>
          </Link>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────── */}
      <section style={{
        position: 'relative', minHeight: isMobile ? 'calc(100vh - 60px)' : '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '3rem 1.5rem 4rem' : '8rem 1.5rem 5rem', textAlign: 'center',
        overflowX: 'hidden', overflowY: 'visible'
      }}>
        {/* ─── Aurora blobs — corners only, away from text ─── */}
        {/* Blue — top-left corner, bleeds into nav */}
        <div className="animate-aurora-1" style={{
          position: 'absolute', top: isMobile ? '-40px' : '-80px', left: '-60px',
          width: '320px', height: '300px',
          background: 'radial-gradient(ellipse at 60% 60%, rgba(37,99,235,0.22) 0%, rgba(59,130,246,0.1) 50%, transparent 70%)',
          filter: 'blur(45px)', borderRadius: '50%', pointerEvents: 'none',
          mixBlendMode: 'multiply'
        }} />
        {/* Teal — top-right corner, bleeds into nav */}
        <div className="animate-aurora-2" style={{
          position: 'absolute', top: isMobile ? '-40px' : '-80px', right: '-60px',
          width: '300px', height: '280px',
          background: 'radial-gradient(ellipse at 40% 60%, rgba(6,182,212,0.2) 0%, rgba(14,165,233,0.08) 50%, transparent 70%)',
          filter: 'blur(45px)', borderRadius: '50%', pointerEvents: 'none',
          mixBlendMode: 'multiply'
        }} />
        {/* Indigo — bottom-left corner */}
        <div className="animate-aurora-3" style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '280px', height: '250px',
          background: 'radial-gradient(ellipse at 60% 40%, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)',
          filter: 'blur(45px)', borderRadius: '50%', pointerEvents: 'none',
          mixBlendMode: 'multiply'
        }} />
        {/* Blue — bottom-right corner */}
        <div className="animate-aurora-1" style={{
          position: 'absolute', bottom: '-60px', right: '-60px',
          width: '280px', height: '240px',
          background: 'radial-gradient(ellipse at 40% 40%, rgba(37,99,235,0.18) 0%, rgba(6,182,212,0.08) 50%, transparent 70%)',
          filter: 'blur(45px)', borderRadius: '50%', pointerEvents: 'none',
          mixBlendMode: 'multiply', animationDelay: '-9s'
        }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto' }}>
          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 6.5vw, 4.5rem)',
            fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em',
            marginBottom: '1.75rem', color: 'var(--brand-text)'
          }}>
            School taught you everything...
            <br />
            <span className="gradient-text">but what to do with your life.</span>
          </h1>

          {/* Sub — single punchy sentence */}
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'var(--brand-text-muted)',
            lineHeight: 1.75, maxWidth: '560px', margin: '0 auto 2.75rem'
          }}>
            25 minutes from now, you&apos;ll know more about yourself than most people figure out in their entire lives.
          </p>

          {/* CTA */}
          <Link href="/start" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
            <button className="gradient-btn" style={{
              fontSize: '1.1rem', fontWeight: 700, color: '#ffffff',
              padding: '1rem 2.75rem', borderRadius: '100px', border: 'none',
              cursor: 'pointer', letterSpacing: '0.01em',
              boxShadow: '0 8px 32px rgba(37,99,235,0.3)', fontFamily: 'inherit'
            }}>
              Start the Assessment →
            </button>
          </Link>

          <p style={{ fontSize: '0.8rem', color: 'var(--brand-text-subtle)' }}>
            Your data is encrypted and never sold. Delete anytime.
          </p>
        </div>

        {/* ─── Hand-drawn stick figure illustrations ─── */}
        {/* Artist at easel */}
        <svg width="155" height="175" viewBox="0 0 155 175" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '10%', left: '2%', opacity: 0.05, pointerEvents: 'none', transform: isMobile ? 'scale(0.65)' : 'scale(1)', transformOrigin: 'top left' }} aria-hidden="true">
          <circle cx="46" cy="18" r="13" />
          <path d="M46,31 Q47,52 46,74" /><path d="M46,50 Q64,42 86,38" /><path d="M46,50 Q34,60 26,70" />
          <path d="M46,74 Q38,92 34,112" /><path d="M46,74 Q56,92 60,112" />
          <rect x="92" y="12" width="52" height="62" rx="2" strokeWidth="2.2" />
          <path d="M92,74 Q86,94 82,120" strokeWidth="2" /><path d="M144,74 Q150,94 154,120" strokeWidth="2" /><path d="M118,74 L118,120" strokeWidth="2" />
          <path d="M100,26 Q110,38 120,32 Q130,42 140,36" strokeWidth="1.8" />
          <path d="M86,38 L92,33" strokeWidth="2" />
        </svg>
        {/* Speaker at podium */}
        <svg width="150" height="180" viewBox="0 0 150 180" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '12%', right: '3%', opacity: 0.05, pointerEvents: 'none', transform: isMobile ? 'scale(0.65)' : 'scale(1)', transformOrigin: 'top right' }} aria-hidden="true">
          <circle cx="72" cy="18" r="13" />
          <path d="M72,31 Q73,52 72,76" /><path d="M72,50 Q88,34 102,20" /><path d="M72,50 Q58,58 48,54" />
          <path d="M72,76 Q62,96 58,118" /><path d="M72,76 Q82,96 86,118" />
          <path d="M44,86 L100,86 L100,94 L44,94 Z" strokeWidth="2.2" />
          <path d="M44,94 Q40,108 36,128" strokeWidth="2" /><path d="M100,94 Q104,108 108,128" strokeWidth="2" />
          <circle cx="105" cy="14" r="6" strokeWidth="2.2" />
          <path d="M105,20 L105,36" strokeWidth="2" /><path d="M100,36 L110,36" strokeWidth="2" />
        </svg>
        {/* Surfer */}
        <svg width="200" height="155" viewBox="0 0 200 155" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', bottom: '16%', left: '1%', opacity: 0.05, pointerEvents: 'none', transform: isMobile ? 'scale(0.6)' : 'scale(1)', transformOrigin: 'bottom left' }} aria-hidden="true">
          <circle cx="100" cy="20" r="13" />
          <path d="M100,33 Q103,52 105,68" /><path d="M102,50 Q80,42 58,46" /><path d="M102,50 Q122,38 146,42" />
          <path d="M105,68 Q94,82 90,98" /><path d="M105,68 Q118,82 122,96" />
          <path d="M48,106 Q78,96 108,104 Q138,112 150,118 Q120,132 80,124 Q46,118 48,112 Z" strokeWidth="2.2" />
          <path d="M10,138 Q40,126 68,140 Q96,154 126,136 Q152,122 180,138" strokeWidth="2.2" />
        </svg>
        {/* Golfer */}
        <svg width="165" height="158" viewBox="0 0 165 158" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', bottom: '13%', right: '2%', opacity: 0.05, pointerEvents: 'none', transform: isMobile ? 'scale(0.6)' : 'scale(1)', transformOrigin: 'bottom right' }} aria-hidden="true">
          <circle cx="94" cy="16" r="13" />
          <path d="M94,29 Q89,48 84,66" /><path d="M88,46 Q66,52 44,58" /><path d="M88,46 Q72,38 50,46" />
          <path d="M84,66 Q77,84 74,104" /><path d="M84,66 Q95,82 99,102" />
          <path d="M46,54 Q34,74 28,102" /><path d="M21,100 L33,104 L25,112 Z" strokeWidth="2.2" />
          <circle cx="23" cy="116" r="5" strokeWidth="2.2" /><path d="M5,116 L138,116" strokeWidth="1.8" />
        </svg>
        {/* Runner */}
        <svg width="115" height="158" viewBox="0 0 115 158" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '42%', right: '0.5%', opacity: 0.05, pointerEvents: 'none', display: isMobile ? 'none' : 'block' }} aria-hidden="true">
          <circle cx="58" cy="18" r="12" />
          <path d="M58,30 Q54,48 52,66" /><path d="M55,46 Q36,32 26,24" /><path d="M55,46 Q74,58 84,68" />
          <path d="M52,66 Q36,82 28,102" /><path d="M52,66 Q66,78 74,94" />
          <path d="M28,102 Q22,114 14,116" /><path d="M74,94 Q82,106 90,112" />
        </svg>
        {/* Yoga / meditation — left-center */}
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '28%', left: '18%', opacity: 0.05, pointerEvents: 'none', display: isMobile ? 'none' : 'block' }} aria-hidden="true">
          <circle cx="60" cy="16" r="13" />
          <path d="M60,29 Q60,50 60,66" />
          <path d="M60,44 Q42,54 24,60 Q18,62 14,68" /><path d="M60,44 Q78,54 96,60 Q102,62 106,68" />
          <path d="M60,66 Q44,72 28,70 Q16,70 10,78" /><path d="M60,66 Q76,72 92,70 Q104,70 110,78" />
          <path d="M14,68 Q10,72 14,76 Q18,80 22,76" strokeWidth="2.2" />
          <path d="M106,68 Q110,72 106,76 Q102,80 98,76" strokeWidth="2.2" />
        </svg>
        {/* Chef cooking — center-left */}
        <svg width="130" height="165" viewBox="0 0 130 165" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '22%', left: '38%', opacity: 0.05, pointerEvents: 'none', display: isMobile ? 'none' : 'block' }} aria-hidden="true">
          <circle cx="65" cy="22" r="13" />
          <path d="M50,14 Q54,4 65,6 Q76,4 80,14" strokeWidth="2.2" />
          <path d="M50,14 Q46,20 50,26 Q54,32 65,30 Q76,32 80,26 Q84,20 80,14" strokeWidth="2.2" />
          <path d="M65,35 Q65,54 64,72" />
          <path d="M64,52 Q46,44 36,52 L34,74 L96,74 L94,52 Q84,44 64,52 Z" strokeWidth="2.2" />
          <path d="M64,72 Q56,90 52,110" /><path d="M64,72 Q74,90 78,110" />
        </svg>
        {/* Guitarist / musician — center-right */}
        <svg width="140" height="170" viewBox="0 0 140 170" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '18%', left: '58%', opacity: 0.05, pointerEvents: 'none', display: isMobile ? 'none' : 'block' }} aria-hidden="true">
          <circle cx="60" cy="18" r="13" />
          <path d="M60,31 Q60,52 60,70" />
          <path d="M60,50 Q40,36 28,28" /><path d="M60,50 Q80,38 100,36" />
          <path d="M60,70 Q52,90 48,112" /><path d="M60,70 Q70,90 74,112" />
          <path d="M100,36 Q108,38 110,46 Q108,54 100,56 Q92,54 90,46 Q92,38 100,36 Z" strokeWidth="2.2" />
          <path d="M90,50 Q80,58 70,62" strokeWidth="2" />
          <path d="M28,28 L26,22 Q28,18 32,20 Q36,22 34,28 L32,34 Q28,36 26,32 Z" strokeWidth="2.2" />
          <path d="M26,28 L100,36" strokeWidth="1.6" />
          <path d="M27,30 L101,38" strokeWidth="1.6" />
        </svg>
        {/* Desk / laptop worker — lower center */}
        <svg width="160" height="145" viewBox="0 0 160 145" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', bottom: '22%', left: '36%', opacity: 0.05, pointerEvents: 'none', display: isMobile ? 'none' : 'block' }} aria-hidden="true">
          <circle cx="80" cy="18" r="13" />
          <path d="M80,31 Q82,52 84,70" />
          <path d="M82,50 Q60,44 44,48" /><path d="M82,50 Q104,40 120,44" />
          <path d="M84,70 Q78,86 74,104" /><path d="M84,70 Q92,86 96,104" />
          <path d="M34,72 L126,72 Q128,72 128,74 L126,106 Q126,108 124,108 L36,108 Q34,108 34,106 L32,74 Q32,72 34,72 Z" strokeWidth="2.2" />
          <path d="M22,108 L138,108 L144,116 L16,116 Z" strokeWidth="2.2" />
          <path d="M44,52 Q40,68 36,82" strokeWidth="2.2" />
          <path d="M120,44 Q124,62 128,80" strokeWidth="2.2" />
          <rect x="48" y="80" width="64" height="22" rx="2" strokeWidth="1.8" />
        </svg>
        {/* Photographer — right-center */}
        <svg width="130" height="150" viewBox="0 0 130 150" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '52%', left: '20%', opacity: 0.05, pointerEvents: 'none', display: isMobile ? 'none' : 'block' }} aria-hidden="true">
          <circle cx="65" cy="18" r="13" />
          <path d="M65,31 Q65,52 65,70" />
          <path d="M65,50 Q46,38 32,34" /><path d="M65,50 Q84,40 100,44" />
          <path d="M65,70 Q58,90 54,112" /><path d="M65,70 Q74,90 78,112" />
          <rect x="20" y="26" width="36" height="26" rx="4" strokeWidth="2.2" />
          <circle cx="38" cy="39" r="8" strokeWidth="2" />
          <circle cx="38" cy="39" r="4" strokeWidth="1.6" />
          <path d="M28,26 L32,18 L44,18 L48,26" strokeWidth="2" />
        </svg>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          color: 'var(--brand-text-subtle)', fontSize: '0.72rem'
        }}>
          <span>See what you&apos;ll get</span>
          <div style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, #cbd5e1, transparent)' }} />
        </div>
      </section>

      {/* ─── IS THIS YOU — moved up under hero ───────── */}
      <section style={{ background: 'var(--brand-bg-subtle)', borderTop: '1px solid var(--brand-border)', borderBottom: '1px solid var(--brand-border)', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '660px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.73rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem', fontWeight: 600 }}>
            Sound familiar?
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '2.5rem', color: 'var(--brand-text)' }}>
            This is for you if you feel like{' '}
            <span className="gradient-text">you should be further along.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', marginBottom: '3rem' }}>
            {[
              "You're smart — but you can't work out what you're actually supposed to do with your life",
              "Everyone else seems to have a direction and you're still waiting to find yours",
              "You've tried things but nothing has stuck or felt truly right",
              "You feel like there's potential inside you that you haven't figured out how to use",
              "You're sick of generic advice that doesn't account for who you actually are",
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                background: 'var(--brand-card)', borderRadius: '14px',
                padding: '14px 18px',
                border: '1px solid var(--brand-border)',
                borderLeft: '3px solid #2563eb',
                boxShadow: '0 1px 6px rgba(37,99,235,0.07)'
              }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', color: '#ffffff', fontWeight: 700, marginTop: '1px'
                }}>✓</span>
                <span style={{ color: 'var(--brand-text-strong)', fontSize: '0.95rem', lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>

          <Link href="/start" style={{ textDecoration: 'none', display: 'block' }}>
            <button className="gradient-btn" style={{
              fontSize: '1.05rem', fontWeight: 700, color: '#ffffff',
              padding: '0.95rem 2.5rem', borderRadius: '100px', border: 'none',
              cursor: 'pointer', width: '100%', maxWidth: '400px',
              boxShadow: '0 8px 32px rgba(37,99,235,0.25)', fontFamily: 'inherit'
            }}>
              Start the Assessment →
            </button>
          </Link>
          <p style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--brand-text-subtle)' }}>
            Free · 25 min
          </p>
        </div>
      </section>

      {/* ─── CREDIBILITY STRIP ───────────────────────── */}
      <section style={{ borderTop: '1px solid var(--brand-border)', borderBottom: '1px solid var(--brand-border)', background: 'var(--brand-bg)' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem',
          display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px'
        }}>
          {[
            { label: '100+ coaching conversations' },
            { label: '75 questions · 10 dimensions' },
            { label: '12 personalised sections' },
            { label: 'Results in 25 minutes' },
          ].map(({ label }, i) => (
            <div key={i} style={{
              background: 'rgba(37,99,235,0.05)',
              border: '1px solid rgba(37,99,235,0.18)',
              borderRadius: '100px',
              padding: '0.55rem 1.25rem',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb', margin: 0, whiteSpace: 'nowrap' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHAT YOU'LL GET ─────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ fontSize: '1rem', color: 'var(--brand-text-mid)', letterSpacing: '0.04em', marginBottom: '0.75rem', fontWeight: 600 }}>
            What you&apos;ll receive
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--brand-text)' }}>
            Three things most people spend{' '}
            <span className="gradient-text">years trying to figure out.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <ReportCard
            number="01"
            tag="Who you are"
            tagColor="#2563eb"
            title="Archetype Profile"
            description="Your core identity across 8 dimensions. Not a generic personality type — a specific, accurate map of how you're wired and exactly why you operate the way you do."
            accent="rgba(37,99,235,0.08)"
            accentBorder="rgba(37,99,235,0.15)"
          />
          <ReportCard
            number="02"
            tag="What to do"
            tagColor="#06b6d4"
            title="Direction Compass"
            description="3 specific paths matched to your wiring and circumstances. Each with income potential, timeline, and the exact first steps to get started — no vagueness."
            accent="rgba(6,182,212,0.06)"
            accentBorder="rgba(6,182,212,0.15)"
          />
          <ReportCard
            number="03"
            tag="The truth"
            tagColor="#06b6d4"
            title="The Mirror"
            description="The thing no one in your life has said to you directly. Your blind spots, hidden patterns, and what's actually holding you back — said plainly, without softening it."
            accent="rgba(6,182,212,0.06)"
            accentBorder="rgba(6,182,212,0.15)"
          />
        </div>
      </section>

      {/* ─── REPORT PREVIEW MOCKUP ───────────────────── */}
      <section style={{ background: 'var(--brand-bg-subtle)', borderTop: '1px solid var(--brand-border)', borderBottom: '1px solid var(--brand-border)', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.73rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem', fontWeight: 600 }}>
              Your report
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--brand-text)' }}>
              This is your report.{' '}
              <span className="gradient-text">25 minutes from now.</span>
            </h2>
          </div>

          {/* Mock report card */}
          <div style={{
            background: 'var(--brand-card)', borderRadius: '28px', overflow: 'hidden',
            border: '1px solid var(--brand-border)', boxShadow: '0 24px 80px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
            position: 'relative'
          }}>
            <div className="shimmer-card-shine" />

            {/* ── Report header ── */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.05) 0%, var(--brand-card) 100%)',
              borderBottom: '1px solid var(--brand-border)', padding: isMobile ? '1.5rem 1rem 1.25rem' : '2.5rem 2.5rem 2rem',
              textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
                backgroundSize: '24px 24px', opacity: 0.35
              }} />
              <div style={{
                position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
                width: '500px', height: '280px',
                background: 'radial-gradient(ellipse, rgba(37,99,235,0.1) 0%, transparent 65%)',
                filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none'
              }} />
              <div style={{ position: 'relative' }}>
                <div style={{
                  display: 'inline-block', background: 'rgba(37,99,235,0.07)',
                  border: '1px solid rgba(37,99,235,0.2)', borderRadius: '100px',
                  padding: '5px 16px', fontSize: '0.65rem', color: '#2563eb',
                  fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem'
                }}>
                  MyTwenties · Personal Report
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--brand-text-subtle)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  Generated March 12, 2026
                </p>
                <h3 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--brand-text)', marginBottom: '0.75rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  Alex&apos;s Report
                </h3>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.22)',
                  borderRadius: '100px', padding: '8px 20px', marginBottom: '1rem'
                }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#2563eb' }}>The Architect</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--brand-text-mid)', background: 'var(--brand-track)', borderRadius: '100px', padding: '2px 8px' }}>87% match</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--brand-text-muted)', fontStyle: 'italic', maxWidth: '400px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                  &ldquo;You don&apos;t fit the system — you build the system. The problem isn&apos;t your ambition. It&apos;s that you&apos;ve been playing someone else&apos;s game.&rdquo;
                </p>
                {/* Stat chips */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Top Strength', value: 'Systems Thinking' },
                    { label: 'Archetype Match', value: '87%' },
                    { label: 'Directions', value: '3 paths' },
                    { label: 'Sections', value: '12 insights' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      background: 'var(--brand-bg-subtle)', border: '1px solid var(--brand-border)',
                      borderRadius: '12px', padding: '0.6rem 1rem', textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '0.58rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px', fontWeight: 600 }}>{label}</p>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-text)', margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Section content ── */}
            <div style={{ padding: isMobile ? '1.25rem 1rem' : '2rem 2.5rem' }}>

              {/* Identity + Archetype row */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {/* Identity card */}
                <div style={{
                  background: 'var(--brand-card)', borderRadius: '18px', padding: '1.5rem',
                  border: '1px solid var(--brand-border)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
                }}>
                  <p style={{ fontSize: '0.62rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.5rem' }}>01 · Identity Profile</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--brand-text-strong)', lineHeight: 1.7, marginBottom: '0.875rem' }}>
                    You operate at your best when you have a real problem to solve and full autonomy to solve it. You&apos;re not built for execution — you&apos;re built for design. The work that lights you up is building the thing that makes the right outcome inevitable.
                  </p>
                  <div style={{ background: 'rgba(37,99,235,0.05)', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(37,99,235,0.12)', marginBottom: '0.875rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#2563eb', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                      &ldquo;You&apos;re not waiting for the right opportunity. You&apos;re waiting for permission you don&apos;t need.&rdquo;
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {['Builder', 'Systems thinker', 'Self-directed', 'High standards'].map(t => (
                      <span key={t} style={{ fontSize: '0.65rem', color: '#2563eb', background: 'rgba(37,99,235,0.07)', borderRadius: '100px', padding: '3px 9px', border: '1px solid rgba(37,99,235,0.18)' }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Archetype card */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.04) 0%, var(--brand-card) 100%)',
                  borderRadius: '18px', padding: '1.5rem',
                  border: '1px solid rgba(37,99,235,0.18)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
                }}>
                  <p style={{ fontSize: '0.62rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.5rem' }}>02 · Archetype</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <p style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '2px' }}>Primary</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb', margin: 0 }}>The Architect</p>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(37,99,235,0.08)', border: '2px solid rgba(37,99,235,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#2563eb' }}>87%</div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--brand-text-muted)', lineHeight: 1.65, marginBottom: '0.875rem' }}>
                    You build systems, frameworks, and structures — even when no one asks you to. You see how things connect before others see there&apos;s a pattern at all.
                  </p>
                  <div style={{ background: 'var(--brand-bg-subtle)', borderRadius: '8px', padding: '0.625rem', border: '1px solid var(--brand-border)', marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>Shadow Side</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--brand-text-mid)', lineHeight: 1.55, margin: 0 }}>The architecture is beautiful. The building never gets built.</p>
                  </div>
                  <p style={{ fontSize: '0.62rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Secondary · 71%</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-text-muted)', margin: 0 }}>The Connector</p>
                </div>
              </div>

              {/* Strength Stack */}
              <div style={{
                background: 'var(--brand-card)', borderRadius: '18px', padding: '1.5rem',
                border: '1px solid var(--brand-border)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '1rem'
              }}>
                <p style={{ fontSize: '0.62rem', color: '#0ea5e9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '1rem' }}>04 · Strength Stack</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {[
                    { name: 'Systems Thinking', score: 0.91, income: 'High-ticket consulting, product strategy' },
                    { name: 'Deep Communication', score: 0.84, income: 'Coaching, content, education' },
                    { name: 'Creative Problem-Solving', score: 0.79, income: 'Product creation, entrepreneurship' },
                    { name: 'Emotional Intelligence', score: 0.76, income: 'Leadership, high-stakes sales' },
                  ].map(({ name, score }) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--brand-text-strong)', minWidth: '160px', flexShrink: 0 }}>{name}</span>
                      <div style={{ flex: 1, height: '8px', background: 'var(--brand-track)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${score * 100}%`, background: 'linear-gradient(90deg, #2563eb, #06b6d4)', borderRadius: '100px' }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563eb', minWidth: '30px', textAlign: 'right' }}>{Math.round(score * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom row — 3 cards */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: 'var(--brand-card)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--brand-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <p style={{ fontSize: '0.62rem', color: '#0891b2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.5rem' }}>07 · The Mirror</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--brand-text-strong)', lineHeight: 1.65, marginBottom: '0' }}>
                    You&apos;ve been protecting yourself from disappointment by not fully committing to anything. If you never really try, you can never really fail. But you also never really live.
                  </p>
                </div>
                <div style={{ background: 'var(--brand-card)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--brand-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <p style={{ fontSize: '0.62rem', color: '#0891b2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.5rem' }}>09 · Direction Compass</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      { title: 'Strategy Consulting', fit: '89%' },
                      { title: 'Personal Brand + Education', fit: '81%' },
                      { title: 'B2B SaaS Founder', fit: '74%' },
                    ].map(({ title, fit }) => (
                      <div key={title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--brand-text-strong)', fontWeight: 500 }}>{title}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#0891b2', background: 'rgba(6,182,212,0.08)', borderRadius: '100px', padding: '2px 7px', border: '1px solid rgba(6,182,212,0.2)' }}>{fit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: 'var(--brand-card)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--brand-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <p style={{ fontSize: '0.62rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.5rem' }}>05 · Blind Spots</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {[
                      { name: 'Execution Avoidance', sev: 0.82 },
                      { name: 'Over-engineering', sev: 0.65 },
                    ].map(({ name, sev }) => (
                      <div key={name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--brand-text-strong)', fontWeight: 500 }}>{name}</span>
                          <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 700 }}>{Math.round(sev * 100)}%</span>
                        </div>
                        <div style={{ height: '5px', background: 'var(--brand-track)', borderRadius: '100px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${sev * 100}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '100px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fading bottom rows */}
              <div style={{ position: 'relative' }}>
                <div style={{ pointerEvents: 'none', userSelect: 'none', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '1rem', opacity: 0.5 }}>
                  {[
                    { label: '10 · Dream Day', preview: 'You wake at 7:30am, no alarm. The first hour is yours alone. By 9am you\'re deep in the problem you chose, not one someone assigned you...', color: '#0ea5e9' },
                    { label: '11 · Business Blueprint', preview: 'The model with the highest probability of success for your specific wiring is a founder-led consulting practice anchored in strategic clarity...', color: '#2563eb' },
                  ].map(({ label, preview, color }) => (
                    <div key={label} style={{ background: 'var(--brand-bg-subtle)', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--brand-border)' }}>
                      <p style={{ fontSize: '0.62rem', color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '6px' }}>{label}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--brand-text-mid)', lineHeight: 1.6, margin: 0 }}>{preview}</p>
                    </div>
                  ))}
                </div>
                <div className="fade-to-bottom" style={{ position: 'absolute', inset: 0 }} />
                {/* "more" label at bottom */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', paddingBottom: '4px' }}>
                  <span style={{ fontSize: '1rem', color: 'var(--brand-text-muted)', fontWeight: 700 }}>+ 4 more sections in your free report</span>
                </div>
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.93rem', color: 'var(--brand-text-mid)', fontWeight: 500 }}>
            12 sections · Built from your answers · Completely personalised
          </p>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ fontSize: '0.73rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem', fontWeight: 600 }}>
            How it works
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--brand-text)' }}>
            Simple. <span className="gradient-text">Brutally honest.</span> Yours.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {[
            { step: '01', title: 'Answer honestly', body: '75 questions across 10 dimensions of who you are. No right answers — just you.' },
            { step: '02', title: 'We analyse everything', body: 'Your responses are run through our assessment framework to build your unique profile.' },
            { step: '03', title: 'Get your report', body: 'A full breakdown of your archetype, direction, blind spots, and your next move.' },
          ].map(({ step, title, body }) => (
            <div key={step} style={{
              background: 'var(--brand-card)', borderRadius: '20px', padding: '2rem',
              border: '1px solid var(--brand-border)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.07)'
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem'
              }}>
                {step}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '0.75rem' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--brand-text-mid)', lineHeight: 1.65, margin: 0 }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────── */}
      <section style={{ background: 'var(--brand-bg-subtle)', borderTop: '1px solid var(--brand-border)', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.73rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem', fontWeight: 600 }}>
              What people say
            </p>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 900, color: 'var(--brand-text)', letterSpacing: '-0.02em' }}>
              Real results from real people.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[
              { initials: 'JM', name: 'Jamie, 23', quote: "I've done every personality test out there. This is the only one that actually made me feel understood. The direction compass alone was worth it." },
              { initials: 'SC', name: 'Sophie, 26', quote: "I was spinning my wheels for three years after uni. This gave me a framework for my next move that actually made sense for who I am." },
              { initials: 'AR', name: 'Alex, 24', quote: "The Mirror section was uncomfortable to read but exactly what I needed to hear. No vague platitudes — just the truth about why I was stuck." },
            ].map(({ initials, name, quote }) => (
              <div key={name} style={{
                background: 'var(--brand-card)', borderRadius: '20px', padding: '1.75rem',
                border: '1px solid var(--brand-border)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)'
              }}>
                <div style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '1rem', letterSpacing: '2px' }}>★★★★★</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--brand-text-strong)', lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                  &ldquo;{quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: '#2563eb'
                  }}>
                    {initials}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-text-muted)' }}>{name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.73rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem', fontWeight: 600 }}>
            Questions
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 900, color: 'var(--brand-text)', letterSpacing: '-0.02em' }}>
            Answered before you ask.
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            {
              q: "Is this just another MBTI or Enneagram?",
              a: "No. Those categorise you into a type and leave you there. This analyses you — your wiring, your patterns, your specific situation — and tells you what to actually do with it."
            },
            {
              q: "How is a 25-minute assessment this accurate?",
              a: "It's not about time — it's about the right questions. Every question in this assessment was built from real coaching conversations, not academic theory. They're designed to surface the things you already know but haven't articulated."
            },
            {
              q: "Will this actually tell me something useful?",
              a: "Yes. Or you don't pay. The base report is completely free. If you read it and think it's generic, close the tab. If you want to go deeper, that's when it costs — and only then."
            },
            {
              q: "What happens to my answers?",
              a: "Private. Never shared. Used only to generate your report. You can email us to have everything deleted at any time."
            },
          ].map(({ q, a }) => (
            <FAQItem key={q} question={q} answer={a} />
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────── */}
      <section style={{ padding: '7rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'var(--brand-bg-subtle)', borderTop: '1px solid var(--brand-border)' }}>
        <div className="animate-pulse-glow" style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '700px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.07) 0%, transparent 65%)',
          filter: 'blur(50px)', pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', maxWidth: '620px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.73rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem', fontWeight: 600 }}>
            Stop waiting for clarity to find you.
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem', color: 'var(--brand-text)' }}>
            You&apos;re under an hour away{' '}
            <span className="gradient-text">from finally getting it.</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--brand-text-mid)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 2.5rem' }}>
            You already know something isn&apos;t clicking. This tells you why — and exactly what to do about it.
          </p>
          <Link href="/start" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <button className="gradient-btn" style={{
              fontSize: '1.15rem', fontWeight: 700, color: '#ffffff',
              padding: '1.1rem 3rem', borderRadius: '100px', border: 'none',
              cursor: 'pointer', boxShadow: '0 8px 40px rgba(37,99,235,0.3)',
              fontFamily: 'inherit'
            }}>
              Start the Assessment →
            </button>
          </Link>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--brand-text-subtle)' }}>
            Free · 25 min · Your data is private.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────── */}
      <footer style={{ padding: '2rem 1.5rem', textAlign: 'center', borderTop: '1px solid var(--brand-border)' }}>
        <p style={{ color: 'var(--brand-text-subtle)', fontSize: '0.8rem' }}>
          © 2026 MyTwenties · Your data is private and never shared.
        </p>
      </footer>

    </main>
  )
}

function ReportCard({ number, tag, tagColor, title, description, accent, accentBorder }: {
  number: string
  tag: string
  tagColor: string
  title: string
  description: string
  accent: string
  accentBorder: string
}) {
  return (
    <div style={{
      background: 'var(--brand-card)', borderRadius: '20px', padding: '2rem',
      border: '1px solid var(--brand-border)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Corner accent */}
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '100px', height: '100px',
        background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
        filter: 'blur(20px)', borderRadius: '50%'
      }} />
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.1em', display: 'block', marginBottom: '1rem' }}>
          {number}
        </span>
        <div style={{
          fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase',
          color: tagColor, marginBottom: '0.5rem', lineHeight: 1.1
        }}>
          {tag}
        </div>
        <div style={{ width: '40px', height: '3px', background: tagColor, borderRadius: '2px', margin: '0 auto 1.25rem', opacity: 0.4 }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--brand-text)' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--brand-text-mid)', lineHeight: 1.7, margin: 0, textAlign: 'center' }}>
          {description}
        </p>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: 'var(--brand-card)', borderRadius: '16px',
      border: '1px solid var(--brand-border)', overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', padding: '1.25rem 1.5rem',
          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
        }}
      >
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-text)', lineHeight: 1.4 }}>{question}</span>
        <span style={{
          width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
          background: open ? 'rgba(37,99,235,0.1)' : 'var(--brand-track)',
          border: `1px solid ${open ? 'rgba(37,99,235,0.2)' : 'var(--brand-border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', color: open ? '#2563eb' : '#94a3b8', transition: 'all 0.2s',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)'
        }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 1.5rem 1.25rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--brand-text-muted)', lineHeight: 1.7, margin: 0 }}>{answer}</p>
        </div>
      )}
    </div>
  )
}
