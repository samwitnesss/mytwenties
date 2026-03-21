const GHL_WEBHOOKS = {
  started: 'https://services.leadconnectorhq.com/hooks/k6oMLLNlRYQ26YKH2Z3C/webhook-trigger/1d149eb2-2111-4a2e-a832-a89a8befc721',
  completed: 'https://services.leadconnectorhq.com/hooks/k6oMLLNlRYQ26YKH2Z3C/webhook-trigger/4e88328c-81d8-4ba6-815e-5ba6725ef622',
  paid: 'https://services.leadconnectorhq.com/hooks/k6oMLLNlRYQ26YKH2Z3C/webhook-trigger/09d8113a-61d0-466a-8217-63667a435ea3',
} as const

export type GHLEvent = keyof typeof GHL_WEBHOOKS

export async function notifyGHL(
  event: GHLEvent,
  email: string,
  firstName: string,
  phone?: string | null
): Promise<void> {
  try {
    const payload: Record<string, string> = { email, firstName }
    if (phone) payload.phone = phone
    await fetch(GHL_WEBHOOKS[event], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    // Never block user flow if GHL is down
    console.error('GHL webhook failed for', event, email)
  }
}
