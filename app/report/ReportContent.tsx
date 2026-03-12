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

const CARD = '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)'
const CARD_FEATURE = '0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)'

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
      if (data.url) {
        window.location.href = data.url
      }
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
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#0f172a' }}>

      {/* ─── HEADER ─────────────────────────────────────── */}
      <section style={{
        position: 'relative', padding: '5rem 2rem 4.5rem', textAlign: 'center',
        background: '#ffffff', borderBottom: '1px solid #e2e8f0', overflow: 'hidden'
      }}>
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.4
        }} />
        {/* Blue glow */}
        <div className="animate-pulse-glow" style={{
          position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '420px',
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.1) 0%, transparent 65%)',
          filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none'
        }} />

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10,
            background: '#ffffff', border: '1px solid #e2e8f0',
            borderRadius: '100px', padding: '7px 18px',
            fontSize: '0.8rem', color: '#64748b', cursor: 'pointer',
            fontFamily: 'inherit', fontWeight: 500,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}
        >
          Log out
        </button>

        <div style={{ position: 'relative', maxWidth: '820px', margin: '0 auto' }}>
          {/* Small badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)',
            borderRadius: '100px', padding: '6px 18px', marginBottom: '2rem',
            fontSize: '0.73rem', color: '#2563eb', letterSpacing: '0.07em',
            textTransform: 'uppercase', fontWeight: 700
          }}>
            MyTwenties · Personal Report
          </div>

          {/* Generated date */}
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            Generated {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          {/* Name */}
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 1.0,
            letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '1.25rem'
          }}>
            {firstName}&apos;s Report
          </h1>

          {/* Archetype pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem',
            background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.22)',
            borderRadius: '100px', padding: '10px 24px'
          }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb' }}>
              {report.archetype.primary.name}
            </span>
            <span style={{
              fontSize: '0.68rem', fontWeight: 700, color: '#64748b',
              background: '#f1f5f9', borderRadius: '100px', padding: '2px 8px'
            }}>
              {archetypeMatch}% match
            </span>
          </div>

          {/* Headline */}
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', color: '#475569', lineHeight: 1.7,
            fontStyle: 'italic', maxWidth: '580px', margin: '0 auto 2.5rem'
          }}>
            &ldquo;{report.identity_profile.headline}&rdquo;
          </p>

          {/* Stat chips */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Top Strength', value: topStrength },
              { label: 'Archetype Match', value: `${archetypeMatch}%` },
              { label: 'Directions', value: `${report.directions.length} paths` },
              { label: 'Sections', value: '12 insights' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: '#f8faff', border: '1px solid #e2e8f0',
                borderRadius: '14px', padding: '0.875rem 1.25rem',
                textAlign: 'center', minWidth: '120px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}>
                <p style={{ fontSize: '0.63rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', fontWeight: 600 }}>
                  {label}
                </p>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ───────────────────────────────── */}
      <div className="report-layout" style={{ maxWidth: '1240px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* ── Identity + Archetype: 2-col (these pair naturally) ── */}
        <div className="report-main-grid" style={{ marginBottom: '0' }}>

          {/* 01 · IDENTITY PROFILE */}
          <div style={{ marginBottom: '3rem' }}>
            <SectionHeader label="01" title="Identity Profile" />
            <div style={{
              background: '#ffffff', borderRadius: '20px', padding: '2rem',
              border: '1px solid #e2e8f0', boxShadow: CARD_FEATURE
            }}>
              <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', lineHeight: 1.9, color: '#334155', marginBottom: '1.5rem' }}>
                {report.identity_profile.summary}
              </p>
              <div style={{
                background: 'rgba(37,99,235,0.05)', borderRadius: '12px', padding: '1rem 1.25rem',
                border: '1px solid rgba(37,99,235,0.15)', marginBottom: '1.5rem'
              }}>
                <p style={{ fontSize: '0.9rem', color: '#2563eb', lineHeight: 1.7, margin: 0, fontStyle: 'italic', fontWeight: 500 }}>
                  &ldquo;{report.identity_profile.core_truth}&rdquo;
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {report.identity_profile.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: '0.78rem', color: '#2563eb', background: 'rgba(37,99,235,0.07)',
                    borderRadius: '100px', padding: '4px 12px', border: '1px solid rgba(37,99,235,0.2)'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 02 · ARCHETYPE CARDS (no radar here) */}
          <div style={{ marginBottom: '3rem' }}>
            <SectionHeader label="02" title="Your Archetype" />
            {/* Primary */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.04) 0%, #ffffff 100%)',
              borderRadius: '20px', padding: '1.75rem',
              border: '1px solid rgba(37,99,235,0.2)', marginBottom: '1rem',
              boxShadow: CARD_FEATURE
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    Primary Archetype
                  </p>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 0 }}>
                    <span className="gradient-text">{report.archetype.primary.name}</span>
                  </h3>
                </div>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(37,99,235,0.08)', border: '2px solid rgba(37,99,235,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: 700, color: '#2563eb'
                }}>
                  {archetypeMatch}%
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.7, marginBottom: '1rem' }}>
                {report.archetype.primary.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                {report.archetype.primary.traits.map(t => (
                  <span key={t} style={{
                    fontSize: '0.72rem', color: '#2563eb', background: 'rgba(37,99,235,0.07)',
                    borderRadius: '100px', padding: '3px 10px', border: '1px solid rgba(37,99,235,0.2)'
                  }}>
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ background: '#f8faff', borderRadius: '10px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  Shadow Side
                </p>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {report.archetype.primary.shadow}
                </p>
              </div>
            </div>

            {/* Secondary */}
            <div style={{
              background: '#ffffff', borderRadius: '16px', padding: '1.25rem',
              border: '1px solid #e2e8f0', boxShadow: CARD
            }}>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                Secondary Archetype · {Math.round(report.archetype.secondary.score * 100)}%
              </p>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
                {report.archetype.secondary.name}
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                {report.archetype.secondary.description}
              </p>
            </div>
          </div>
        </div>

        {/* Archetype Radar — full width after the 2-col section */}
        <div style={{ marginBottom: '3rem' }}>
          <ArchetypeRadar scores={report.archetype.radar_scores} primaryAxis={report.archetype.primary.name} />
        </div>

        {/* 03 · HIDDEN DYNAMICS */}
        <SectionHeader label="03" title="Hidden Dynamics" />
        <div className="report-card-grid" style={{ marginBottom: '3rem' }}>
          {report.hidden_dynamics.map((d, i) => (
            <div key={i} style={{
              background: '#ffffff', borderRadius: '16px', padding: '1.5rem',
              border: '1px solid #e2e8f0', boxShadow: CARD
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                {d.name}
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.7, marginBottom: '1rem' }}>
                {d.description}
              </p>
              <div style={{
                background: 'rgba(6,182,212,0.05)', borderRadius: '10px', padding: '0.875rem',
                border: '1px solid rgba(6,182,212,0.15)'
              }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0891b2', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Implication
                </p>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {d.implication}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 04 · STRENGTH STACK */}
        <SectionHeader label="04" title="Your Strength Stack" />
        <div style={{ marginBottom: '3rem' }}>
          <StrengthStack strengths={report.strengths} />
        </div>

        {/* 05 · BLIND SPOTS */}
        <SectionHeader label="05" title="Your Blind Spots" />
        <div className="report-card-grid" style={{ marginBottom: '3rem' }}>
          {report.blind_spots.map((b, i) => (
            <BlindSpotCard key={i} blindspot={b} />
          ))}
        </div>

        {/* 06 · ENERGY MAP */}
        <SectionHeader label="06" title="Energy Map" />
        <div style={{ marginBottom: '3rem' }}>
          <EnergyMap bars={report.energy_map} />
        </div>

      </div>

      {/* ─── THE MIRROR — full-width band ───────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(37,99,235,0.03) 0%, rgba(6,182,212,0.03) 100%)',
        padding: '5rem 2rem',
        borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0',
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
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
            07 · The Mirror
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: '2.5rem', lineHeight: 1.2, color: '#0f172a' }}>
            {report.the_mirror.headline}
          </h2>
          <div style={{ textAlign: 'left' }}>
            {report.the_mirror.body.map((para, i) => (
              <p key={i} style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', lineHeight: 1.9,
                color: '#334155', marginBottom: i < report.the_mirror.body.length - 1 ? '1.5rem' : 0
              }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECOND CONTENT BLOCK ────────────────────────── */}
      <div className="report-layout" style={{ maxWidth: '1240px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* 08 · FAMOUS PARALLELS */}
        <SectionHeader label="08" title="Famous Parallels" />
        <div className="report-card-grid" style={{ marginBottom: '3rem' }}>
          {report.famous_parallels.map((p, i) => (
            <FamousParallel key={i} parallel={p} />
          ))}
        </div>

        {/* 09 · DIRECTION COMPASS */}
        <SectionHeader label="09" title="Direction Compass" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '760px', margin: '0 auto 3rem' }}>
          {report.directions.map((d, i) => (
            <DirectionCard key={i} direction={d} rank={i + 1} />
          ))}
        </div>

        {/* 10 · DREAM DAY — full width */}
        <SectionHeader label="10" title="Your Dream Day" />
        <div style={{
          background: '#ffffff', borderRadius: '20px', padding: '2.5rem',
          border: '1px solid #e2e8f0', marginBottom: '3rem',
          boxShadow: CARD_FEATURE,
          maxWidth: '760px', margin: '0 auto 3rem'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', fontStyle: 'italic' }}>
            &ldquo;{report.dream_day.headline}&rdquo;
          </h3>
          {report.dream_day.body.split('\n\n').filter(p => p.trim()).map((para, i) => (
            <p key={i} style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#475569', marginBottom: '1.25rem' }}>
              {para}
            </p>
          ))}
        </div>

        {/* 11 · FULL REPORT — premium or locked */}
        <SectionHeader label="11" title="Your Full Report" />

        {reportType === 'paid' ? (
          <PremiumSections report={report} />
        ) : (
          <LockedSection onUnlock={handleUnlock} unlocking={unlocking} />
        )}

        {/* Strategy Call CTA */}
        <div style={{
          background: '#ffffff', borderRadius: '20px',
          border: '1px solid rgba(37,99,235,0.2)', marginBottom: '3rem',
          boxShadow: '0 4px 24px rgba(37,99,235,0.06)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ padding: '2rem 2rem 1.5rem', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)',
              borderRadius: '100px', padding: '5px 14px', marginBottom: '1rem',
              fontSize: '0.7rem', color: '#2563eb', letterSpacing: '0.06em',
              textTransform: 'uppercase', fontWeight: 700
            }}>
              Work with Sam
            </div>
            <h3 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              Book a MyTwenties Strategy Call
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto' }}>
              A free 30-minute call with Sam. We take what&apos;s in your report and map out exactly what to do next — specific to you.
            </p>
          </div>
          {/* Embedded booking widget */}
          <iframe
            src="https://api.leadconnectorhq.com/widget/booking/ibvCFYwaWf95LNjupgii"
            style={{ width: '100%', height: '700px', border: 'none', display: 'block' }}
            scrolling="yes"
            title="Book a MyTwenties Strategy Call"
          />
        </div>

        {/* 12 · SHARE */}
        <SectionHeader label="12" title="Share Your Result" />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
          <ShareableCard
            archetype={report.shareable_card.archetype}
            topStrength={report.shareable_card.top_strength}
            cardHeadline={report.shareable_card.card_headline}
            subtext={report.shareable_card.subtext}
          />
        </div>

      </div>

      {/* Footer */}
      <footer style={{
        padding: '2rem 1.5rem', textAlign: 'center',
        borderTop: '1px solid #e2e8f0', background: '#ffffff'
      }}>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
          © 2026 MyTwenties · Your data is private.
        </p>
      </footer>
    </main>
  )
}

function SectionHeader({ label, title }: { label: string, title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
      <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.1em', flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ height: '1px', background: '#e2e8f0', flex: 1 }} />
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', flexShrink: 0, margin: 0 }}>
        {title}
      </h2>
      <div style={{ height: '1px', background: '#e2e8f0', flex: 1 }} />
    </div>
  )
}

function LockedSection({ onUnlock, unlocking }: { onUnlock: () => void; unlocking: boolean }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
      borderRadius: '24px', overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 24px 80px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15)',
      marginBottom: '3rem', position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(6,182,212,0.15) 0%, transparent 65%)',
        filter: 'blur(50px)', pointerEvents: 'none'
      }} />

      <div style={{ padding: '2.5rem 2.5rem 0', position: 'relative' }}>
        <div className="report-card-grid" style={{ pointerEvents: 'none', userSelect: 'none' }}>
          {[
            { title: 'Business Blueprint', preview: `Based on your archetype and high autonomy drive, the business model with the highest probability of success for you is` },
            { title: 'Career Direction Map', preview: `The roles most aligned with how your brain works aren't the obvious ones. The specific career path that fits your wiring is` },
            { title: 'Highest Leverage Move', preview: `Of everything you could do right now, one action will produce more momentum than anything else in the next 30 days:` },
            { title: 'The Letter', preview: `There's something I want to say to you directly. Something people in your life probably see but haven't told you. It's this:` },
          ].map((item) => (
            <div key={item.title} style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden'
            }}>
              <p style={{ fontSize: '0.68rem', color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', fontWeight: 600 }}>
                Premium Section
              </p>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>
                {item.preview}
                <span style={{ filter: 'blur(5px)', color: 'rgba(255,255,255,0.5)' }}>
                  {' '}a highly specific, founder-led model where your natural intensity becomes your biggest competitive advantage rather than a liability...
                </span>
              </p>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px',
          background: 'linear-gradient(to bottom, transparent, #0f172a)'
        }} />
      </div>

      <div style={{ textAlign: 'center', padding: '1rem 2.5rem 3rem', position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: '100px', padding: '6px 18px', marginBottom: '1.25rem',
          fontSize: '0.72rem', color: '#22d3ee', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600
        }}>
          5 sections locked
        </div>
        <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
          Unlock your complete report
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {[
            { label: '3 therapy sessions', price: '$450', crossed: true },
            { label: 'Career coaching', price: '$300', crossed: true },
            { label: 'Your full report', price: '$29', crossed: false },
          ].map(({ label, price, crossed }) => (
            <div key={label} style={{
              background: crossed ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.15)',
              border: `1px solid ${crossed ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.4)'}`,
              borderRadius: '10px', padding: '0.5rem 1rem', textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.65rem', color: crossed ? 'rgba(255,255,255,0.35)' : '#93c5fd', margin: '0 0 2px', textDecoration: crossed ? 'line-through' : 'none' }}>
                {label}
              </p>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: crossed ? 'rgba(255,255,255,0.25)' : '#ffffff', margin: 0, textDecoration: crossed ? 'line-through' : 'none' }}>
                {price}
              </p>
            </div>
          ))}
        </div>
        <button
          className="gradient-btn"
          onClick={onUnlock}
          disabled={unlocking}
          style={{
            fontSize: '1.05rem', fontWeight: 700, color: '#ffffff',
            padding: '0.9rem 2.5rem', borderRadius: '100px', border: 'none',
            cursor: unlocking ? 'wait' : 'pointer',
            boxShadow: '0 8px 30px rgba(59,130,246,0.4)', opacity: unlocking ? 0.7 : 1
          }}
        >
          {unlocking ? 'Loading...' : 'Unlock Full Report for $29 →'}
        </button>
        <p style={{ marginTop: '0.875rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
          One-time payment · yours forever · No subscription
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
          Not satisfied? Full refund, no questions asked.
        </p>
      </div>
    </div>
  )
}

function PremiumSections({ report }: { report: MockReport }) {
  const CARD = '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)'
  const CARD_FEATURE = '0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)'

  return (
    <div style={{ marginBottom: '3rem' }}>
      {/* Business Blueprint */}
      {report.business_blueprint && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Business Blueprint</h3>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: CARD_FEATURE, marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.72rem', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '4px' }}>Model</p>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>{report.business_blueprint.model}</p>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: '1.5rem' }}>{report.business_blueprint.why_it_fits}</p>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '0.75rem' }}>Your First Steps</p>
            <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
              {report.business_blueprint.first_steps.map((step, i) => (
                <li key={i} style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.7, marginBottom: '0.5rem' }}>{step}</li>
              ))}
            </ol>
            <div style={{ marginTop: '1.5rem', background: 'rgba(37,99,235,0.05)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(37,99,235,0.12)' }}>
              <p style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Timeline</p>
              <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>{report.business_blueprint.realistic_timeline}</p>
            </div>
          </div>
        </div>
      )}

      {/* Career Map */}
      {report.career_map && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Career Direction Map</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.7, marginBottom: '1rem' }}>{report.career_map.headline}</p>
          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: '1.25rem' }}>{report.career_map.why}</p>
          <div className="report-card-grid">
            {report.career_map.roles.map((role, i) => (
              <div key={i} style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: CARD }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>{role.title}</h4>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.7, marginBottom: '0.75rem' }}>{role.description}</p>
                <p style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>{role.income}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Highest Leverage Move */}
      {report.highest_leverage_move && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Highest Leverage Move</h3>
          <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.04) 0%, #ffffff 100%)', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(37,99,235,0.18)', boxShadow: CARD_FEATURE }}>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.5, marginBottom: '1rem' }}>{report.highest_leverage_move.move}</p>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: '1rem' }}>{report.highest_leverage_move.why_now}</p>
            <div style={{ background: 'rgba(37,99,235,0.05)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(37,99,235,0.12)' }}>
              <p style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>How to Start</p>
              <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>{report.highest_leverage_move.how_to_start}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reading List */}
      {report.reading_list && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Reading List</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {report.reading_list.map((book, i) => (
              <div key={i} style={{ background: '#ffffff', borderRadius: '14px', padding: '1.25rem 1.5rem', border: '1px solid #e2e8f0', boxShadow: CARD, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem', color: '#2563eb', fontWeight: 800 }}>
                  {i + 1}
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{book.title}</p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>{book.author}</p>
                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>{book.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Mentor Prompt */}
      {report.ai_mentor_prompt && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Your AI Mentor Prompt</h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1rem' }}>Paste this into Claude or ChatGPT to create a personalised AI mentor who knows everything about you.</p>
          <div style={{ background: '#f8faff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e2e8f0', fontFamily: 'monospace', fontSize: '0.78rem', color: '#334155', lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {report.ai_mentor_prompt}
          </div>
        </div>
      )}

      {/* The Letter */}
      {report.the_letter && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>A Letter To You</h3>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: CARD_FEATURE, maxWidth: '680px' }}>
            {report.the_letter.map((para, i) => (
              <p key={i} style={{ fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', lineHeight: 1.9, color: '#334155', marginBottom: i < report.the_letter!.length - 1 ? '1.5rem' : 0 }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
