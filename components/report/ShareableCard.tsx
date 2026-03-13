'use client'

import { useState } from 'react'

interface RadarScore {
  axis: string
  value: number
}

interface ShareableCardProps {
  archetype: string
  topStrength: string
  cardHeadline: string
  subtext: string
  mirrorHeadline?: string
  celebrity?: string
  radarScores?: RadarScore[]
}

function MiniRadar({ scores }: { scores: RadarScore[] }) {
  const cx = 80, cy = 80, r = 62, n = scores.length
  const angle = (i: number) => (2 * Math.PI * i / n) - Math.PI / 2
  const pt = (i: number, frac: number) => {
    const a = angle(i)
    return `${cx + r * frac * Math.cos(a)},${cy + r * frac * Math.sin(a)}`
  }
  const dataPoints = scores.map((s, i) => pt(i, s.value / 100)).join(' ')
  const grids = [0.25, 0.5, 0.75, 1].map(f =>
    scores.map((_, i) => pt(i, f)).join(' ')
  )
  const spokes = scores.map((_, i) => ({
    x2: cx + r * Math.cos(angle(i)),
    y2: cy + r * Math.sin(angle(i))
  }))

  return (
    <svg width="160" height="160" viewBox="0 0 160 160" style={{ display: 'block' }}>
      {grids.map((pts, gi) => (
        <polygon key={gi} points={pts} fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="0.8" />
      ))}
      {spokes.map((s, i) => (
        <line key={i} x1={cx} y1={cy} x2={s.x2} y2={s.y2} stroke="rgba(6,182,212,0.2)" strokeWidth="0.8" />
      ))}
      <polygon
        points={dataPoints}
        fill="rgba(37,99,235,0.3)"
        stroke="#06b6d4"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ShareableCard({ archetype, topStrength, cardHeadline, subtext, mirrorHeadline, celebrity, radarScores }: ShareableCardProps) {
  const [copied, setCopied] = useState(false)

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'My MyTwenties Insights',
        text: `I just got my MyTwenties assessment result. My archetype: ${archetype}. "${cardHeadline}"`,
        url: window.location.href
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
      {/* The card */}
      <div style={{
        width: '375px', maxWidth: '100%', aspectRatio: '9/16',
        background: 'linear-gradient(135deg, #020d1a 0%, #0c1f35 50%, #020d1a 100%)',
        borderRadius: '24px', padding: '2.5rem', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(6,182,212,0.3)',
        boxShadow: '0 0 60px rgba(6,182,212,0.2)'
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '15%', right: '-20%', width: '220px', height: '220px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(30px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', left: '-10%', width: '180px', height: '180px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(25px)'
        }} />

        {/* Top: brand + archetype */}
        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)',
            borderRadius: '100px', padding: '4px 12px', marginBottom: '1.5rem'
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#22d3ee', display: 'inline-block' }} />
            <span style={{ fontSize: '0.7rem', color: '#22d3ee', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {subtext}
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            My Archetype
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: 1.1 }}>
            <span className="gradient-text">{archetype}</span>
          </div>
          {celebrity && (
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
              Most like: <span style={{ color: '#22d3ee', fontWeight: 600 }}>{celebrity}</span>
            </div>
          )}
        </div>

        {/* Middle: radar */}
        {radarScores && radarScores.length > 0 && (
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
            <MiniRadar scores={radarScores} />
          </div>
        )}

        {/* Bottom: headline + mirror + strength */}
        <div style={{ position: 'relative' }}>
          {mirrorHeadline && (
            <div style={{
              background: 'rgba(6,182,212,0.1)', borderRadius: '10px', padding: '0.75rem 1rem',
              border: '1px solid rgba(6,182,212,0.2)', marginBottom: '1rem'
            }}>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>The Mirror</p>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>
                &ldquo;{mirrorHeadline}&rdquo;
              </p>
            </div>
          )}
          <p style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.35, color: '#ffffff', marginBottom: '1rem' }}>
            &ldquo;{cardHeadline}&rdquo;
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 12px', background: 'rgba(6,182,212,0.15)',
            borderRadius: '10px', border: '1px solid rgba(6,182,212,0.25)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Top strength</span>
            <span style={{ fontSize: '0.75rem', color: '#22d3ee', fontWeight: 600 }}>{topStrength}</span>
          </div>
        </div>
      </div>

      {/* Share button */}
      <div style={{ display: 'flex', gap: '0.75rem', width: '375px', maxWidth: '100%' }}>
        <button
          onClick={handleShare}
          className="gradient-btn"
          style={{
            flex: 1, padding: '0.875rem', borderRadius: '12px', border: 'none',
            cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#ffffff'
          }}
        >
          {copied ? '✓ Link Copied' : 'Share Your Result'}
        </button>
      </div>
    </div>
  )
}
