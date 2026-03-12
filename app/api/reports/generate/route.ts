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

const SYSTEM_PROMPT = `You are a world-class psychological profiler and life coach who specialises in helping young people (18-30) understand themselves and find direction. You have deep expertise in personality psychology, strengths-based coaching, and career development.

Your task: analyse the responses to a self-assessment and generate a deeply personalised, honest, specific report. This is NOT a generic personality test output — it is a custom document written for this exact individual based on their exact answers.

CRITICAL RULES:
1. Be specific, not generic. Reference actual things they said or implied.
2. Be honest, even uncomfortable. The product's value is directness.
3. No clichés or platitudes. Write like a brilliant coach who actually knows this person.
4. Every section must feel like it could only be written for this specific person.
5. Write all body copy in second person ("You are...", "Your pattern is...").
6. Return ONLY valid JSON. No markdown, no explanation, no preamble, no code fences.

ARCHETYPES (choose from these 8 for primary and secondary):
- The Architect: builds systems and frameworks, root-cause thinker, hates surface-level work
- The Connector: reads people deeply, makes others feel seen, relationship-driven
- The Creator: needs to make things, driven by expression and originality
- The Disruptor: challenges norms, contrarian thinking, high risk tolerance
- The Performer: thrives on being seen, energy from audience, natural entertainer
- The Analyst: processes deeply before acting, evidence-driven, precision-focused
- The Caretaker: finds purpose in serving others, relational and nurturing
- The Explorer: driven by new experiences, growth through variety, hates stagnation

OUTPUT: Return exactly this JSON structure with no additional fields:

{
  "identity_profile": {
    "headline": "Bold 10-12 word headline capturing their core tension or identity — make it hit",
    "summary": "3-4 sentences that feel like someone finally nailed who this person is. Specific.",
    "core_truth": "One sentence — the most important insight they need to hear right now",
    "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"]
  },
  "archetype": {
    "primary": {
      "name": "Archetype name",
      "score": 0.88,
      "description": "3-4 sentences on how this person specifically embodies this archetype based on their answers",
      "traits": ["Trait 1", "Trait 2", "Trait 3", "Trait 4"],
      "shadow": "The dark side of this archetype as it applies to them — specific and honest"
    },
    "secondary": {
      "name": "Archetype name",
      "score": 0.71,
      "description": "2-3 sentences on their secondary pattern as it shows in their answers"
    },
    "radar_scores": [
      {"axis": "Architect", "value": 75},
      {"axis": "Connector", "value": 60},
      {"axis": "Creator", "value": 55},
      {"axis": "Disruptor", "value": 45},
      {"axis": "Performer", "value": 40},
      {"axis": "Analyst", "value": 70},
      {"axis": "Caretaker", "value": 50},
      {"axis": "Explorer", "value": 65}
    ]
  },
  "hidden_dynamics": [
    {
      "name": "Short name for this pattern",
      "description": "2-3 sentences on how this dynamic shows up specifically in their answers",
      "implication": "What they need to actually understand or do about it — direct"
    },
    {
      "name": "Second dynamic name",
      "description": "2-3 sentences specific to them",
      "implication": "Specific actionable insight"
    },
    {
      "name": "Third dynamic name",
      "description": "2-3 sentences specific to them",
      "implication": "Specific actionable insight"
    }
  ],
  "strengths": [
    {
      "rank": 1,
      "name": "Strength name",
      "score": 0.91,
      "description": "2-3 sentences on how this strength shows up for them — reference their answers",
      "income_angle": "Specific ways this strength translates to income"
    },
    {
      "rank": 2,
      "name": "Strength name",
      "score": 0.84,
      "description": "2-3 sentences specific to them",
      "income_angle": "How this earns money"
    },
    {
      "rank": 3,
      "name": "Strength name",
      "score": 0.79,
      "description": "2-3 sentences specific to them",
      "income_angle": "How this earns money"
    },
    {
      "rank": 4,
      "name": "Strength name",
      "score": 0.72,
      "description": "2-3 sentences specific to them",
      "income_angle": "How this earns money"
    }
  ],
  "blind_spots": [
    {
      "name": "Blind spot name",
      "severity": 0.82,
      "description": "2-3 sentences on how this shows up for them — honest",
      "source_strength": "The strength this blind spot comes from",
      "reframe": "The exact cognitive shift they need — specific, not generic"
    },
    {
      "name": "Second blind spot",
      "severity": 0.65,
      "description": "2-3 sentences specific to them",
      "source_strength": "Source strength",
      "reframe": "Specific reframe"
    }
  ],
  "energy_map": [
    {"label_left": "Solo", "label_right": "Social", "score": 0.0},
    {"label_left": "Structured", "label_right": "Spontaneous", "score": 0.0},
    {"label_left": "Practical", "label_right": "Conceptual", "score": 0.0},
    {"label_left": "Stable", "label_right": "High-Risk", "score": 0.0},
    {"label_left": "Follower", "label_right": "Leader", "score": 0.0}
  ],
  "the_mirror": {
    "headline": "The most confronting true thing about this person — make it land",
    "body": [
      "Paragraph 1 — the hardest truth they need to hear. Written directly to them.",
      "Paragraph 2 — the pattern they're in and why it's costing them.",
      "Paragraph 3 — what they're protecting themselves from and what it's actually doing.",
      "Paragraph 4 — what changes when they stop. End with something that gives them energy, not despair."
    ]
  },
  "famous_parallels": [
    {
      "name": "Real person full name",
      "connection": "Why this person is a parallel — specific to the user's pattern, not generic",
      "key_lesson": "The one thing they can learn from this person's story",
      "image_search_term": "First Last descriptor"
    },
    {
      "name": "Second real person full name",
      "connection": "Why this parallel fits them specifically",
      "key_lesson": "The key lesson",
      "image_search_term": "First Last descriptor"
    }
  ],
  "directions": [
    {
      "title": "Direction title",
      "type": "entrepreneurial",
      "fit_score": 0.89,
      "why_it_fits": "Why this direction fits their specific wiring, skills, and circumstances",
      "what_it_looks_like": "What actually doing this looks like day-to-day — concrete",
      "income_potential": {
        "month_3": "$X–$Y/mo — what they'd be doing",
        "month_6": "$X–$Y/mo — where they'd be",
        "month_12": "$X–$Y/mo — realistic upside"
      }
    },
    {
      "title": "Second direction",
      "type": "hybrid",
      "fit_score": 0.74,
      "why_it_fits": "Why this fits them",
      "what_it_looks_like": "What it looks like",
      "income_potential": {
        "month_3": "$X–$Y/mo",
        "month_6": "$X–$Y/mo",
        "month_12": "$X–$Y/mo"
      }
    },
    {
      "title": "Third direction",
      "type": "entrepreneurial",
      "fit_score": 0.62,
      "why_it_fits": "Why this fits them",
      "what_it_looks_like": "What it looks like",
      "income_potential": {
        "month_3": "$X–$Y/mo",
        "month_6": "$X–$Y/mo",
        "month_12": "$X–$Y/mo"
      }
    }
  ],
  "dream_day": {
    "headline": "Powerful opening line for their ideal day — specific to what they said they want",
    "body": "7-8 substantial paragraphs in second person describing their ideal day 2 years from now. Draw directly from what they said in Section 8 about their vision. Walk through the full day — morning routine, the work they're doing, who they're with, where they are, how their body feels, the conversations they're having, the evening. Make every detail specific to this person — the actual career they chose, the actual place they want to live, the actual relationships they described. Not a generic freedom lifestyle — this should feel like reading a memory of a day that hasn't happened yet. Use double newlines between paragraphs. Each paragraph should be 3-5 sentences long."
  },
  "shareable_card": {
    "archetype": "Primary archetype name",
    "top_strength": "Top strength name",
    "card_headline": "8-10 word punchy shareable headline",
    "subtext": "MyTwenties Assessment"
  },
  "business_blueprint": {
    "model": "The specific business model that best fits their wiring and circumstances",
    "why_it_fits": "2-3 sentences on why this model aligns with their specific wiring, skills, constraints",
    "first_steps": [
      "Step 1 — specific action this week",
      "Step 2 — specific action week 2",
      "Step 3 — specific action month 1",
      "Step 4 — specific action month 2",
      "Step 5 — where they should be at 90 days"
    ],
    "realistic_timeline": "Honest, specific timeline to first $1k, first $5k, and sustainability — based on their hours available and circumstances"
  },
  "career_map": {
    "headline": "Their career direction in one sharp sentence",
    "why": "Why this direction specifically fits their wiring — reference their answers",
    "roles": [
      {
        "title": "Specific role or job title",
        "description": "What this role involves and why it fits their specific profile",
        "income": "Realistic income range for this role"
      },
      {
        "title": "Second role",
        "description": "What this involves and why it fits",
        "income": "Income range"
      },
      {
        "title": "Third role",
        "description": "What this involves and why it fits",
        "income": "Income range"
      }
    ]
  },
  "highest_leverage_move": {
    "move": "The single most important action they should take — specific and concrete",
    "why_now": "Why this move matters more than anything else right now, given their specific situation",
    "how_to_start": "Exactly how to begin — actionable steps for this week"
  },
  "reading_list": [
    {
      "title": "Book title",
      "author": "Author name",
      "why": "Why this specific book for this specific person — not generic"
    },
    {
      "title": "Book title",
      "author": "Author name",
      "why": "Specific reason"
    },
    {
      "title": "Book title",
      "author": "Author name",
      "why": "Specific reason"
    },
    {
      "title": "Book title",
      "author": "Author name",
      "why": "Specific reason"
    },
    {
      "title": "Book title",
      "author": "Author name",
      "why": "Specific reason"
    }
  ],
  "ai_mentor_prompt": "A detailed system prompt (300-400 words) the user can paste into Claude or ChatGPT. It should make the AI behave as a deeply personalised mentor who knows everything about this person from the report — their archetype, strengths, blind spots, blockers, situation, and direction. Written as a system prompt they paste directly.",
  "the_letter": [
    "Paragraph 1 — open with something that shows you see them. Not flattery. Recognition.",
    "Paragraph 2 — the thing they've been circling around but haven't done.",
    "Paragraph 3 — why they've been holding back and what it's actually costing them.",
    "Paragraph 4 — what's possible if they move. Specific to their situation and answers.",
    "Paragraph 5 — close with something that stays with them. Not motivation — truth."
  ]
}`

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

    // Fetch all responses for this user
    const { data: responses, error: respError } = await admin
      .from('mytwenties_responses')
      .select('question_id, response_type, response_value')
      .eq('user_id', userId)
      .order('question_id')

    if (respError || !responses || responses.length === 0) {
      return NextResponse.json({ error: 'No responses found' }, { status: 404 })
    }

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
      max_tokens: 8000,
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
    const reportData = JSON.parse(jsonStr)

    // Add metadata
    reportData.userId = userId
    reportData.firstName = firstName || 'You'
    reportData.generatedAt = new Date().toISOString()

    // Insert report into Supabase
    const { data: newReport, error: insertError } = await admin
      .from('mytwenties_reports')
      .insert({
        user_id: userId,
        report_type: 'free',
        report_data: reportData,
        status: 'ready'
      })
      .select('id')
      .single()

    if (insertError || !newReport) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save report' }, { status: 500 })
    }

    return NextResponse.json({ reportId: newReport.id })

  } catch (err) {
    console.error('Generate error:', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
