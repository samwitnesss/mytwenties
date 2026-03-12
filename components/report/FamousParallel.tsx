'use client'

interface Parallel {
  name: string
  connection: string
  key_lesson: string
  image_search_term: string
}

export default function FamousParallel({ parallel }: { parallel: Parallel }) {
  const initials = parallel.name.split(' ').map(n => n[0]).join('')

  return (
    <div style={{
      background: '#ffffff', borderRadius: '20px', overflow: 'hidden',
      border: '1px solid #e2e8f0', flex: '1 1 280px', minWidth: '260px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      {/* Image placeholder */}
      <div style={{
        height: '140px',
        background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(6,182,212,0.12) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(37,99,235,0.15)', border: '2px solid rgba(37,99,235,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', fontWeight: 700, color: '#2563eb'
        }}>
          {initials}
        </div>
        <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)' }}>
          <span style={{
            fontSize: '1rem', fontWeight: 700, color: '#0f172a'
          }}>
            {parallel.name}
          </span>
        </div>
      </div>

      <div style={{ padding: '1.25rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.65, marginBottom: '1rem' }}>
          {parallel.connection}
        </p>
        <div style={{
          background: 'rgba(37,99,235,0.05)', borderRadius: '10px', padding: '0.75rem',
          border: '1px solid rgba(37,99,235,0.15)'
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Key Lesson
          </p>
          <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
            &ldquo;{parallel.key_lesson}&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
