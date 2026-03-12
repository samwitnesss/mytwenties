'use client'

interface Strength {
  rank: number
  name: string
  score: number // 0-1
  description: string
  income_angle: string
}

export default function StrengthStack({ strengths }: { strengths: Strength[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {strengths.map((s) => (
        <div key={s.rank} style={{
          background: '#ffffff', borderRadius: '16px', padding: '1.25rem 1.5rem',
          border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(to right, #2563eb, #06b6d4)',
            opacity: s.score
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
            {/* Rank */}
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: '#2563eb'
            }}>
              {s.rank}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{s.name}</h4>
                <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
                  {Math.round(s.score * 100)}%
                </span>
              </div>
              {/* Bar */}
              <div style={{ height: '4px', borderRadius: '2px', background: '#e2e8f0', marginBottom: '0.75rem' }}>
                <div style={{
                  height: '100%', borderRadius: '2px',
                  width: `${s.score * 100}%`,
                  background: 'linear-gradient(to right, #2563eb, #06b6d4)',
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.75rem', marginLeft: '44px' }}>
            {s.description}
          </p>

          <div style={{ marginLeft: '44px' }}>
            <span style={{
              fontSize: '0.72rem', color: '#0891b2', background: 'rgba(6,182,212,0.07)',
              borderRadius: '100px', padding: '3px 10px', border: '1px solid rgba(6,182,212,0.2)',
              fontWeight: 500
            }}>
              💰 {s.income_angle}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
