'use client'

import { useState } from 'react'

interface ShareableCardProps {
  archetype: string
  topStrength: string
  cardHeadline: string
  subtext: string
}

export default function ShareableCard({ archetype, topStrength, cardHeadline, subtext }: ShareableCardProps) {
  const [copied, setCopied] = useState(false)

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'My MyTwenties Report',
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
          position: 'absolute', top: '20%', right: '-20%', width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(30px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '-10%', width: '150px', height: '150px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(25px)'
        }} />

        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)',
            borderRadius: '100px', padding: '4px 12px', marginBottom: '2rem'
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#22d3ee', display: 'inline-block' }} />
            <span style={{ fontSize: '0.7rem', color: '#22d3ee', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {subtext}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            My Archetype
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.1 }}>
            <span className="gradient-text">{archetype}</span>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.3, color: '#ffffff', marginBottom: '1.5rem' }}>
            &ldquo;{cardHeadline}&rdquo;
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 14px', background: 'rgba(6,182,212,0.15)',
            borderRadius: '10px', border: '1px solid rgba(6,182,212,0.25)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Top strength</span>
            <span style={{ fontSize: '0.8rem', color: '#22d3ee', fontWeight: 600 }}>{topStrength}</span>
          </div>
        </div>
      </div>

      {/* Share buttons */}
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
