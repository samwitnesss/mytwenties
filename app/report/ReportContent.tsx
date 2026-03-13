'use client'

import { useEffect, useState } from 'react'
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

export default function ReportContent({ report, reportType = 'free' }: { report: MockReport; reportType?: string }) {
  const [firstName, setFirstName] = useState(report.firstName || 'You')
  const [unlocking, setUnlocking] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('mt_first_name')
    if (stored) setFirstName(stored)
  }, [])

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
    <main style={{ backgroundColor: 'var(--brand-bg)', minHeight: '100vh', color: 'var(--brand-text)' }}>

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
        <button onClick={handleLogout} style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10,
          background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
          borderRadius: '100px', padding: '7px 18px',
          fontSize: '0.8rem', color: 'var(--brand-text-mid)', cursor: 'pointer',
          fontFamily: 'inherit', fontWeight: 500, boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>Log out</button>

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
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'stretch', flexWrap: 'wrap' }}>
            {/* Left: primary + secondary stacked */}
            <div style={{ flex: '0 0 min(420px, 100%)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.05) 0%, var(--brand-card) 100%)',
                borderRadius: '24px', padding: '2rem', border: '1px solid rgba(37,99,235,0.22)', boxShadow: CARD_FEATURE,
                flex: 1
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
              <div style={{ background: 'var(--brand-card)', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--brand-border)', boxShadow: CARD }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                  Secondary Archetype · {Math.round(report.archetype.secondary.score * 100)}%
                </p>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--brand-text)' }}>{report.archetype.secondary.name}</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-mid)', lineHeight: 1.7, margin: 0 }}>{report.archetype.secondary.description}</p>
              </div>
            </div>
            {/* Right: radar — fills height of left column */}
            <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
              <ArchetypeRadar scores={report.archetype.radar_scores} primaryAxis={report.archetype.primary.name} />
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
        <div style={CONTENT}>
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
        <div style={CONTENT}>
          <SectionHeader label="11" title="Your Full Report" />
          {reportType === 'paid' ? (
            <PremiumSections report={report} />
          ) : (
            <LockedSection onUnlock={handleUnlock} unlocking={unlocking} />
          )}
        </div>

        {/* Strategy Call CTA */}
        <div style={{
          maxWidth: '760px', margin: '0 auto', marginBottom: '3.5rem',
          background: 'var(--brand-card)', borderRadius: '24px',
          border: '1px solid rgba(37,99,235,0.2)',
          boxShadow: '0 8px 40px rgba(37,99,235,0.08)', overflow: 'hidden'
        }}>
          <div style={{ padding: '2rem 2rem 1.5rem', textAlign: 'center', borderBottom: '1px solid var(--brand-border)' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)',
              borderRadius: '100px', padding: '5px 14px', marginBottom: '1rem',
              fontSize: '0.7rem', color: '#2563eb', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700
            }}>Work with Sam</div>
            <h3 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, color: 'var(--brand-text)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              Book a MyTwenties Strategy Call
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-mid)', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto' }}>
              A free 30-minute call with Sam. We take what&apos;s in your report and map out exactly what to do next — specific to you.
            </p>
          </div>
          <iframe
            src="https://api.leadconnectorhq.com/widget/booking/ibvCFYwaWf95LNjupgii"
            style={{ width: '100%', height: '700px', border: 'none', display: 'block' }}
            scrolling="yes"
            title="Book a MyTwenties Strategy Call"
          />
        </div>

        {/* 12 · SHARE */}
        <div style={{ maxWidth: '760px', margin: '0 auto', marginBottom: '4rem' }}>
          <SectionHeader label="12" title="Share Your Result" />
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
    <div style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.62rem', color: 'var(--brand-text-subtle)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
        <div style={{ height: '1px', background: 'linear-gradient(to right, var(--brand-border), transparent)', flex: 1 }} />
      </div>
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
              title: 'AI Mentor Prompt',
              icon: '🤖',
              sell: 'A ready-to-paste system prompt that turns Claude or ChatGPT into a personal mentor who knows your full profile and advises you accordingly.',
              preview: `Copy this into Claude or ChatGPT and it becomes a thinking partner that understands your archetype, knows your blind spots, and gives you advice calibrated to how you actually work — not generic coaching:`,
              blur: `built from your full assessment data so every response it gives you is filtered through your specific psychology and not a one-size-fits-all playbook...`
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
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 1.75rem' }}>
          Business Blueprint, Career Map, your Highest Leverage Move, Reading List, AI Mentor Prompt, and a personal letter written for you.
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

function PremiumSections({ report }: { report: MockReport }) {
  const CF = '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)'
  const C = '0 4px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {report.business_blueprint && (
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-text)', marginBottom: '1.25rem' }}>🏗️ Business Blueprint</h3>
          <div style={{ background: 'var(--brand-card)', borderRadius: '20px', padding: '2rem', border: '1px solid var(--brand-border)', boxShadow: CF }}>
            <p style={{ fontSize: '0.72rem', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '4px' }}>Model</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '1rem' }}>{report.business_blueprint.model}</p>
            <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>{report.business_blueprint.why_it_fits}</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '0.875rem' }}>Your First Steps</p>
            <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
              {report.business_blueprint.first_steps.map((step, i) => (
                <li key={i} style={{ fontSize: '0.92rem', color: 'var(--brand-text-muted)', lineHeight: 1.75, marginBottom: '0.625rem' }}>{step}</li>
              ))}
            </ol>
            <div style={{ marginTop: '1.75rem', background: 'rgba(37,99,235,0.05)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(37,99,235,0.12)' }}>
              <p style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Timeline</p>
              <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-strong)', lineHeight: 1.75, margin: 0 }}>{report.business_blueprint.realistic_timeline}</p>
            </div>
          </div>
        </div>
      )}

      {report.career_map && (
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-text)', marginBottom: '0.625rem' }}>🗺️ Career Direction Map</h3>
          <p style={{ fontSize: '1rem', color: 'var(--brand-text-mid)', lineHeight: 1.7, marginBottom: '0.75rem', fontWeight: 600 }}>{report.career_map.headline}</p>
          <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-muted)', lineHeight: 1.8, marginBottom: '1.25rem' }}>{report.career_map.why}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {report.career_map.roles.map((role, i) => (
              <div key={i} style={{ background: 'var(--brand-card)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--brand-border)', boxShadow: C }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '0.5rem' }}>{role.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--brand-text-muted)', lineHeight: 1.75, marginBottom: '0.75rem' }}>{role.description}</p>
                <p style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>{role.income}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {report.highest_leverage_move && (
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-text)', marginBottom: '1.25rem' }}>⚡ Highest Leverage Move</h3>
          <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.05) 0%, var(--brand-card) 100%)', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(37,99,235,0.18)', boxShadow: CF }}>
            <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--brand-text)', lineHeight: 1.5, marginBottom: '1rem' }}>{report.highest_leverage_move.move}</p>
            <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-muted)', lineHeight: 1.8, marginBottom: '1.25rem' }}>{report.highest_leverage_move.why_now}</p>
            <div style={{ background: 'rgba(37,99,235,0.05)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(37,99,235,0.12)' }}>
              <p style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>How to Start</p>
              <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-strong)', lineHeight: 1.75, margin: 0 }}>{report.highest_leverage_move.how_to_start}</p>
            </div>
          </div>
        </div>
      )}

      {report.reading_list && (
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-text)', marginBottom: '1.25rem' }}>📚 Reading List</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {report.reading_list.map((book, i) => (
              <div key={i} style={{ background: 'var(--brand-card)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--brand-border)', boxShadow: C, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', color: '#2563eb', fontWeight: 800 }}>{i + 1}</div>
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '2px' }}>{book.title}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--brand-text-subtle)', marginBottom: '6px' }}>{book.author}</p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--brand-text-muted)', lineHeight: 1.7, margin: 0 }}>{book.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {report.ai_mentor_prompt && (
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-text)', marginBottom: '0.625rem' }}>🤖 Your AI Mentor Prompt</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--brand-text-subtle)', marginBottom: '1rem' }}>Paste this into Claude or ChatGPT to create a personalised AI mentor who knows everything about you.</p>
          <div style={{ background: 'var(--brand-bg-subtle)', borderRadius: '16px', padding: '1.75rem', border: '1px solid var(--brand-border)', fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--brand-text-strong)', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {report.ai_mentor_prompt}
          </div>
        </div>
      )}

      {report.the_letter && (
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-text)', marginBottom: '1.25rem' }}>✉️ A Letter To You</h3>
          <div style={{ background: 'var(--brand-card)', borderRadius: '24px', padding: '2.75rem', border: '1px solid var(--brand-border)', boxShadow: CF }}>
            {report.the_letter.map((para, i) => (
              <p key={i} style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.9, color: 'var(--brand-text-strong)', marginBottom: i < report.the_letter!.length - 1 ? '1.5rem' : 0 }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
