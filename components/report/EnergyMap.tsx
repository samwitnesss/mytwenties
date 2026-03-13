'use client'

interface EnergyBar {
  label_left: string
  label_right: string
  score: number // -1.0 to 1.0
}

export default function EnergyMap({ bars }: { bars: EnergyBar[] }) {
  return (
    <div style={{
      background: 'var(--brand-card)', borderRadius: '20px', padding: '2rem',
      border: '1px solid var(--brand-border)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {bars.map((bar, i) => {
          const markerPosition = ((bar.score + 1) / 2) * 100
          const isLeft = bar.score < 0
          const gradientEnd = markerPosition

          return (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                <span style={{
                  fontSize: isLeft ? '1.2rem' : '0.9rem',
                  color: isLeft ? '#2563eb' : 'var(--brand-text-subtle)',
                  fontWeight: isLeft ? 700 : 400,
                  transition: 'font-size 0.2s',
                  letterSpacing: isLeft ? '-0.01em' : 0
                }}>
                  {bar.label_left}
                </span>
                <span style={{
                  fontSize: !isLeft ? '1.2rem' : '0.9rem',
                  color: !isLeft ? '#2563eb' : 'var(--brand-text-subtle)',
                  fontWeight: !isLeft ? 700 : 400,
                  transition: 'font-size 0.2s',
                  letterSpacing: !isLeft ? '-0.01em' : 0
                }}>
                  {bar.label_right}
                </span>
              </div>
              <div style={{ position: 'relative', height: '12px', borderRadius: '6px', background: 'var(--brand-border)' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${gradientEnd}%`,
                  background: 'linear-gradient(to right, #2563eb, #06b6d4)',
                  borderRadius: '6px'
                }} />
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
                  left: `${markerPosition}%`,
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: '#06b6d4', border: '2.5px solid #0891b2',
                  boxShadow: '0 0 12px rgba(6,182,212,0.55)'
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
