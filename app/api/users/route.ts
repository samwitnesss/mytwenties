import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import { notifyGHL } from '@/lib/ghl'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'signup', 10, 60) // 10 signups per minute
  if (limited) return limited

  try {
    const { firstName, email, phone } = await req.json()

    if (!firstName || !email || !phone) {
      return NextResponse.json({ error: 'First name, email, and phone number are required.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Upsert — if email already exists, return existing user
    const { data: existing } = await supabase
      .from('mytwenties_users')
      .select('id, email, first_name')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existing) {
      return NextResponse.json({
        userId: existing.id,
        email: existing.email,
        firstName: existing.first_name
      })
    }

    const { data, error } = await supabase
      .from('mytwenties_users')
      .insert({
        first_name: firstName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
      })
      .select('id, email, first_name, phone')
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 })
    }

    // Notify GHL — new account created
    notifyGHL(data.email, data.first_name, ['mytwenties-started'], data.phone)

    return NextResponse.json({
      userId: data.id,
      email: data.email,
      firstName: data.first_name
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
