import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key')

  if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { email?: string; asset_type?: string; content?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { email, asset_type, content } = body

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

    const { error: upsertError } = await admin
      .from('accelerator_assets')
      .upsert(
        {
          user_id: user.id,
          asset_type,
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,asset_type' }
      )

    if (upsertError) {
      console.error('seed-asset upsert error:', upsertError)
      return NextResponse.json({ error: 'Failed to upsert asset' }, { status: 500 })
    }

    return NextResponse.json({ success: true, user_id: user.id, asset_type })
  } catch (err) {
    console.error('seed-asset error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
