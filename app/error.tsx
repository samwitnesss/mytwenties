'use client'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main style={{
      backgroundColor: 'var(--brand-bg)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(50px)'
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '440px' }}>
        <div style={{
          fontSize: '3rem', marginBottom: '1rem', lineHeight: 1,
          color: 'var(--brand-text)'
        }}>
          Oops
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '0.75rem' }}>
          Something went wrong
        </h1>
        <p style={{ color: 'var(--brand-text-mid)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          An unexpected error occurred. Your data is safe.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            className="gradient-btn"
            style={{
              padding: '14px 32px', color: '#ffffff', borderRadius: '12px',
              fontSize: '1rem', fontWeight: 600, border: 'none',
              cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            Try Again
          </button>
          <a
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '14px 32px', color: 'var(--brand-text-mid)',
              borderRadius: '12px', fontSize: '1rem', fontWeight: 600,
              textDecoration: 'none', border: '1px solid var(--brand-border)',
              background: 'var(--brand-card)'
            }}
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  )
}
