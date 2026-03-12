'use client'

export default function TheLetterRenderer({ firstName, body }: { firstName: string, body: string }) {
  const paragraphs = body.split('\n\n').filter(p => p.trim())

  return (
    <div style={{
      background: 'rgba(245,240,230,0.05)', borderRadius: '20px', padding: '2.5rem',
      border: '1px solid rgba(245,240,230,0.1)',
      boxShadow: '0 0 60px rgba(124,58,237,0.08)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Subtle texture effect */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.5) 28px, rgba(255,255,255,0.5) 29px)',
        borderRadius: '20px'
      }} />

      <div style={{ position: 'relative' }}>
        <p className="font-serif" style={{
          fontSize: '1rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem',
          fontStyle: 'italic'
        }}>
          For {firstName},
        </p>

        {paragraphs.map((paragraph, i) => (
          <p key={i} className="font-serif" style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.85,
            marginBottom: i < paragraphs.length - 1 ? '1.5rem' : 0
          }}>
            {paragraph}
          </p>
        ))}

        <p className="font-serif" style={{
          fontSize: '1rem', color: 'rgba(255,255,255,0.4)', marginTop: '2rem',
          fontStyle: 'italic'
        }}>
          — Your Report
        </p>
      </div>
    </div>
  )
}
