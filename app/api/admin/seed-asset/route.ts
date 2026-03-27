import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key')

  if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { email?: string; asset_type?: string; content?: unknown; call_number?: number | null }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { email, asset_type, content, call_number } = body

  if (!email || !asset_type || content === undefined) {
    return NextResponse.json({ error: 'email, asset_type, and content are required' }, { status: 400 })
  }

  try {
    const admin = createAdminClient()

    const { data: user, error: userError } = await admin
      .from('mytwenties_users')
      .select('id')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: `User not found for email: ${email}` }, { status: 404 })
    }

    const row: Record<string, unknown> = {
      user_id: user.id,
      asset_type,
      content,
      updated_at: new Date().toISOString(),
    }

    // Include call_number for session_notes assets
    if (asset_type === 'session_notes') {
      row.call_number = call_number ?? null
    }

    // Delete existing row first (partial unique index doesn't support upsert)
    const deleteQuery = admin
      .from('accelerator_assets')
      .delete()
      .eq('user_id', user.id)
      .eq('asset_type', asset_type)
    if (asset_type === 'session_notes' && call_number != null) {
      deleteQuery.eq('call_number', call_number)
    }
    await deleteQuery

    const { error: insertError } = await admin
      .from('accelerator_assets')
      .insert(row)

    if (insertError) {
      console.error('seed-asset insert error:', insertError)
      return NextResponse.json({ error: 'Failed to insert asset' }, { status: 500 })
    }

    return NextResponse.json({ success: true, user_id: user.id, asset_type, call_number })
  } catch (err) {
    console.error('seed-asset error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
