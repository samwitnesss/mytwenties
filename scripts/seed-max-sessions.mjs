/**
 * Seed Max Hall's session notes into accelerator_assets.
 *
 * Prerequisites:
 *   1. Run the SQL migration in supabase/migrations/20260327_add_call_number.sql
 *      via the Supabase SQL Editor first.
 *   2. Then run: node scripts/seed-max-sessions.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pwizfvmnixdwtzbsllui.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY env var is required.\nRun: SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/seed-max-sessions.mjs')
  process.exit(1)
}

const MAX_USER_ID = 'aa286639-8f07-48d0-ac88-0816888dc7dd'
const EXISTING_ROW_ID = '443711f3-34e0-4d9d-ba34-1e85d15e6091'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ── Transform raw JSON into SessionNotesData ──────────────────

function transformSessionNotes(raw, callNumber) {
  const sn = raw.session_notes
  const member = raw.member

  // Flatten current_situation
  const current_situation =
    typeof sn.current_situation === 'object'
      ? sn.current_situation.summary
      : sn.current_situation

  // Flatten building_toward
  const building_toward =
    typeof sn.building_toward === 'object'
      ? sn.building_toward.summary
      : sn.building_toward

  // Flatten direction
  const direction =
    typeof sn.direction === 'object'
      ? sn.direction.summary
      : sn.direction

  // Key moments — strip why_it_matters (renderer only uses quote + context)
  const key_moments = (sn.key_moments || []).map((m) => ({
    quote: m.quote,
    context: m.context,
  }))

  // Reframe — map title -> headline
  const reframeRaw = sn.the_reframe || sn.reframe || {}
  const reframe = {
    headline: reframeRaw.title || reframeRaw.headline || '',
    body: reframeRaw.body || '',
  }

  // Next steps — map deadline and priority
  const next_steps = (sn.next_steps || []).map((s) => ({
    action: s.action,
    deadline: normalizeDeadline(s.deadline, member.session_date),
    priority: normalizePriority(s),
  }))

  return {
    session_number: callNumber,
    date: member.session_date,
    client_name: member.first_name,
    current_situation,
    building_toward,
    direction,
    key_moments,
    reframe,
    next_steps,
  }
}

function normalizeDeadline(deadline, sessionDate) {
  // If it's already YYYY-MM-DD, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return deadline

  // Parse relative deadlines like "This week", "Before Friday March 21 at 4pm"
  // Extract any date-like pattern
  const monthMatch = deadline.match(
    /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})/i
  )
  if (monthMatch) {
    const months = {
      january: '01', february: '02', march: '03', april: '04',
      may: '05', june: '06', july: '07', august: '08',
      september: '09', october: '10', november: '11', december: '12',
    }
    const monthName = deadline.match(
      /January|February|March|April|May|June|July|August|September|October|November|December/i
    )[0].toLowerCase()
    const day = monthMatch[1].padStart(2, '0')
    const year = sessionDate.substring(0, 4)
    return `${year}-${months[monthName]}-${day}`
  }

  // For vague deadlines like "This week", "Ongoing", "Within two to three weeks"
  // Use session date + 7 days as fallback
  const d = new Date(sessionDate)
  d.setDate(d.getDate() + 7)
  return d.toISOString().split('T')[0]
}

function normalizePriority(step) {
  if (step.priority) {
    const p = step.priority.toLowerCase()
    if (p === 'must' || p === 'must_do') return 'must'
    if (p === 'should' || p === 'should_do') return 'should'
    if (p === 'bonus') return 'bonus'
  }
  // Default based on position or context
  if (step.context && step.context.includes('decision point')) return 'should'
  return 'must'
}

// ── Files to process ──────────────────────────

const BASE = resolve(__dirname, '../01 MyTwenties Business/04 Members/Max')

const files = [
  { path: resolve(BASE, 'session_notes_max_hall.json'), callNumber: 0 },
  { path: resolve(BASE, 'session_notes_call1.json'), callNumber: 1 },
  { path: resolve(BASE, 'session_notes_call2.json'), callNumber: 2 },
  { path: resolve(BASE, 'session_notes_call4.json'), callNumber: 4 },
]

// ── Main ──────────────────────────────────────

async function main() {
  console.log('Starting seed for Max Hall session notes...\n')

  // Step 1: Update existing row (building session) to call_number = 0
  console.log('Step 1: Updating existing row to call_number = 0...')
  const buildingRaw = JSON.parse(readFileSync(files[0].path, 'utf-8'))
  const buildingContent = transformSessionNotes(buildingRaw, 0)

  const { error: updateError } = await supabase
    .from('accelerator_assets')
    .update({
      content: buildingContent,
      call_number: 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', EXISTING_ROW_ID)

  if (updateError) {
    console.error('  Failed to update existing row:', updateError)
  } else {
    console.log('  Updated existing row (building session) -> call_number = 0')
  }

  // Step 2: Insert calls 1, 2, 4
  for (const file of files.slice(1)) {
    console.log(`\nStep 2: Inserting call ${file.callNumber}...`)
    const raw = JSON.parse(readFileSync(file.path, 'utf-8'))
    const content = transformSessionNotes(raw, file.callNumber)

    // Delete any existing row for this call_number first (partial index doesn't support upsert)
    await supabase
      .from('accelerator_assets')
      .delete()
      .eq('user_id', MAX_USER_ID)
      .eq('asset_type', 'session_notes')
      .eq('call_number', file.callNumber)

    const { error: insertError } = await supabase
      .from('accelerator_assets')
      .insert({
        user_id: MAX_USER_ID,
        asset_type: 'session_notes',
        call_number: file.callNumber,
        content,
        updated_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error(`  Failed to insert call ${file.callNumber}:`, insertError)
    } else {
      console.log(`  Inserted call ${file.callNumber} successfully`)
    }
  }

  // Step 3: Set call_number on other users' session_notes (set to 1 for single-session users)
  console.log('\nStep 3: Setting call_number = 1 on other users\' session_notes...')
  const { error: otherError } = await supabase
    .from('accelerator_assets')
    .update({ call_number: 1 })
    .eq('asset_type', 'session_notes')
    .is('call_number', null)

  if (otherError) {
    console.error('  Failed to update other session_notes:', otherError)
  } else {
    console.log('  Updated all other session_notes to call_number = 1')
  }

  console.log('\nDone!')
}

main().catch(console.error)
