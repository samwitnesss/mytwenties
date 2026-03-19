import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

const ADMIN_PASSWORD = 'Witness.change1'
const ADMIN_EMAIL = 'sam@samwitness.com'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Fetch all users who have a completed report
    const { data: reports, error: reportsError } = await supabase
      .from('mytwenties_reports')
      .select('id, user_id, report_type, report_data, created_at, status')
      .eq('status', 'ready')
      .order('created_at', { ascending: false })

    if (reportsError) {
      console.error('Error fetching reports:', reportsError)
      return NextResponse.json({ error: 'Failed to fetch reports.' }, { status: 500 })
    }

    // Fetch all users
    const { data: users, error: usersError } = await supabase
      .from('mytwenties_users')
      .select('id, first_name, email, created_at, tier')

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 })
    }

    // Merge users with their reports
    const userMap = new Map(users?.map(u => [u.id, u]) ?? [])
    const results = (reports ?? []).map(report => {
      const user = userMap.get(report.user_id)
      const reportData = report.report_data as Record<string, unknown> | null
      return {
        reportId: report.id,
        userId: report.user_id,
        firstName: user?.first_name ?? (reportData?.firstName as string) ?? 'Unknown',
        email: user?.email ?? 'Unknown',
        tier: user?.tier ?? 'free',
        reportType: report.report_type,
        completedAt: report.created_at,
        headline: (reportData?.identity_profile as Record<string, unknown>)?.headline as string ?? '',
        primaryArchetype: ((reportData?.archetype as Record<string, unknown>)?.primary as Record<string, unknown>)?.name as string ?? '',
      }
    })

    return NextResponse.json({ users: results })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
