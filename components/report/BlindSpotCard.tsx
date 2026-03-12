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
      background: '#ffffff', borderRadius: '16px', padding: '1.5rem',
      border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      {/* Severity border left */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
        background: `linear-gradient(to bottom, ${severityColor}, transparent)`
      }} />

      <div style={{ paddingLeft: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', flex: 1, marginRight: '1rem' }}>
            {blindspot.name}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
            <span style={{
              fontSize: '0.7rem', fontWeight: 600, color: severityColor,
              background: `${severityColor}15`, borderRadius: '100px', padding: '3px 10px',
              border: `1px solid ${severityColor}25`
            }}>
              {severityLabel} Impact
            </span>
            <span style={{
              fontSize: '0.7rem', color: '#94a3b8',
              background: '#f1f5f9', borderRadius: '100px', padding: '3px 10px'
            }}>
              From: {blindspot.source_strength}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.65, marginBottom: '1rem' }}>
          {blindspot.description}
        </p>

        <div style={{
          background: 'rgba(37,99,235,0.05)', borderRadius: '10px', padding: '0.875rem 1rem',
          border: '1px solid rgba(37,99,235,0.15)'
        }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2563eb', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Reframe
          </p>
          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
            {blindspot.reframe}
          </p>
        </div>
      </div>
    </div>
  )
}
