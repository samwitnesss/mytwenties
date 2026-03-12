import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/start?error=no_code`)
  }

  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !session) {
      return NextResponse.redirect(`${origin}/start?error=auth_failed`)
    }

    const user = session.user
    const email = user.email ?? ''
    const meta = user.user_metadata ?? {}
    const firstName =
      meta.given_name ??
      meta.full_name?.split(' ')[0] ??
      meta.name?.split(' ')[0] ??
      'Friend'

    // Upsert into mytwenties_users
    const admin = createAdminClient()
    const { data: existing } = await admin
      .from('mytwenties_users')
      .select('id, first_name')
      .eq('email', email.toLowerCase())
      .single()

    let userId: string
    let resolvedName: string

    if (existing) {
      userId = existing.id
      resolvedName = existing.first_name
    } else {
      const { data: newUser, error: insertError } = await admin
        .from('mytwenties_users')
        .insert({ first_name: firstName, email: email.toLowerCase() })
        .select('id, first_name')
        .single()

      if (insertError || !newUser) {
        return NextResponse.redirect(`${origin}/start?error=user_creation_failed`)
      }

      userId = newUser.id
      resolvedName = newUser.first_name
    }

    // Redirect to client page to set localStorage
    const params = new URLSearchParams({ userId, firstName: resolvedName, email })
    return NextResponse.redirect(`${origin}/auth/complete?${params}`)

  } catch {
    return NextResponse.redirect(`${origin}/start?error=unexpected`)
  }
}
