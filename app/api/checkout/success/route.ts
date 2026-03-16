import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' })
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

    if (!reportId) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    const admin = createAdminClient()
    const updateQuery = userId
      ? admin.from('mytwenties_reports').update({ report_type: 'paid' }).eq('id', reportId).eq('user_id', userId)
      : admin.from('mytwenties_reports').update({ report_type: 'paid' }).eq('id', reportId)
    const { error: updateError } = await updateQuery
    if (updateError) {
      console.error('checkout/success: failed to mark report as paid:', updateError, { reportId, userId })
    }

    return NextResponse.redirect(new URL(`/report/${reportId}?unlocked=1`, req.url))
  } catch (err) {
    console.error('Checkout success error:', err)
    return NextResponse.redirect(new URL('/', req.url))
  }
}
