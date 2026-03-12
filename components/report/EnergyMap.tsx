'use client'

interface EnergyBar {
  label_left: string
  label_right: string
  score: number // -1.0 to 1.0
}

export default function EnergyMap({ bars }: { bars: EnergyBar[] }) {
  return (
    <div style={{
      background: '#ffffff', borderRadius: '20px', padding: '1.5rem',
      border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b', marginBottom: '1.5rem' }}>
        Energy Map
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {bars.map((bar, i) => {
          const markerPosition = ((bar.score + 1) / 2) * 100
          const isLeft = bar.score < 0
          const gradientEnd = markerPosition

          return (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: isLeft ? '#2563eb' : '#94a3b8', fontWeight: isLeft ? 600 : 400 }}>
                  {bar.label_left}
                </span>
                <span style={{ fontSize: '0.8rem', color: !isLeft ? '#2563eb' : '#94a3b8', fontWeight: !isLeft ? 600 : 400 }}>
                  {bar.label_right}
                </span>
              </div>
              <div style={{ position: 'relative', height: '8px', borderRadius: '4px', background: '#e2e8f0' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${gradientEnd}%`,
                  background: 'linear-gradient(to right, #2563eb, #06b6d4)',
                  borderRadius: '4px'
                }} />
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
                  left: `${markerPosition}%`,
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: '#3b82f6', border: '2px solid #2563eb',
                  boxShadow: '0 0 10px rgba(59,130,246,0.4)'
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
