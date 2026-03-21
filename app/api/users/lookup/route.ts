import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'lookup', 10, 60) // 10 lookups per minute
  if (limited) return limited

  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: user } = await supabase
      .from('mytwenties_users')
      .select('id, email, first_name, tier')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (!user) {
      return NextResponse.json({ error: 'No account found.' }, { status: 404 })
    }

    // Check for most recent report (ready or pending)
    const { data: report } = await supabase
      .from('mytwenties_reports')
      .select('id, status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      firstName: user.first_name,
      tier: user.tier ?? 'free',
      reportId: report?.status === 'ready' ? report.id : null,
      pendingReportId: report?.status === 'pending' ? report.id : null,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
