import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import { SECTIONS } from '@/lib/questions'

// Build a map: questionId -> { sectionIndex, sectionTitle }
const QUESTION_SECTION_MAP: Record<string, { index: number; title: string }> = {}
SECTIONS.forEach((s, i) => {
  for (const q of s.questions) {
    QUESTION_SECTION_MAP[q.id] = { index: i, title: s.title }
  }
})

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'admin', 5, 60)
  if (limited) return limited

  try {
    const { email, password } = await req.json()

    const adminEmail = process.env.ADMIN_EMAIL || 'sam@samwitness.com'
    const adminPassword = process.env.ADMIN_SECRET
    if (!adminPassword || email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    // 1. Fetch all users
    const { data: users } = await supabase
      .from('mytwenties_users')
      .select('id, first_name, email, created_at')
      .order('created_at', { ascending: false })

    // 2. Fetch all completed reports
    const { data: reports } = await supabase
      .from('mytwenties_reports')
      .select('id, user_id, report_type, created_at')
      .eq('status', 'ready')
      .order('created_at', { ascending: false })

    const allUsers = users ?? []
    const allReports = reports ?? []
    const totalUsers = allUsers.length

    // Deduplicate reports by user_id (take latest)
    const userReportMap = new Map<string, { report_type: string; created_at: string }>()
    for (const r of allReports) {
      if (!userReportMap.has(r.user_id)) {
        userReportMap.set(r.user_id, { report_type: r.report_type, created_at: r.created_at })
      }
    }

    const usersWithReport = userReportMap.size
    const paidReports = [...userReportMap.values()].filter(
      r => r.report_type === 'paid' || r.report_type === 'paid_pending'
    ).length

    const completionRate = totalUsers > 0 ? Math.round((usersWithReport / totalUsers) * 100) : 0
    const conversionRate = usersWithReport > 0 ? Math.round((paidReports / usersWithReport) * 100) : 0

    // 3. Drop-off analysis — users who signed up but have no completed report
    const droppedUserIds = allUsers
      .filter(u => !userReportMap.has(u.id))
      .map(u => u.id)

    // Fetch responses for dropped users (batch if needed)
    const dropOffBySectionArr: { section: string; sectionNumber: number; count: number }[] = []
    const sectionCounts: Record<string, number> = { 'Never Started': 0 }
    for (const s of SECTIONS) {
      sectionCounts[s.title] = 0
    }

    const droppedUserDetails: {
      firstName: string
      email: string
      questionsAnswered: number
      lastSection: string
      signedUp: string
    }[] = []

    if (droppedUserIds.length > 0) {
      // Fetch responses in batches of 50 user IDs
      const batchSize = 50
      const allDroppedResponses: { user_id: string; question_id: string }[] = []

      for (let i = 0; i < droppedUserIds.length; i += batchSize) {
        const batch = droppedUserIds.slice(i, i + batchSize)
        const { data: responses } = await supabase
          .from('mytwenties_responses')
          .select('user_id, question_id')
          .in('user_id', batch)

        if (responses) allDroppedResponses.push(...responses)
      }

      // Group responses by user (deduplicate by question_id)
      const responsesByUser = new Map<string, Set<string>>()
      for (const r of allDroppedResponses) {
        const existing = responsesByUser.get(r.user_id) ?? new Set<string>()
        existing.add(r.question_id)
        responsesByUser.set(r.user_id, existing)
      }

      // For each dropped user, find their last section
      const droppedUsersMap = new Map(allUsers.filter(u => !userReportMap.has(u.id)).map(u => [u.id, u]))

      for (const userId of droppedUserIds) {
        const questionIds = responsesByUser.get(userId) ?? new Set<string>()
        const user = droppedUsersMap.get(userId)

        if (questionIds.size === 0) {
          sectionCounts['Never Started']++
          if (user) {
            droppedUserDetails.push({
              firstName: user.first_name ?? 'Unknown',
              email: user.email ?? 'Unknown',
              questionsAnswered: 0,
              lastSection: 'Never Started',
              signedUp: user.created_at,
            })
          }
        } else {
          // Find the highest section index among answered questions
          let maxSectionIndex = 0
          let maxSectionTitle = SECTIONS[0].title
          for (const qid of Array.from(questionIds)) {
            const mapping = QUESTION_SECTION_MAP[qid]
            if (mapping && mapping.index >= maxSectionIndex) {
              maxSectionIndex = mapping.index
              maxSectionTitle = mapping.title
            }
          }
          sectionCounts[maxSectionTitle] = (sectionCounts[maxSectionTitle] ?? 0) + 1
          if (user) {
            droppedUserDetails.push({
              firstName: user.first_name ?? 'Unknown',
              email: user.email ?? 'Unknown',
              questionsAnswered: questionIds.size,
              lastSection: maxSectionTitle,
              signedUp: user.created_at,
            })
          }
        }
      }
    }

    // Build drop-off array
    dropOffBySectionArr.push({
      section: 'Never Started',
      sectionNumber: 0,
      count: sectionCounts['Never Started'],
    })
    SECTIONS.forEach((s, i) => {
      dropOffBySectionArr.push({
        section: s.title,
        sectionNumber: i + 1,
        count: sectionCounts[s.title] ?? 0,
      })
    })

    // 4. Signups & completions over time (last 30 days)
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const dateMap = new Map<string, { signups: number; completions: number }>()

    // Initialize all 30 days
    for (let d = 0; d < 30; d++) {
      const date = new Date(thirtyDaysAgo.getTime() + d * 24 * 60 * 60 * 1000)
      const key = date.toISOString().split('T')[0]
      dateMap.set(key, { signups: 0, completions: 0 })
    }

    for (const u of allUsers) {
      const day = u.created_at?.split('T')[0]
      if (day && dateMap.has(day)) {
        dateMap.get(day)!.signups++
      }
    }

    for (const r of allReports) {
      const day = r.created_at?.split('T')[0]
      if (day && dateMap.has(day)) {
        dateMap.get(day)!.completions++
      }
    }

    const signupsOverTime = [...dateMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }))

    // 5. Recent activity
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()

    const recentActivity = {
      totalLast7Days: allUsers.filter(u => u.created_at >= sevenDaysAgo).length,
      totalLast30Days: allUsers.filter(u => u.created_at >= thirtyDaysAgoISO).length,
      completionsLast7Days: allReports.filter(r => r.created_at >= sevenDaysAgo).length,
      completionsLast30Days: allReports.filter(r => r.created_at >= thirtyDaysAgoISO).length,
    }

    // Sort dropped user details by signup date (most recent first), take top 10
    droppedUserDetails.sort((a, b) => b.signedUp.localeCompare(a.signedUp))
    const recentDropOffs = droppedUserDetails.slice(0, 10)

    return NextResponse.json({
      funnel: {
        totalUsers,
        usersWithReport,
        paidReports,
        completionRate,
        conversionRate,
      },
      dropOff: dropOffBySectionArr,
      signupsOverTime,
      recentActivity,
      recentDropOffs,
    })
  } catch (err) {
    console.error('Analytics error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
