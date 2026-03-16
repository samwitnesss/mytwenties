import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/server'
import { SECTIONS } from '@/lib/questions'

export const maxDuration = 120

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

ARCHETYPES: The Architect, The Connector, The Creator, The Disruptor, The Performer, The Analyst, The Caretaker, The Explorer

Return ONLY this exact JSON structure (replace placeholder text with real content):
{"identity_profile":{"headline":"Bold 10-12 word headline capturing their core tension","summary":"3 sentences max — specific to them","core_truth":"One sharp sentence — the most important insight","tags":["Tag1","Tag2","Tag3","Tag4","Tag5"]},"archetype":{"primary":{"name":"Archetype name","score":0.88,"description":"3 sentences on how they embody this archetype","traits":["Trait 1","Trait 2","Trait 3","Trait 4"],"shadow":"1-2 sentences on the dark side — specific and honest"},"secondary":{"name":"Archetype name","score":0.71,"description":"2 sentences on their secondary pattern"},"radar_scores":[{"axis":"Architect","value":75},{"axis":"Connector","value":60},{"axis":"Creator","value":55},{"axis":"Disruptor","value":45},{"axis":"Performer","value":40},{"axis":"Analyst","value":70},{"axis":"Caretaker","value":50},{"axis":"Explorer","value":65}]},"hidden_dynamics":[{"name":"Pattern name","description":"2 sentences specific to their answers","implication":"1 sentence actionable insight"},{"name":"Pattern name","description":"2 sentences specific to their answers","implication":"1 sentence actionable insight"},{"name":"Pattern name","description":"2 sentences specific to their answers","implication":"1 sentence actionable insight"}],"strengths":[{"rank":1,"name":"Strength name","score":0.91,"description":"2 sentences referencing their answers","income_angle":"1 sentence on how this earns money"},{"rank":2,"name":"Strength name","score":0.84,"description":"2 sentences","income_angle":"1 sentence"},{"rank":3,"name":"Strength name","score":0.79,"description":"2 sentences","income_angle":"1 sentence"},{"rank":4,"name":"Strength name","score":0.72,"description":"2 sentences","income_angle":"1 sentence"}],"blind_spots":[{"name":"Blind spot name","severity":0.82,"description":"2 sentences — honest","source_strength":"Strength name","reframe":"1 sentence cognitive shift"},{"name":"Blind spot name","severity":0.65,"description":"2 sentences","source_strength":"Strength name","reframe":"1 sentence"}],"energy_map":[{"label_left":"Solo","label_right":"Social","score":0.3},{"label_left":"Structured","label_right":"Spontaneous","score":0.6},{"label_left":"Practical","label_right":"Conceptual","score":0.5},{"label_left":"Stable","label_right":"High-Risk","score":0.6},{"label_left":"Follower","label_right":"Leader","score":0.7}],"the_mirror":{"headline":"The most confronting true thing about this person","body":["Para 1 — the hardest truth, direct to them","Para 2 — the pattern and what it's costing them","Para 3 — what they're protecting themselves from","Para 4 — what changes when they stop. End with energy, not despair."]},"famous_parallels":[{"name":"Real person full name","connection":"2 sentences on why this parallel fits their specific pattern","key_lesson":"1 sentence","image_search_term":"First Last descriptor"},{"name":"Real person full name","connection":"2 sentences on why this parallel fits","key_lesson":"1 sentence","image_search_term":"First Last descriptor"}],"directions":[{"title":"Direction title","type":"entrepreneurial","fit_score":0.89,"why_it_fits":"2 sentences specific to their wiring and circumstances","what_it_looks_like":"2 sentences on what doing this looks like day-to-day","income_potential":{"month_3":"$X–$Y/mo","month_6":"$X–$Y/mo","month_12":"$X–$Y/mo"}},{"title":"Direction title","type":"hybrid","fit_score":0.74,"why_it_fits":"2 sentences","what_it_looks_like":"2 sentences","income_potential":{"month_3":"$X–$Y/mo","month_6":"$X–$Y/mo","month_12":"$X–$Y/mo"}},{"title":"Direction title","type":"entrepreneurial","fit_score":0.62,"why_it_fits":"2 sentences","what_it_looks_like":"2 sentences","income_potential":{"month_3":"$X–$Y/mo","month_6":"$X–$Y/mo","month_12":"$X–$Y/mo"}}],"dream_day":{"headline":"Powerful opening line for their ideal day — specific to what they said","body":"4-5 paragraphs in second person describing their ideal day 2 years from now. Specific to this person — their actual career direction, where they live, how they feel. Walk through morning, work, and evening. Separate paragraphs with double newlines."},"shareable_card":{"archetype":"Primary archetype name","top_strength":"Top strength name","card_headline":"8-10 word punchy shareable headline","subtext":"MyTwenties Assessment"},"business_blueprint":{"model":"Specific business model that fits their wiring","why_it_fits":"2 sentences on why this model aligns with their specific profile","first_steps":["Step 1 — this week","Step 2 — week 2","Step 3 — month 1","Step 4 — month 2","Step 5 — day 90"],"realistic_timeline":"Honest timeline to first $1k, $5k, and sustainability"},"career_map":{"headline":"Career direction in one sharp sentence","why":"2 sentences on why this fits their specific wiring","roles":[{"title":"Role title","description":"2 sentences on what it involves and why it fits them","income":"Realistic range"},{"title":"Role title","description":"2 sentences","income":"Range"},{"title":"Role title","description":"2 sentences","income":"Range"}]},"highest_leverage_move":{"move":"The single most important action — specific and concrete","why_now":"2 sentences on why this matters most right now","how_to_start":"3 concrete steps for this week","worst_case":"2 sentences describing the absolute worst case if this move doesn't work — make it reassuring: even failure leaves them better off than staying still"},"reading_list":[{"title":"Book title","author":"Author","why":"1 sentence specific to this person"},{"title":"Book title","author":"Author","why":"1 sentence"},{"title":"Book title","author":"Author","why":"1 sentence"},{"title":"Book title","author":"Author","why":"1 sentence"},{"title":"Book title","author":"Author","why":"1 sentence"}],"ai_mentor_prompt":"350-450 word system prompt they paste into Claude, ChatGPT, or Gemini. Structure it in clear sections with headers. Must include: (1) WHO YOU ARE AS A MENTOR — give the AI a specific identity and coaching philosophy tailored to this person's archetype. (2) WHO THIS PERSON IS — their name, archetype, secondary archetype, and a 2-3 sentence psychological summary that the AI should always keep in mind. (3) THEIR STRENGTHS — list their top 3-4 strengths and instruct the AI to actively leverage these in every suggestion. (4) THEIR BLIND SPOTS — list their 1-2 blind spots and instruct the AI to gently call these out when they appear in conversation. (5) THEIR DIRECTION — their primary career/life direction and what success looks like for them specifically. (6) HOW TO RESPOND — give the AI specific instructions: be direct not soft, give concrete action steps not abstract advice, push back on overthinking, never validate stalling, ask one powerful question at the end of each response. Make the prompt feel rich, specific, and immediately useful — like it was written by someone who deeply knows this person.","the_letter":["Para 1 — open with recognition. Show you see them. Not flattery.","Para 2 — the thing they've been circling but haven't done.","Para 3 — why they've been holding back and what it's costing them.","Para 4 — what's possible if they move. Specific to their situation.","Para 5 — close with something that stays with them. Truth, not motivation."]}`

export async function POST(req: NextRequest) {
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

    // Check for a recent pending record (<90s old) — another call is already in progress
    const { data: recentPending } = await admin
      .from('mytwenties_reports')
      .select('id, created_at')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .gte('created_at', new Date(Date.now() - 90000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (recentPending?.id) {
      // Generation is already in flight — tell client to keep polling
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

    // Format responses into readable prompt context
    const formattedResponses = formatResponses(responses)

    const userMessage = `Please generate a personalised MyTwenties report for this person.

First name: ${firstName || 'Unknown'}

THEIR ASSESSMENT RESPONSES:
${formattedResponses}

Remember: be specific to their exact answers. Reference what they actually said. Make every section feel like it could only have been written for them. Return only the JSON.`

    // Call Claude
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ],
      system: SYSTEM_PROMPT
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse the JSON — strip any accidental markdown fences
    const jsonStr = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

    let reportData: Record<string, unknown>
    try {
      reportData = JSON.parse(jsonStr)
    } catch {
      console.error('Claude returned invalid JSON:', jsonStr.slice(0, 500))
      // Mark pending record as failed by deleting it so client knows to retry
      await admin.from('mytwenties_reports').delete().eq('id', pendingId)
      return NextResponse.json({ error: 'Report generation produced invalid data. Please try again.' }, { status: 500 })
    }

    // Add metadata
    reportData.userId = userId
    reportData.firstName = firstName || 'You'
    reportData.generatedAt = new Date().toISOString()

    // Update the pending record to ready with the report data
    const { error: updateError } = await admin
      .from('mytwenties_reports')
      .update({
        report_data: reportData,
        status: 'ready'
      })
      .eq('id', pendingId)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to save report' }, { status: 500 })
    }

    return NextResponse.json({ reportId: pendingId })

  } catch (err) {
    console.error('Generate error:', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
