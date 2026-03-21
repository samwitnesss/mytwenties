import Link from 'next/link'

export default function NotFound() {
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
          fontSize: '5rem', fontWeight: 800, lineHeight: 1,
          background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          404
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-text)', marginBottom: '0.75rem' }}>
          Page not found
        </h1>
        <p style={{ color: 'var(--brand-text-mid)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="gradient-btn"
          style={{
            display: 'inline-block', padding: '14px 32px',
            color: '#ffffff', borderRadius: '12px',
            fontSize: '1rem', fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
