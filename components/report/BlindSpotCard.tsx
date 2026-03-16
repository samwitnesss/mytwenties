'use client'

interface BlindSpot {
  name: string
  severity: number // 0-1
  description: string
  source_strength: string
  reframe: string
}

export default function BlindSpotCard({ blindspot }: { blindspot: BlindSpot }) {
  const severityColor = blindspot.severity > 0.7 ? '#EF4444' : blindspot.severity > 0.4 ? '#F59E0B' : '#A78BFA'
  const severityLabel = blindspot.severity > 0.7 ? 'High' : blindspot.severity > 0.4 ? 'Medium' : 'Low'

  return (
    <div style={{
      background: 'var(--brand-card)', borderRadius: '20px', padding: '2rem',
      border: '1px solid var(--brand-border)', position: 'relative', overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)'
    }}>
      {/* Severity bar left */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
        background: `linear-gradient(to bottom, ${severityColor}, transparent)`
      }} />

      <div style={{ paddingLeft: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--brand-text)', minWidth: 0 }}>
            {blindspot.name}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, color: severityColor,
              background: `${severityColor}18`, borderRadius: '100px', padding: '4px 12px',
              border: `1px solid ${severityColor}30`
            }}>
              {severityLabel} Impact
            </span>
            <span style={{
              fontSize: '0.7rem', color: 'var(--brand-text-subtle)',
              background: 'var(--brand-bg-subtle)', borderRadius: '100px', padding: '3px 10px',
              border: '1px solid var(--brand-border)'
            }}>
              From: {blindspot.source_strength}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-muted)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
          {blindspot.description}
        </p>

        {/* Reframe — thought bubble style */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(37,99,235,0.08) 100%)',
          borderRadius: '20px', padding: '1.5rem 1.75rem',
          border: '2px solid rgba(6,182,212,0.3)',
          position: 'relative'
        }}>
          {/* Bubble dot trail */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            {[6, 4, 3].map((size, i) => (
              <div key={i} style={{
                width: `${size}px`, height: `${size}px`, borderRadius: '50%',
                background: '#06b6d4', opacity: 0.5 + i * 0.15
              }} />
            ))}
          </div>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0891b2', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Reframe
          </p>
          <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--brand-text-strong)', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
            &ldquo;{blindspot.reframe}&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
