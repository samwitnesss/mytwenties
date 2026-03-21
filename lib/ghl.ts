const GHL_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/k6oMLLNlRYQ26YKH2Z3C/webhook-trigger/dd1aed99-2eb5-44df-9129-28398826f962'

export async function notifyGHL(
  email: string,
  firstName: string,
  tags: string[],
  phone?: string | null
): Promise<void> {
  try {
    const payload: Record<string, unknown> = { email, firstName, tags }
    if (phone) payload.phone = phone
    await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    // Never block user flow if GHL is down
    console.error('GHL webhook failed for', email, tags)
  }
}
