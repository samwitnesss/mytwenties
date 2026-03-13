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

function BigRadar({ scores }: { scores: RadarScore[] }) {
  const cx = 150, cy = 150, r = 118, n = scores.length
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
  const labelPts = scores.map((s, i) => {
    const a = angle(i)
    const labelR = r + 22
    return {
      x: cx + labelR * Math.cos(a),
      y: cy + labelR * Math.sin(a),
      label: s.axis,
      value: s.value,
      anchor: (Math.cos(a) > 0.1 ? 'start' : Math.cos(a) < -0.1 ? 'end' : 'middle') as 'start' | 'end' | 'middle'
    }
  })

  return (
    <svg width="300" height="300" viewBox="0 0 300 300" style={{ display: 'block', overflow: 'visible' }}>
      {grids.map((pts, gi) => (
        <polygon key={gi} points={pts} fill="none" stroke="rgba(6,182,212,0.18)" strokeWidth="1" />
      ))}
      {spokes.map((s, i) => (
        <line key={i} x1={cx} y1={cy} x2={s.x2} y2={s.y2} stroke="rgba(6,182,212,0.18)" strokeWidth="1" />
      ))}
      <polygon
        points={dataPoints}
        fill="rgba(37,99,235,0.25)"
        stroke="#06b6d4"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {scores.map((s, i) => {
        const a = angle(i)
        const dotX = cx + r * (s.value / 100) * Math.cos(a)
        const dotY = cy + r * (s.value / 100) * Math.sin(a)
        return (
          <circle key={i} cx={dotX} cy={dotY} r="5" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.5" />
        )
      })}
      {labelPts.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={l.y + 4}
          textAnchor={l.anchor}
          fill="rgba(255,255,255,0.55)"
          fontSize="10"
          fontFamily="system-ui, sans-serif"
          fontWeight="500"
        >
          {l.label}
        </text>
      ))}
    </svg>
  )
}

export default function ShareableCard({ archetype, topStrength, cardHeadline, subtext, mirrorHeadline, radarScores }: ShareableCardProps) {
  const [copied, setCopied] = useState(false)

  const topAxis = radarScores && radarScores.length > 0
    ? radarScores.reduce((best, s) => s.value > best.value ? s : best, radarScores[0])
    : null

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
        borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(6,182,212,0.3)',
        boxShadow: '0 0 60px rgba(6,182,212,0.2)'
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '10%', right: '-20%', width: '240px', height: '240px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-15%', width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(35px)', pointerEvents: 'none'
        }} />

        {/* Top: brand + archetype */}
        <div style={{ position: 'relative' }}>
          {/* my twenties brand mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '1.25rem' }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '6px',
              background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(255,255,255,0.9)' }} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.01em' }}>
              my<span style={{ color: '#22d3ee' }}>twenties</span>
            </span>
          </div>

          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Your archetype
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.2rem' }}>
            <span className="gradient-text">{archetype}</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
            {subtext}
          </div>
        </div>

        {/* Middle: radar with strongest dimension label above */}
        {radarScores && radarScores.length > 0 && (
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            {topAxis && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>
                  strongest dimension
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#22d3ee', letterSpacing: '-0.01em' }}>
                  {topAxis.axis}
                </div>
              </div>
            )}
            <BigRadar scores={radarScores} />
          </div>
        )}

        {/* Bottom: mirror + headline + strength */}
        <div style={{ position: 'relative' }}>
          {mirrorHeadline && (
            <div style={{
              background: 'rgba(6,182,212,0.1)', borderRadius: '10px', padding: '0.6rem 0.9rem',
              border: '1px solid rgba(6,182,212,0.2)', marginBottom: '0.75rem'
            }}>
              <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>The Mirror</p>
              <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>
                &ldquo;{mirrorHeadline}&rdquo;
              </p>
            </div>
          )}
          <p style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4, color: '#ffffff', marginBottom: '0.75rem' }}>
            &ldquo;{cardHeadline}&rdquo;
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '7px 11px', background: 'rgba(6,182,212,0.15)',
            borderRadius: '9px', border: '1px solid rgba(6,182,212,0.25)'
          }}>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Top strength</span>
            <span style={{ fontSize: '0.65rem', color: '#22d3ee', fontWeight: 600 }}>{topStrength}</span>
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
