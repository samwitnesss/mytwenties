import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  try {
    const admin = createAdminClient()

    const { data: user, error } = await admin
      .from('mytwenties_users')
      .select('id, first_name, tier, program_start_date')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate program week from program_start_date
    let programWeek = 1
    if (user.program_start_date) {
      const start = new Date(user.program_start_date)
      const now = new Date()
      const diffMs = now.getTime() - start.getTime()
      const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))
      programWeek = Math.max(1, Math.min(12, diffWeeks + 1))
    }

    // Fetch any existing accelerator assets
    const { data: assets } = await admin
      .from('accelerator_assets')
      .select('id, asset_type, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      id: user.id,
      firstName: user.first_name,
      tier: user.tier ?? 'free',
      programWeek,
      assets: assets ?? [],
    })
  } catch (err) {
    console.error('Portal me error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
