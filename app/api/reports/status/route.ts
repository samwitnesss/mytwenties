import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('mytwenties_reports')
      .select('id, status, report_type, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ ready: false, reportId: null, inProgress: false })
    }

    if (data.status === 'ready') {
      return NextResponse.json({ ready: true, reportId: data.id, inProgress: false })
    }

    // Pending record — inProgress only if created within the last 90s
    const ageMs = Date.now() - new Date(data.created_at).getTime()
    return NextResponse.json({
      ready: false,
      reportId: null,
      inProgress: ageMs < 90000,
      status: data.status
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
