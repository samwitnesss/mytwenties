import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/server'
import { SECTIONS } from '@/lib/questions'

export const maxDuration = 300

const QUESTION_MAP = Object.fromEntries(
  SECTIONS.flatMap(s =>
    s.questions.map(q => [q.id, { label: q.label, section: s.title, type: q.type }])
  )
)

function formatResponses(responses: Array<{ question_id: string; response_type: string; response_value: unknown }>) {
  const sections: Record<string, string[]> = {}
  for (const r of responses) {
    const meta = QUESTION_MAP[r.question_id]
    if (!meta) continue
    const sec = meta.section
    if (!sections[sec]) sections[sec] = []
    let valueStr = ''
    if (r.response_type === 'scale') {
      valueStr = `${r.response_value}/5`
    } else if (Array.isArray(r.response_value)) {
      valueStr = (r.response_value as string[]).join(', ')
    } else {
      valueStr = String(r.response_value)
    }
    sections[sec].push(`Q: ${meta.label}\nA: ${valueStr}`)
  }
  return Object.entries(sections)
    .map(([sec, qs]) => `=== ${sec} ===\n${qs.join('\n\n')}`)
    .join('\n\n')
}

const PAID_SYSTEM_PROMPT = `You are a world-class business and career strategist specialising in helping young people (18-30) turn self-knowledge into a concrete plan.

You will be given a person's psychological profile (already generated) plus their raw assessment responses. Generate ONLY the 6 paid sections below — deeply personalised, specific, actionable.

RULES:
1. Reference their actual archetype, strengths, and directions from the profile provided.
2. Be specific and honest. Generic output is worthless.
3. Write in second person ("Your business model is...", "The move for you is...").
4. Return ONLY valid JSON. No markdown, no preamble, no code fences.
5. NEVER fabricate quotes or details not in their responses.

Return ONLY this exact JSON structure:
{"business_blueprint":{"model":"Specific business model that fits their wiring","why_it_fits":"2 sentences on why this model aligns with their specific profile","first_steps":["Step 1 — this week","Step 2 — week 2","Step 3 — month 1","Step 4 — month 2","Step 5 — day 90"],"realistic_timeline":"Honest timeline to first $1k, $5k, and sustainability"},"career_map":{"headline":"Career direction in one sharp sentence","why":"2 sentences on why this fits their specific wiring","roles":[{"title":"Role title","description":"2 sentences on what it involves and why it fits them","income":"Realistic range"},{"title":"Role title","description":"2 sentences","income":"Range"},{"title":"Role title","description":"2 sentences","income":"Range"}]},"highest_leverage_move":{"move":"The single most important action — specific and concrete","why_now":"2 sentences on why this matters most right now","how_to_start":"3 concrete steps for this week","worst_case":"2 sentences describing the absolute worst case if this move doesn't work — make it reassuring: even failure leaves them better off than staying still"},"reading_list":[{"title":"Book title","author":"Author","why":"1 sentence specific to this person","key_quotes":["Exact quote from the book that directly applies to their situation","Another powerful quote relevant to their archetype or blind spots"]},{"title":"Book title","author":"Author","why":"1 sentence","key_quotes":["Quote","Quote"]},{"title":"Book title","author":"Author","why":"1 sentence","key_quotes":["Quote","Quote"]},{"title":"Book title","author":"Author","why":"1 sentence","key_quotes":["Quote","Quote"]},{"title":"Book title","author":"Author","why":"1 sentence","key_quotes":["Quote","Quote"]}],"ai_mentor_prompt":"350-450 word system prompt they paste into Claude, ChatGPT, or Gemini. Structure it in clear sections with headers. Must include: (1) WHO YOU ARE AS A MENTOR — give the AI a specific identity and coaching philosophy tailored to this person's archetype. (2) WHO THIS PERSON IS — their name, archetype, secondary archetype, and a 2-3 sentence psychological summary that the AI should always keep in mind. (3) THEIR STRENGTHS — list their top 3-4 strengths and instruct the AI to actively leverage these in every suggestion. (4) THEIR BLIND SPOTS — list their 1-2 blind spots and instruct the AI to gently call these out when they appear in conversation. (5) THEIR DIRECTION — their primary career/life direction and what success looks like for them specifically. (6) HOW TO RESPOND — give the AI specific instructions: be direct not soft, give concrete action steps not abstract advice, push back on overthinking, never validate stalling, ask one powerful question at the end of each response. Make the prompt feel rich, specific, and immediately useful — like it was written by someone who deeply knows this person.","the_letter":["Para 1 — open with recognition. Show you see them. Not flattery.","Para 2 — the thing they've been circling but haven't done.","Para 3 — why they've been holding back and what it's costing them.","Para 4 — what's possible if they move. Specific to their situation.","Para 5 — close with something that stays with them. Truth, not motivation."]}`

export async function POST(req: NextRequest) {
  try {
    const { reportId } = await req.json()

    if (!reportId) {
      return NextResponse.json({ error: 'reportId required' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Fetch the report
    const { data: report, error: reportError } = await admin
      .from('mytwenties_reports')
      .select('id, user_id, report_data, report_type')
      .eq('id', reportId)
      .single()

    if (reportError || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    const reportData = report.report_data as Record<string, unknown>

    // Idempotency: if paid sections already generated, skip
    if (reportData?.business_blueprint) {
      return NextResponse.json({ success: true, alreadyGenerated: true })
    }

    // Mark as generating paid sections
    await admin
      .from('mytwenties_reports')
      .update({ report_type: 'paid_pending' })
      .eq('id', reportId)

    // Fetch all responses for this user
    const { data: responses, error: respError } = await admin
      .from('mytwenties_responses')
      .select('question_id, response_type, response_value')
      .eq('user_id', report.user_id)
      .order('question_id')

    if (respError || !responses || responses.length === 0) {
      return NextResponse.json({ error: 'No responses found' }, { status: 404 })
    }

    const formattedResponses = formatResponses(responses)

    // Build profile context from the free report so Claude can personalise
    const profileContext = JSON.stringify({
      firstName: reportData.firstName,
      archetype: reportData.archetype,
      strengths: reportData.strengths,
      blind_spots: reportData.blind_spots,
      directions: reportData.directions,
      identity_profile: reportData.identity_profile,
    })

    const userMessage = `Generate the 6 paid sections for this person.

THEIR PSYCHOLOGICAL PROFILE (from the free report):
${profileContext}

THEIR ASSESSMENT RESPONSES:
${formattedResponses}

Use the profile above so every paid section directly references their archetype, strengths, and stated directions. Return only the JSON.`

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4500,
      messages: [{ role: 'user', content: userMessage }],
      system: PAID_SYSTEM_PROMPT,
    })

    const rawText = message.content.length > 0 && message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonStr = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

    let paidData: Record<string, unknown>
    try {
      paidData = JSON.parse(jsonStr)
    } catch {
      console.error('generate-paid: Claude returned invalid JSON:', jsonStr.slice(0, 500))
      // Reset back to paid_pending so it can be retried
      await admin
        .from('mytwenties_reports')
        .update({ report_type: 'paid_pending' })
        .eq('id', reportId)
      return NextResponse.json({ error: 'Paid generation produced invalid data. Please try again.' }, { status: 500 })
    }

    // Merge paid fields into existing report data and mark as paid
    const { error: updateError } = await admin
      .from('mytwenties_reports')
      .update({
        report_data: { ...reportData, ...paidData },
        report_type: 'paid',
      })
      .eq('id', reportId)

    if (updateError) {
      console.error('generate-paid: failed to save paid data:', updateError)
      return NextResponse.json({ error: 'Failed to save paid sections' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('generate-paid error:', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
