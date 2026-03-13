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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
      {strengths.map((s) => (
        <div key={s.rank} style={{
          background: 'var(--brand-card)', borderRadius: '20px', padding: '1.25rem 1.5rem',
          border: '1px solid var(--brand-border)', position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)'
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(to right, #2563eb, #06b6d4)',
            opacity: 0.6 + s.score * 0.4
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
              background: 'rgba(37,99,235,0.08)', border: '1.5px solid rgba(37,99,235,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem', fontWeight: 800, color: '#2563eb'
            }}>
              {s.rank}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-text)' }}>{s.name}</h4>
                <span style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 800 }}>
                  {Math.round(s.score * 100)}%
                </span>
              </div>
              {/* Bar with end-dot */}
              <div style={{ position: 'relative', height: '8px', borderRadius: '4px', background: 'var(--brand-border)' }}>
                <div style={{
                  height: '100%', borderRadius: '4px',
                  width: `${s.score * 100}%`,
                  background: 'linear-gradient(to right, #2563eb, #06b6d4)',
                  transition: 'width 1s ease'
                }} />
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
                  left: `${s.score * 100}%`,
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: '#06b6d4', border: '2.5px solid #0891b2',
                  boxShadow: '0 0 12px rgba(6,182,212,0.6)'
                }} />
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.92rem', color: 'var(--brand-text-muted)', lineHeight: 1.75, marginBottom: '1.25rem', marginLeft: '56px' }}>
            {s.description}
          </p>

          <div style={{ marginLeft: '56px' }}>
            <div style={{
              background: 'rgba(6,182,212,0.06)', borderRadius: '12px', padding: '0.875rem 1.1rem',
              border: '1px solid rgba(6,182,212,0.2)'
            }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0891b2', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Income Angle
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--brand-text-muted)', lineHeight: 1.6, margin: 0 }}>
                {s.income_angle}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
