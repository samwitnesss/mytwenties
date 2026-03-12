import ReportContent from '../ReportContent'
import { mockReport } from '@/lib/mock-report'
import { createAdminClient } from '@/lib/supabase/server'

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('mytwenties_reports')
      .select('report_data, status, report_type')
      .eq('id', id)
      .single()

    if (data?.report_data && data.status === 'ready') {
      return <ReportContent report={{ ...data.report_data, id }} reportType={data.report_type ?? 'free'} />
    }
  } catch {
    // Fall through to mock
  }

  return <ReportContent report={mockReport} reportType="free" />
}
