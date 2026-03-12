import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' })

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    const { reportId, userId } = session.metadata ?? {}

    if (reportId && userId) {
      const admin = createAdminClient()
      await admin
        .from('mytwenties_reports')
        .update({ report_type: 'paid' })
        .eq('id', reportId)
        .eq('user_id', userId)
    }

    return NextResponse.redirect(new URL(`/report/${reportId}`, req.url))
  } catch (err) {
    console.error('Checkout success error:', err)
    return NextResponse.redirect(new URL('/', req.url))
  }
}
