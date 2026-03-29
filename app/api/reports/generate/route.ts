import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/server'
import { SECTIONS } from '@/lib/questions'
import { rateLimit } from '@/lib/rate-limit'
import { notifyGHL, sendSettingTextToGHL } from '@/lib/ghl'

export const maxDuration = 300

// Build a flat lookup: questionId -> { label, section, type }
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

const SYSTEM_PROMPT = `You are a world-class psychological profiler and life coach specialising in helping young people (18-30) understand themselves and find direction.

Generate a deeply personalised, honest, specific report based on assessment responses. NOT generic — written for this exact person.

RULES:
1. Be specific — reference actual answers given.
2. Be honest, even uncomfortable. Directness is the product's value.
3. Write in second person ("You are...", "Your pattern is...").
4. Return ONLY valid JSON. No markdown, no preamble, no code fences.
5. Be concise in each field — quality over length.
6. NEVER fabricate quotes, statements, or specific details the person did not provide. If they didn't say it, don't put it in quotes or attribute it to them. Only reference what is explicitly in their responses.
7. NEVER reference scores, ratings, or numbers from their answers (e.g. "you scored 5/5", "you rated yourself 4 out of 5", "your 5/5 on..."). Instead, describe what the pattern MEANS — talk like a mentor who knows them, not a system recounting data points. Say "you're intensely competitive" not "you scored 5/5 on competitiveness". Say "you pick up new skills faster than almost anyone" not "you rated yourself 5 out of 5 on skill acquisition". The person already answered the questions — they don't need their scores read back to them.
8. DIRECTION TYPES must be chosen honestly based on the person's actual data — not defaulted to entrepreneurial. Use their risk tolerance (Stable vs High-Risk score), financial situation, available time, and overall energy map to determine whether each direction should be "entrepreneurial" (building their own thing from scratch), "hybrid" (a mix of employment and a side project or freelancing), or "employed" (a specific role inside an existing company or organisation that aligns with their strengths and interests). Not everyone should be an entrepreneur. If someone has low risk tolerance, limited free time, financial pressure, or strong signals that they'd thrive inside a team or structure, at least one of their three directions MUST be an employed path. Be honest — an employed direction that genuinely fits is more valuable than an entrepreneurial one that doesn't.

ARCHETYPES: The Architect, The Connector, The Creator, The Disruptor, The Performer, The Analyst, The Caretaker, The Explorer

Return ONLY this exact JSON structure (replace placeholder text with real content):
{"identity_profile":{"headline":"Bold 10-12 word headline capturing their core tension","summary":"3 sentences max — specific to them","core_truth":"One sharp sentence — the most important insight","tags":["Tag1","Tag2","Tag3","Tag4","Tag5"]},"archetype":{"primary":{"name":"Archetype name","score":0.88,"description":"3 sentences on how they embody this archetype","traits":["Trait 1","Trait 2","Trait 3","Trait 4"],"shadow":"1-2 sentences on the dark side — specific and honest"},"secondary":{"name":"Archetype name","score":0.71,"description":"2 sentences on their secondary pattern"},"radar_scores":[{"axis":"Architect","value":75},{"axis":"Connector","value":60},{"axis":"Creator","value":55},{"axis":"Disruptor","value":45},{"axis":"Performer","value":40},{"axis":"Analyst","value":70},{"axis":"Caretaker","value":50},{"axis":"Explorer","value":65}]},"hidden_dynamics":[{"name":"Pattern name","description":"2 sentences","implication":"1 sentence actionable insight"},{"name":"Pattern name","description":"2 sentences","implication":"1 sentence actionable insight"},{"name":"Pattern name","description":"2 sentences","implication":"1 sentence actionable insight"}],"strengths":[{"rank":1,"name":"Strength name","score":0.91,"description":"2 sentences referencing their answers","income_angle":"1 sentence on how this earns money"},{"rank":2,"name":"Strength name","score":0.84,"description":"2 sentences","income_angle":"1 sentence"},{"rank":3,"name":"Strength name","score":0.79,"description":"2 sentences","income_angle":"1 sentence"},{"rank":4,"name":"Strength name","score":0.72,"description":"2 sentences","income_angle":"1 sentence"}],"blind_spots":[{"name":"Blind spot name","severity":0.82,"description":"2 sentences — honest","source_strength":"Strength name","reframe":"1 sentence cognitive shift"},{"name":"Blind spot name","severity":0.65,"description":"2 sentences","source_strength":"Strength name","reframe":"1 sentence"}],"energy_map":[{"label_left":"Solo","label_right":"Social","score":0.3},{"label_left":"Structured","label_right":"Spontaneous","score":0.6},{"label_left":"Practical","label_right":"Conceptual","score":0.5},{"label_left":"Stable","label_right":"High-Risk","score":0.6},{"label_left":"Follower","label_right":"Leader","score":0.7}],"the_mirror":{"headline":"The most confronting true thing about this person","body":["Para 1 — the hardest truth, direct to them","Para 2 — the pattern and what it's costing them","Para 3 — what they're protecting themselves from","Para 4 — what changes when they stop. End with energy, not despair."]},"famous_parallels":[{"name":"Real person full name","connection":"2 sentences on why this parallel fits","key_lesson":"1 sentence"},{"name":"Real person full name","connection":"2 sentences on why this parallel fits","key_lesson":"1 sentence"}],"directions":[{"title":"Direction title","type":"entrepreneurial","fit_score":0.89,"why_it_fits":"2 sentences specific to their wiring and circumstances","what_it_looks_like":"2 sentences on what doing this looks like day-to-day","income_potential":{"month_3":"$X–$Y/mo","month_6":"$X–$Y/mo","month_12":"$X–$Y/mo"}},{"title":"Direction title","type":"employed","fit_score":0.74,"why_it_fits":"2 sentences","what_it_looks_like":"2 sentences","income_potential":{"month_3":"$X–$Y/mo","month_6":"$X–$Y/mo","month_12":"$X–$Y/mo"}},{"title":"Direction title","type":"hybrid","fit_score":0.62,"why_it_fits":"2 sentences","what_it_looks_like":"2 sentences","income_potential":{"month_3":"$X–$Y/mo","month_6":"$X–$Y/mo","month_12":"$X–$Y/mo"}}],"dream_day":{"headline":"Powerful opening line for their ideal day — specific to what they said","body":"4-5 paragraphs in second person describing their ideal day 2 years from now. Specific to this person — their actual career direction, where they live, how they feel. Walk through morning, work, and evening. Separate paragraphs with double newlines."},"shareable_card":{"archetype":"Primary archetype name","top_strength":"Top strength name","card_headline":"8-10 word punchy shareable headline","subtext":"MyTwenties Assessment"}}`

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'generate', 3, 300) // 3 requests per 5 min
  if (limited) return limited

  try {
    const { userId, firstName } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Check if a ready report already exists
    const { data: existing } = await admin
      .from('mytwenties_reports')
      .select('id, status')
      .eq('user_id', userId)
      .eq('status', 'ready')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (existing?.id) {
      return NextResponse.json({ reportId: existing.id })
    }

    // Check for a recent pending record (<270s old) — another call is already in progress
    const { data: recentPending } = await admin
      .from('mytwenties_reports')
      .select('id, created_at')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .gte('created_at', new Date(Date.now() - 270000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (recentPending?.id) {
      return NextResponse.json({ pending: true })
    }

    // Delete any stale pending records (>90s old, meaning a prior call was killed)
    await admin
      .from('mytwenties_reports')
      .delete()
      .eq('user_id', userId)
      .eq('status', 'pending')

    // Fetch all responses for this user
    const { data: responses, error: respError } = await admin
      .from('mytwenties_responses')
      .select('question_id, response_type, response_value')
      .eq('user_id', userId)
      .order('question_id')

    if (respError || !responses || responses.length === 0) {
      return NextResponse.json({ error: 'No responses found' }, { status: 404 })
    }

    // Insert a pending record immediately so status polling knows generation is in progress
    const { data: pendingRecord, error: pendingError } = await admin
      .from('mytwenties_reports')
      .insert({
        user_id: userId,
        report_type: 'free',
        report_data: {},
        status: 'pending'
      })
      .select('id')
      .single()

    if (pendingError || !pendingRecord) {
      console.error('Failed to insert pending record:', pendingError)
      return NextResponse.json({ error: 'Failed to start report generation' }, { status: 500 })
    }

    const pendingId = pendingRecord.id

    const formattedResponses = formatResponses(responses)

    const userMessage = `Please generate a personalised MyTwenties report for this person.

First name: ${firstName || 'Unknown'}

THEIR ASSESSMENT RESPONSES:
${formattedResponses}

Remember: be specific to their exact answers. Reference what they actually said. Make every section feel like it could only have been written for them. Return only the JSON.`

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    let reportData: Record<string, unknown> | null = null
    let lastJsonError = ''

    // Retry up to 2 times if Claude returns invalid JSON
    for (let attempt = 0; attempt < 2; attempt++) {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 6000,
        messages: [{ role: 'user', content: userMessage }],
        system: SYSTEM_PROMPT
      })

      const rawText = message.content.length > 0 && message.content[0].type === 'text' ? message.content[0].text : ''
      const jsonStr = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

      try {
        reportData = JSON.parse(jsonStr)
        break // Success — exit retry loop
      } catch {
        lastJsonError = jsonStr.slice(0, 500)
        console.error(`Claude returned invalid JSON (attempt ${attempt + 1}):`, lastJsonError)
      }
    }

    if (!reportData) {
      console.error('All generation attempts failed. Last error:', lastJsonError)
      await admin.from('mytwenties_reports').delete().eq('id', pendingId)
      return NextResponse.json({ error: 'Report generation produced invalid data. Please try again.' }, { status: 500 })
    }

    reportData.userId = userId
    reportData.firstName = firstName || 'You'
    reportData.generatedAt = new Date().toISOString()

    // Look up user email for GHL notification
    const { data: userData } = await admin
      .from('mytwenties_users')
      .select('email, phone')
      .eq('id', userId)
      .single()

    const { data: updatedReport, error: updateError } = await admin
      .from('mytwenties_reports')
      .update({
        report_data: reportData,
        status: 'ready'
      })
      .eq('id', pendingId)
      .select('id')
      .single()

    if (updateError || !updatedReport) {
      const { data: freshReport, error: insertError } = await admin
        .from('mytwenties_reports')
        .insert({
          user_id: userId,
          report_type: 'free',
          report_data: reportData,
          status: 'ready'
        })
        .select('id')
        .single()

      if (insertError || !freshReport) {
        console.error('Insert fallback error:', insertError)
        return NextResponse.json({ error: 'Failed to save report' }, { status: 500 })
      }

      if (userData?.email) notifyGHL('completed', userData.email, firstName || 'Unknown', userData.phone)
      generateSettingText(anthropic, reportData, firstName, freshReport.id, admin, userData?.email, userData?.phone)
      return NextResponse.json({ reportId: freshReport.id })
    }

    // Notify GHL — report completed
    if (userData?.email) notifyGHL('completed', userData.email, firstName || 'Unknown', userData.phone)

    // Generate personalised setting text (non-blocking — don't let this fail the report)
    generateSettingText(anthropic, reportData, firstName, updatedReport.id, admin, userData?.email, userData?.phone)

    return NextResponse.json({ reportId: updatedReport.id })

  } catch (err) {
    console.error('Generate error:', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}

/**
 * Generate a personalised setting text based on the report, save to Supabase,
 * and push to GHL as a task. Runs async — must not block the report response.
 */
async function generateSettingText(
  anthropic: Anthropic,
  reportData: Record<string, unknown>,
  firstName: string,
  reportId: string,
  admin: ReturnType<typeof createAdminClient>,
  email?: string | null,
  phone?: string | null
): Promise<void> {
  try {
    const archetype = reportData.archetype as { primary?: { name?: string } } | undefined
    const strengths = reportData.strengths as Array<{ name?: string; description?: string }> | undefined
    const directions = reportData.directions as Array<{ title?: string; type?: string }> | undefined
    const mirror = reportData.the_mirror as { headline?: string } | undefined
    const identity = reportData.identity_profile as { headline?: string; summary?: string } | undefined

    const settingPrompt = `You are Sam, a 24-year-old Australian life coach who runs MyTwenties — a program helping young people find direction. You're writing a short, warm, personalised text message to someone who just completed the MyTwenties assessment and got their report.

Your goal: make them feel genuinely seen, reference something specific from their report that will surprise them, and open a conversation — NOT sell. You want them to reply.

THEIR REPORT SUMMARY:
- Name: ${firstName || 'there'}
- Primary archetype: ${archetype?.primary?.name || 'Unknown'}
- Top strength: ${strengths?.[0]?.name || 'Unknown'}
- Top direction: ${directions?.[0]?.title || 'Unknown'} (${directions?.[0]?.type || 'unknown'})
- Mirror headline: ${mirror?.headline || 'N/A'}
- Identity headline: ${identity?.headline || 'N/A'}
- Identity summary: ${identity?.summary || 'N/A'}

RULES:
1. Keep it under 40 words. This is a text message, not an email.
2. Sound like a real person texting — casual, warm, no corporate speak.
3. Reference ONE specific thing from their report that shows you've read it.
4. End with an open question that invites a reply.
5. Don't mention the program, pricing, or anything salesy.
6. Don't use emojis excessively — one max, or none.
7. Return ONLY the text message. No quotes, no preamble, no explanation.`

    const settingMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 150,
      messages: [{ role: 'user', content: settingPrompt }],
    })

    const settingText = settingMessage.content.length > 0 && settingMessage.content[0].type === 'text'
      ? settingMessage.content[0].text.trim()
      : ''

    if (!settingText) {
      console.error('Setting text generation returned empty')
      return
    }

    // Save to Supabase
    await admin
      .from('mytwenties_reports')
      .update({ setting_text: settingText })
      .eq('id', reportId)

    // Push to GHL as a task
    if (email) {
      await sendSettingTextToGHL(email, firstName || 'Unknown', settingText, phone)
    }

    console.log('Setting text generated and sent for', firstName, ':', settingText.slice(0, 80))
  } catch (err) {
    // Never let setting text generation break anything
    console.error('Setting text generation failed:', err)
  }
}
