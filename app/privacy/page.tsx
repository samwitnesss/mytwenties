import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main style={{ backgroundColor: 'var(--brand-bg)', minHeight: '100vh', color: 'var(--brand-text)', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.88rem', display: 'inline-block', marginBottom: '2.5rem' }}>
          ← Back
        </Link>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Privacy Policy</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--brand-text-subtle)', marginBottom: '2.5rem' }}>Last updated: March 2026</p>

        {[
          {
            title: 'What we collect',
            body: 'We collect your first name, email address, and your answers to the MyTwenties assessment questions. This information is used solely to generate your personalised report.'
          },
          {
            title: 'How we use your data',
            body: 'Your responses are sent to an AI model (Claude by Anthropic) to generate your report. We do not sell, share, or use your data for advertising. Your report is stored securely and linked to your email address so you can access it later.'
          },
          {
            title: 'Data storage',
            body: 'Your data is stored in a secure database (Supabase). We use industry-standard security practices to protect your information.'
          },
          {
            title: 'Deletion',
            body: 'You can request deletion of your data at any time by emailing sam@samwitness.com. We will permanently delete your account and all associated responses and reports within 7 days.'
          },
          {
            title: 'Third parties',
            body: 'We use Stripe for payment processing. Stripe has its own privacy policy and we do not store your payment details. We use Anthropic\'s Claude API to generate reports — your assessment responses are sent to Anthropic\'s servers to produce your personalised output.'
          },
          {
            title: 'Contact',
            body: 'For any privacy questions, email sam@samwitness.com.'
          }
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--brand-text)' }}>{title}</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--brand-text-muted)', margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
