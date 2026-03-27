import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params
  const userId = req.nextUrl.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  try {
    const admin = createAdminClient()

    // Session notes: return ALL rows (multiple calls) instead of a single row
    if (type === 'session_notes') {
      const { data, error } = await admin
        .from('accelerator_assets')
        .select('content, call_number')
        .eq('user_id', userId)
        .eq('asset_type', 'session_notes')
        .order('call_number', { ascending: true })

      if (error || !data || data.length === 0) {
        return NextResponse.json({ content: null })
      }

      return NextResponse.json({
        content: data.map((row) => ({
          ...row.content,
          call_number: row.call_number,
        })),
      })
    }

    const { data, error } = await admin
      .from('accelerator_assets')
      .select('content')
      .eq('user_id', userId)
      .eq('asset_type', type)
      .single()

    if (error || !data) {
      return NextResponse.json({ content: null })
    }

    return NextResponse.json({ content: data.content })
  } catch (err) {
    console.error('portal/assets error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
