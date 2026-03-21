import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { notifyGHL } from '@/lib/ghl'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }

    const { reportId, userId } = session.metadata ?? {}

    if (reportId) {
      const admin = createAdminClient()
      // Only set paid_pending if not already fully paid (idempotent)
      const updateQuery = userId
        ? admin.from('mytwenties_reports').update({ report_type: 'paid_pending' }).eq('id', reportId).eq('user_id', userId).neq('report_type', 'paid')
        : admin.from('mytwenties_reports').update({ report_type: 'paid_pending' }).eq('id', reportId).neq('report_type', 'paid')
      const { error: updateError } = await updateQuery
      if (updateError) {
        console.error('webhook: failed to mark report as paid_pending:', updateError, { reportId, userId })
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
      }

      // Notify GHL — payment completed
      if (userId) {
        const { data: user } = await admin
          .from('mytwenties_users')
          .select('email, first_name, phone')
          .eq('id', userId)
          .single()
        if (user?.email) notifyGHL('paid', user.email, user.first_name || 'Unknown', user.phone)
      }
    }
  }

  return NextResponse.json({ received: true })
}
