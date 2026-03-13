'use client'

interface Parallel {
  name: string
  connection: string
  key_lesson: string
  image_search_term: string
}

export default function FamousParallel({ parallel }: { parallel: Parallel }) {
  return (
    <div style={{
      background: 'var(--brand-card)', borderRadius: '20px',
      border: '1px solid var(--brand-border)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)'
    }}>
      {/* Name header */}
      <div style={{
        padding: '2rem 2rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(6,182,212,0.06) 100%)',
        borderBottom: '1px solid var(--brand-border)',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: 'clamp(2rem, 5vw, 2.8rem)',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontWeight: 700,
          color: 'var(--brand-text)',
          lineHeight: 1.1,
          margin: 0,
          letterSpacing: '-0.02em'
        }}>
          {parallel.name}
        </p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--brand-text-muted)', lineHeight: 1.75, marginBottom: '1.25rem' }}>
          {parallel.connection}
        </p>

        {/* Key lesson */}
        <div style={{
          background: 'rgba(37,99,235,0.06)',
          borderRadius: '14px', padding: '1.25rem 1.5rem',
          border: '2px solid rgba(37,99,235,0.25)'
        }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2563eb', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Key Lesson
          </p>
          <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--brand-text)', margin: 0, lineHeight: 1.55 }}>
            &ldquo;{parallel.key_lesson}&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
