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
    const { email, password, date } = await req.json()

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

    // 2. Fetch all completed reports (with report_data for archetype/direction analysis)
    const { data: reports } = await supabase
      .from('mytwenties_reports')
      .select('id, user_id, report_type, report_data, created_at')
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

      const responsesByUser = new Map<string, Set<string>>()
      for (const r of allDroppedResponses) {
        const existing = responsesByUser.get(r.user_id) ?? new Set<string>()
        existing.add(r.question_id)
        responsesByUser.set(r.user_id, existing)
      }

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

    // Build drop-off array with usersReached for funnel analysis
    const totalDropped = droppedUserIds.length
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

    for (let d = 0; d < 30; d++) {
      const dt = new Date(thirtyDaysAgo.getTime() + d * 24 * 60 * 60 * 1000)
      const key = dt.toISOString().split('T')[0]
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
      .map(([d, data]) => ({ date: d, ...data }))

    // 5. Recent activity
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()

    const recentActivity = {
      totalLast7Days: allUsers.filter(u => u.created_at >= sevenDaysAgo).length,
      totalLast30Days: allUsers.filter(u => u.created_at >= thirtyDaysAgoISO).length,
      completionsLast7Days: allReports.filter(r => r.created_at >= sevenDaysAgo).length,
      completionsLast30Days: allReports.filter(r => r.created_at >= thirtyDaysAgoISO).length,
    }

    droppedUserDetails.sort((a, b) => b.signedUp.localeCompare(a.signedUp))
    const recentDropOffs = droppedUserDetails.slice(0, 10)

    // 6. Daily stats (when date is provided)
    let daily = null
    if (date && typeof date === 'string') {
      const dayStart = `${date}T00:00:00.000Z`
      const nextDay = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
      const dayEnd = nextDay.toISOString().split('T')[0] + 'T00:00:00.000Z'

      const daySignups = allUsers.filter(u => u.created_at >= dayStart && u.created_at < dayEnd).length
      const dayReports = allReports.filter(r => r.created_at >= dayStart && r.created_at < dayEnd)
      const dayCompletions = dayReports.length
      const dayPaid = dayReports.filter(r => r.report_type === 'paid' || r.report_type === 'paid_pending').length

      daily = {
        signups: daySignups,
        completions: dayCompletions,
        completionRate: daySignups > 0 ? Math.round((dayCompletions / daySignups) * 100) : 0,
        paid: dayPaid,
        revenue: dayPaid * 29,
        conversionRate: dayCompletions > 0 ? Math.round((dayPaid / dayCompletions) * 100) : 0,
      }
    }

    // 7. Daily tracker — per-day stats for all days with activity
    const dailyTrackerMap = new Map<string, { signups: number; completions: number; paid: number }>()

    for (const u of allUsers) {
      const day = u.created_at?.split('T')[0]
      if (day) {
        if (!dailyTrackerMap.has(day)) dailyTrackerMap.set(day, { signups: 0, completions: 0, paid: 0 })
        dailyTrackerMap.get(day)!.signups++
      }
    }

    for (const r of allReports) {
      const day = r.created_at?.split('T')[0]
      if (day) {
        if (!dailyTrackerMap.has(day)) dailyTrackerMap.set(day, { signups: 0, completions: 0, paid: 0 })
        dailyTrackerMap.get(day)!.completions++
        if (r.report_type === 'paid' || r.report_type === 'paid_pending') {
          dailyTrackerMap.get(day)!.paid++
        }
      }
    }

    const dailyTracker = [...dailyTrackerMap.entries()]
      .sort(([a], [b]) => b.localeCompare(a)) // newest first
      .map(([d, data]) => ({
        date: d,
        signups: data.signups,
        completions: data.completions,
        completionRate: data.signups > 0 ? Number(((data.completions / data.signups) * 100).toFixed(1)) : 0,
        paid: data.paid,
        upgradeRate: data.completions > 0 ? Number(((data.paid / data.completions) * 100).toFixed(1)) : 0,
        revenue: data.paid * 29,
      }))

    // 8. Archetype distribution from report_data
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const archetypeCounts = new Map<string, { total: number; paid: number }>()
    const directionCounts = new Map<string, { count: number; totalFitScore: number }>()

    for (const r of allReports) {
      // Only count the latest report per user (allReports is already sorted desc, userReportMap has latest)
      const rd = r.report_data as any
      if (!rd) continue

      // Archetype
      const archName = rd?.archetype?.primary?.name
      if (archName && typeof archName === 'string') {
        const existing = archetypeCounts.get(archName) ?? { total: 0, paid: 0 }
        existing.total++
        if (r.report_type === 'paid' || r.report_type === 'paid_pending') existing.paid++
        archetypeCounts.set(archName, existing)
      }

      // Directions
      const dirs = rd?.directions
      if (Array.isArray(dirs)) {
        for (const dir of dirs) {
          if (dir?.title && typeof dir.title === 'string') {
            const existing = directionCounts.get(dir.title) ?? { count: 0, totalFitScore: 0 }
            existing.count++
            if (typeof dir.fit_score === 'number') existing.totalFitScore += dir.fit_score
            directionCounts.set(dir.title, existing)
          }
        }
      }
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const totalReportsForArch = [...archetypeCounts.values()].reduce((sum, a) => sum + a.total, 0)
    const archetypes = [...archetypeCounts.entries()]
      .sort(([, a], [, b]) => b.total - a.total)
      .map(([name, data]) => ({
        name,
        count: data.total,
        percentage: totalReportsForArch > 0 ? Number(((data.total / totalReportsForArch) * 100).toFixed(1)) : 0,
        paidCount: data.paid,
        paidRate: data.total > 0 ? Number(((data.paid / data.total) * 100).toFixed(1)) : 0,
      }))

    const directions = [...directionCounts.entries()]
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 20) // top 20
      .map(([title, data]) => ({
        title,
        count: data.count,
        avgFitScore: data.count > 0 ? Number(((data.totalFitScore / data.count) * 100).toFixed(1)) : 0,
      }))

    // 9. Compute first signup date for "days active"
    const firstSignupDate = allUsers.length > 0
      ? allUsers[allUsers.length - 1].created_at?.split('T')[0]
      : null
    const daysActive = firstSignupDate
      ? Math.max(1, Math.ceil((now.getTime() - new Date(firstSignupDate).getTime()) / (24 * 60 * 60 * 1000)))
      : 1

    return NextResponse.json({
      funnel: {
        totalUsers,
        usersWithReport,
        paidReports,
        completionRate,
        conversionRate,
        totalRevenue: paidReports * 29,
        daysActive,
      },
      dropOff: dropOffBySectionArr,
      totalDropped,
      signupsOverTime,
      recentActivity,
      recentDropOffs,
      dailyTracker,
      archetypes,
      directions,
      ...(daily ? { daily } : {}),
    })
  } catch (err) {
    console.error('Analytics error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
