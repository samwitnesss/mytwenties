'use client'

interface Direction {
  title: string
  type: string
  fit_score: number // 0-1
  why_it_fits: string
  what_it_looks_like: string
  income_potential: {
    month_3: string
    month_6: string
    month_12: string
  }
}

export default function DirectionCard({ direction, rank }: { direction: Direction, rank: number }) {
  const typeColor = direction.type === 'entrepreneurial' ? '#06B6D4' : direction.type === 'hybrid' ? '#0284C7' : '#2563EB'
  const percentage = Math.round(direction.fit_score * 100)
  const circumference = 2 * Math.PI * 22
  const strokeDash = (percentage / 100) * circumference

  return (
    <div style={{
      background: 'var(--brand-card)', borderRadius: '20px', padding: '1.5rem',
      border: '1px solid #e2e8f0', position: 'relative',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Fit score circle */}
        <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0 }}>
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="#e2e8f0" strokeWidth="3" />
            <circle
              cx="28" cy="28" r="22"
              fill="none"
              stroke={typeColor}
              strokeWidth="3"
              strokeDasharray={`${strokeDash} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90 28 28)"
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: typeColor }}>{percentage}%</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Direction {rank}</span>
            <span style={{
              fontSize: '0.68rem', fontWeight: 600, color: typeColor,
              background: `${typeColor}15`, borderRadius: '100px', padding: '2px 8px',
              border: `1px solid ${typeColor}25`, textTransform: 'capitalize'
            }}>
              {direction.type}
            </span>
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
            {direction.title}
          </h4>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Why it fits you
        </p>
        <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.65 }}>
          {direction.why_it_fits}
        </p>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          What it looks like
        </p>
        <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.65 }}>
          {direction.what_it_looks_like}
        </p>
      </div>

      {/* Income timeline */}
      <div style={{
        background: '#f8faff', borderRadius: '12px', padding: '1rem',
        border: '1px solid #e2e8f0'
      }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Income Potential
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { label: 'Month 3', value: direction.income_potential.month_3 },
            { label: 'Month 6', value: direction.income_potential.month_6 },
            { label: 'Month 12', value: direction.income_potential.month_12 }
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, color: typeColor, flexShrink: 0,
                background: `${typeColor}10`, borderRadius: '6px', padding: '2px 7px',
                border: `1px solid ${typeColor}20`, minWidth: '58px', textAlign: 'center'
              }}>
                {label}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.4, flex: 1, wordBreak: 'break-word' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
