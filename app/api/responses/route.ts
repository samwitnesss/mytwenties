import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'responses', 50, 60)
  if (limited) return limited

  try {
    const { userId, section, questionId, responseType, responseValue } = await req.json()

    if (!userId || !section || !questionId || !responseType || responseValue === undefined) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Upsert response — if same question answered again, update it
    const { data: existing } = await supabase
      .from('mytwenties_responses')
      .select('id')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .single()

    if (existing) {
      const { error } = await supabase
        .from('mytwenties_responses')
        .update({ response_value: responseValue, response_type: responseType })
        .eq('id', existing.id)

      if (error) {
        console.error('Error updating response:', error)
        return NextResponse.json({ error: 'Failed to update response.' }, { status: 500 })
      }
    } else {
      const { error } = await supabase
        .from('mytwenties_responses')
        .insert({
          user_id: userId,
          section,
          question_id: questionId,
          response_type: responseType,
          response_value: responseValue
        })

      if (error) {
        console.error('Error saving response:', error)
        return NextResponse.json({ error: 'Failed to save response.' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
