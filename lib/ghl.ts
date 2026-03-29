const GHL_WEBHOOKS = {
  started: 'https://services.leadconnectorhq.com/hooks/k6oMLLNlRYQ26YKH2Z3C/webhook-trigger/1d149eb2-2111-4a2e-a832-a89a8befc721',
  completed: 'https://services.leadconnectorhq.com/hooks/k6oMLLNlRYQ26YKH2Z3C/webhook-trigger/4e88328c-81d8-4ba6-815e-5ba6725ef622',
  paid: 'https://services.leadconnectorhq.com/hooks/k6oMLLNlRYQ26YKH2Z3C/webhook-trigger/09d8113a-61d0-466a-8217-63667a435ea3',
  setting_text: process.env.GHL_SETTING_TEXT_WEBHOOK || '',
} as const

export type GHLEvent = keyof typeof GHL_WEBHOOKS

export async function notifyGHL(
  event: GHLEvent,
  email: string,
  firstName: string,
  phone?: string | null
): Promise<void> {
  try {
    const url = GHL_WEBHOOKS[event]
    if (!url) return // Skip if webhook URL not configured yet
    const payload: Record<string, string> = { email, firstName }
    if (phone) payload.phone = phone
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    // Never block user flow if GHL is down
    console.error('GHL webhook failed for', event, email)
  }
}

/**
 * Send the personalised setting text to GHL via webhook.
 * GHL workflow should create a task on the contact with settingText as the description.
 */
export async function sendSettingTextToGHL(
  email: string,
  firstName: string,
  settingText: string,
  phone?: string | null
): Promise<void> {
  try {
    const url = GHL_WEBHOOKS.setting_text
    if (!url) {
      console.warn('GHL setting_text webhook not configured — skipping task creation')
      return
    }
    const payload: Record<string, string> = { email, firstName, settingText }
    if (phone) payload.phone = phone
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    console.error('GHL setting text webhook failed for', email)
  }
}
