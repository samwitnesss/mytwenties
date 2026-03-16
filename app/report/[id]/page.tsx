import ReportContent from '../ReportContent'
import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ unlocked?: string }>
}) {
  const { id } = await params
  const { unlocked } = await searchParams

  let data = null
  let loadError = false

  try {
    const admin = createAdminClient()
    const result = await admin
      .from('mytwenties_reports')
      .select('report_data, status, report_type')
      .eq('id', id)
      .single()
    data = result.data
  } catch {
    loadError = true
  }

  if (data?.report_data && data.status === 'ready') {
    return (
      <ReportContent
        report={{ ...data.report_data, id }}
        reportType={data.report_type ?? 'free'}
        unlocked={unlocked === '1'}
        paidPending={data.report_type === 'paid_pending'}
      />
    )
  }

  // Report not found or still generating or error — show clear state
  const isGenerating = data && data.status !== 'ready'

  return (
    <main style={{
      backgroundColor: 'var(--brand-bg)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.5rem'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 1.5rem',
          background: 'rgba(37,99,235,0.08)', border: '2px solid rgba(37,99,235,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.75rem'
        }}>
          {isGenerating ? '⏳' : '⚠️'}
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-text)', marginBottom: '0.75rem' }}>
          {isGenerating ? 'Your report is still being generated' : loadError ? 'Something went wrong' : 'Report not found'}
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--brand-text-mid)', lineHeight: 1.7, marginBottom: '2rem' }}>
          {isGenerating
            ? 'It usually takes under a minute. Refresh this page in a moment.'
            : loadError
            ? 'We couldn\'t load your report. Please try refreshing the page.'
            : 'This report doesn\'t exist or the link may be incorrect.'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          {isGenerating || loadError ? (
            <a href={`/report/${id}`} style={{
              display: 'inline-block', padding: '0.875rem 2rem', borderRadius: '100px',
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              color: '#fff', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none'
            }}>
              Refresh page
            </a>
          ) : null}
          <Link href="/" style={{ fontSize: '0.85rem', color: '#2563eb', textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
