'use client'

import { useState, useMemo } from 'react'

interface AnalyticsData {
  funnel: {
    totalUsers: number
    completedReports: number
    paidReports: number
    completionRate: number
    conversionRate: number
    totalRevenue: number
    daysActive: number
  }
  dropOffBySection: { section: string; count: number }[]
  totalDropped: number
  signupsOverTime: { date: string; signups: number; completions: number }[]
  recentDropOffs: {
    firstName: string
    email: string
    questionsAnswered: number
    lastSection: string
    createdAt: string
  }[]
  dailyTracker: {
    date: string
    signups: number
    completions: number
    completionRate: number
    paid: number
    upgradeRate: number
    revenue: number
  }[]
  archetypes: {
    name: string
    count: number
    percentage: number
    paidCount: number
    paidRate: number
  }[]
  directions: {
    title: string
    count: number
    avgFitScore: number
  }[]
  daily?: {
    signups: number
    completions: number
    completionRate: number
    paid: number
    revenue: number
    conversionRate: number
  }
}

// ── Shared styles ──

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '10px 14px', fontSize: '0.72rem', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand-text-mid)',
  borderBottom: '2px solid var(--brand-border)', whiteSpace: 'nowrap', cursor: 'pointer',
  userSelect: 'none', position: 'sticky', top: 0, background: 'var(--brand-card)', zIndex: 2,
}

const THR: React.CSSProperties = { ...TH, textAlign: 'right' }

const TD: React.CSSProperties = {
  padding: '9px 14px', fontSize: '0.84rem', color: 'var(--brand-text)',
  borderBottom: '1px solid var(--brand-border)', whiteSpace: 'nowrap',
}

const TDR: React.CSSProperties = { ...TD, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }

const TDMuted: React.CSSProperties = { ...TD, color: 'var(--brand-text-mid)' }

const CARD: React.CSSProperties = {
  background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
  borderRadius: '14px', overflow: 'hidden', marginBottom: '2rem',
}

const CARD_HEADER: React.CSSProperties = {
  padding: '1rem 1.25rem', borderBottom: '1px solid var(--brand-border)',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px',
}

function completionColor(rate: number): string {
  if (rate >= 60) return '#16a34a'
  if (rate >= 40) return '#d97706'
  return '#dc2626'
}

function upgradeColor(rate: number): string {
  if (rate >= 10) return '#16a34a'
  if (rate >= 5) return '#d97706'
  return '#dc2626'
}

function RateBadge({ value, colorFn }: { value: number; colorFn: (n: number) => string }) {
  const color = colorFn(value)
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem',
      fontWeight: 600, fontVariantNumeric: 'tabular-nums',
      background: color === '#16a34a' ? 'rgba(22,163,74,0.1)' : color === '#d97706' ? 'rgba(217,119,6,0.1)' : 'rgba(220,38,38,0.1)',
      color,
    }}>
      {value.toFixed(1)}%
    </span>
  )
}

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) return <span style={{ opacity: 0.3, marginLeft: '4px', fontSize: '0.65rem' }}>⇅</span>
  return <span style={{ marginLeft: '4px', fontSize: '0.65rem' }}>{dir === 'asc' ? '↑' : '↓'}</span>
}

type SortDir = 'asc' | 'desc'

function useSortable<T>(data: T[], defaultKey: keyof T, defaultDir: SortDir = 'desc') {
  const [sortKey, setSortKey] = useState<keyof T>(defaultKey)
  const [sortDir, setSortDir] = useState<SortDir>(defaultDir)

  function onSort(key: keyof T) {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
  }, [data, sortKey, sortDir])

  return { sorted, sortKey, sortDir, onSort }
}

// ── Date range helpers ──

type RangePreset = 'today' | '7d' | '30d' | 'month' | 'all'

function getMonthOptions(dailyTracker: { date: string }[]): string[] {
  const months = new Set<string>()
  for (const row of dailyTracker) {
    months.add(row.date.slice(0, 7)) // YYYY-MM
  }
  return [...months].sort().reverse()
}

function filterByRange<T extends { date: string }>(
  data: T[],
  preset: RangePreset,
  selectedMonth: string,
): T[] {
  const today = new Date().toISOString().split('T')[0]
  switch (preset) {
    case 'today':
      return data.filter(d => d.date === today)
    case '7d': {
      const cutoff = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
      return data.filter(d => d.date >= cutoff)
    }
    case '30d': {
      const cutoff = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
      return data.filter(d => d.date >= cutoff)
    }
    case 'month':
      return data.filter(d => d.date.startsWith(selectedMonth))
    case 'all':
      return data
  }
}

// ══════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════

export default function AnalyticsPanel({ analytics }: {
  analytics: AnalyticsData
  onDateChange: (date: string | null) => void
}) {
  const [rangePreset, setRangePreset] = useState<RangePreset>('month')
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7))

  const monthOptions = useMemo(() => getMonthOptions(analytics.dailyTracker), [analytics.dailyTracker])

  const filteredDaily = useMemo(
    () => filterByRange(analytics.dailyTracker, rangePreset, selectedMonth),
    [analytics.dailyTracker, rangePreset, selectedMonth],
  )

  const { sorted: sortedDaily, sortKey: dailySortKey, sortDir: dailySortDir, onSort: onDailySort } =
    useSortable(filteredDaily, 'date' as keyof typeof filteredDaily[0], 'desc')

  // Compute totals & averages for filtered period
  const periodTotals = useMemo(() => {
    const t = { signups: 0, completions: 0, paid: 0, revenue: 0 }
    for (const d of filteredDaily) {
      t.signups += d.signups
      t.completions += d.completions
      t.paid += d.paid
      t.revenue += d.revenue
    }
    const days = filteredDaily.length || 1
    return {
      ...t,
      completionRate: t.signups > 0 ? Number(((t.completions / t.signups) * 100).toFixed(1)) : 0,
      upgradeRate: t.completions > 0 ? Number(((t.paid / t.completions) * 100).toFixed(1)) : 0,
      avgSignups: Number((t.signups / days).toFixed(1)),
      avgCompletions: Number((t.completions / days).toFixed(1)),
      avgPaid: Number((t.paid / days).toFixed(1)),
      avgRevenue: Number((t.revenue / days).toFixed(1)),
    }
  }, [filteredDaily])

  const { sorted: sortedArch, sortKey: archSortKey, sortDir: archSortDir, onSort: onArchSort } =
    useSortable(analytics.archetypes, 'count' as keyof typeof analytics.archetypes[0], 'desc')

  const { sorted: sortedDirs, sortKey: dirSortKey, sortDir: dirSortDir, onSort: onDirSort } =
    useSortable(analytics.directions, 'count' as keyof typeof analytics.directions[0], 'desc')

  // Drop-off table with computed usersReached
  const dropOffTable = useMemo(() => {
    const totalEntered = analytics.funnel.totalUsers
    let remaining = totalEntered
    return analytics.dropOffBySection.map(d => {
      const reached = remaining
      remaining -= d.count
      const dropRate = reached > 0 ? Number(((d.count / reached) * 100).toFixed(1)) : 0
      const pctOfTotal = analytics.totalDropped > 0 ? Number(((d.count / analytics.totalDropped) * 100).toFixed(1)) : 0
      return { section: d.section, reached, dropped: d.count, dropRate, pctOfTotal }
    })
  }, [analytics.dropOffBySection, analytics.funnel.totalUsers, analytics.totalDropped])

  const { sorted: sortedDropOff, sortKey: dropSortKey, sortDir: dropSortDir, onSort: onDropSort } =
    useSortable(dropOffTable, 'dropped' as keyof typeof dropOffTable[0], 'desc')

  const f = analytics.funnel

  // ── Preset button style ──
  function presetBtn(p: RangePreset, label: string) {
    const active = rangePreset === p
    return (
      <button
        key={p}
        onClick={() => setRangePreset(p)}
        style={{
          padding: '5px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
          fontSize: '0.78rem', fontWeight: active ? 700 : 500, fontFamily: 'inherit',
          background: active ? 'rgba(37,99,235,0.1)' : 'transparent',
          color: active ? '#2563eb' : 'var(--brand-text-mid)',
          transition: 'all 0.15s',
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <>
      {/* ═══════ TABLE 2: FUNNEL SUMMARY ═══════ */}
      <div style={CARD}>
        <div style={CARD_HEADER}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--brand-text)' }}>
            Funnel Summary
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--brand-text-mid)' }}>All time</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={THR}>Total Signups</th>
                <th style={THR}>Total Completions</th>
                <th style={THR}>Completion Rate</th>
                <th style={THR}>Total Paid</th>
                <th style={THR}>Upgrade Rate</th>
                <th style={THR}>Total Revenue</th>
                <th style={THR}>Avg Rev/Day</th>
                <th style={THR}>Avg Rev/Signup</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...TDR, fontWeight: 700 }}>{f.totalUsers}</td>
                <td style={{ ...TDR, fontWeight: 700 }}>{f.completedReports}</td>
                <td style={TDR}><RateBadge value={f.completionRate} colorFn={completionColor} /></td>
                <td style={{ ...TDR, fontWeight: 700 }}>{f.paidReports}</td>
                <td style={TDR}><RateBadge value={f.conversionRate} colorFn={upgradeColor} /></td>
                <td style={{ ...TDR, fontWeight: 700, color: f.totalRevenue > 0 ? '#16a34a' : undefined }}>
                  ${f.totalRevenue.toLocaleString()}
                </td>
                <td style={TDR}>${(f.totalRevenue / f.daysActive).toFixed(0)}</td>
                <td style={TDR}>${f.totalUsers > 0 ? (f.totalRevenue / f.totalUsers).toFixed(2) : '0.00'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════ TABLE 1: DAILY TRACKER ═══════ */}
      <div style={CARD}>
        <div style={CARD_HEADER}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--brand-text)' }}>
            Daily Tracker
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {presetBtn('today', 'Today')}
            {presetBtn('7d', '7 Days')}
            {presetBtn('30d', '30 Days')}
            {presetBtn('month', 'Month')}
            {presetBtn('all', 'All Time')}
            {rangePreset === 'month' && (
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                style={{
                  padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--brand-border)',
                  background: 'var(--brand-card)', color: 'var(--brand-text)', fontSize: '0.8rem',
                  fontFamily: 'inherit', outline: 'none', marginLeft: '4px',
                }}
              >
                {monthOptions.map(m => (
                  <option key={m} value={m}>
                    {new Date(m + '-01').toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {([
                  ['date', 'Date', false],
                  ['signups', 'Signups', true],
                  ['completions', 'Completions', true],
                  ['completionRate', 'Comp. Rate', true],
                  ['paid', 'Paid Upgrades', true],
                  ['upgradeRate', 'Upgrade Rate', true],
                  ['revenue', 'FE Revenue', true],
                ] as [string, string, boolean][]).map(([key, label, right]) => (
                  <th
                    key={key}
                    style={right ? THR : TH}
                    onClick={() => onDailySort(key as keyof typeof filteredDaily[0])}
                  >
                    {label}
                    <SortIcon active={dailySortKey === key} dir={dailySortDir} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedDaily.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...TD, textAlign: 'center', color: 'var(--brand-text-mid)', padding: '2rem 14px' }}>
                    No data for this period
                  </td>
                </tr>
              ) : (
                <>
                  {sortedDaily.map(d => (
                    <tr key={d.date}>
                      <td style={TDMuted}>
                        {new Date(d.date + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', weekday: 'short' })}
                      </td>
                      <td style={TDR}>{d.signups}</td>
                      <td style={TDR}>{d.completions}</td>
                      <td style={TDR}>
                        {d.signups > 0 ? <RateBadge value={d.completionRate} colorFn={completionColor} /> : <span style={{ color: 'var(--brand-text-mid)' }}>—</span>}
                      </td>
                      <td style={TDR}>{d.paid}</td>
                      <td style={TDR}>
                        {d.completions > 0 ? <RateBadge value={d.upgradeRate} colorFn={upgradeColor} /> : <span style={{ color: 'var(--brand-text-mid)' }}>—</span>}
                      </td>
                      <td style={{ ...TDR, color: d.revenue > 0 ? '#16a34a' : 'var(--brand-text-mid)' }}>
                        ${d.revenue}
                      </td>
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr style={{ borderTop: '2px solid var(--brand-border)', background: 'rgba(37,99,235,0.03)' }}>
                    <td style={{ ...TD, fontWeight: 700, fontSize: '0.8rem' }}>TOTAL</td>
                    <td style={{ ...TDR, fontWeight: 700 }}>{periodTotals.signups}</td>
                    <td style={{ ...TDR, fontWeight: 700 }}>{periodTotals.completions}</td>
                    <td style={TDR}><RateBadge value={periodTotals.completionRate} colorFn={completionColor} /></td>
                    <td style={{ ...TDR, fontWeight: 700 }}>{periodTotals.paid}</td>
                    <td style={TDR}><RateBadge value={periodTotals.upgradeRate} colorFn={upgradeColor} /></td>
                    <td style={{ ...TDR, fontWeight: 700, color: '#16a34a' }}>${periodTotals.revenue}</td>
                  </tr>
                  {/* Averages row */}
                  <tr style={{ background: 'rgba(37,99,235,0.03)' }}>
                    <td style={{ ...TD, fontWeight: 700, fontSize: '0.8rem', color: 'var(--brand-text-mid)' }}>AVG/DAY</td>
                    <td style={{ ...TDR, color: 'var(--brand-text-mid)' }}>{periodTotals.avgSignups}</td>
                    <td style={{ ...TDR, color: 'var(--brand-text-mid)' }}>{periodTotals.avgCompletions}</td>
                    <td style={TDR} />
                    <td style={{ ...TDR, color: 'var(--brand-text-mid)' }}>{periodTotals.avgPaid}</td>
                    <td style={TDR} />
                    <td style={{ ...TDR, color: 'var(--brand-text-mid)' }}>${periodTotals.avgRevenue}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════ TABLE 3: DROP-OFF ANALYSIS ═══════ */}
      <div style={CARD}>
        <div style={CARD_HEADER}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--brand-text)' }}>
            Drop-off Analysis
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--brand-text-mid)' }}>
            {analytics.totalDropped} total drop-offs
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {([
                  ['section', 'Section', false],
                  ['reached', 'Users Reached', true],
                  ['dropped', 'Users Dropped', true],
                  ['dropRate', 'Drop-off Rate', true],
                  ['pctOfTotal', '% of Total Drop-offs', true],
                ] as [string, string, boolean][]).map(([key, label, right]) => (
                  <th
                    key={key}
                    style={right ? THR : TH}
                    onClick={() => onDropSort(key as keyof typeof dropOffTable[0])}
                  >
                    {label}
                    <SortIcon active={dropSortKey === key} dir={dropSortDir} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedDropOff.map((d, i) => (
                <tr key={i}>
                  <td style={{ ...TD, fontWeight: 600 }}>{d.section}</td>
                  <td style={TDR}>{d.reached}</td>
                  <td style={{ ...TDR, fontWeight: d.dropped > 0 ? 600 : 400 }}>{d.dropped}</td>
                  <td style={TDR}>
                    {d.reached > 0 ? <RateBadge value={d.dropRate} colorFn={completionColor} /> : '—'}
                  </td>
                  <td style={TDR}>
                    {d.dropped > 0 ? `${d.pctOfTotal.toFixed(1)}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-column grid for Archetypes & Directions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

        {/* ═══════ TABLE 4: ARCHETYPE DISTRIBUTION ═══════ */}
        <div style={{ ...CARD, marginBottom: 0 }}>
          <div style={CARD_HEADER}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--brand-text)' }}>
              Archetype Distribution
            </h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {([
                    ['name', 'Archetype', false],
                    ['count', 'Count', true],
                    ['percentage', '% of Total', true],
                    ['paidRate', 'Paid Upgrade Rate', true],
                  ] as [string, string, boolean][]).map(([key, label, right]) => (
                    <th
                      key={key}
                      style={right ? THR : TH}
                      onClick={() => onArchSort(key as keyof typeof analytics.archetypes[0])}
                    >
                      {label}
                      <SortIcon active={archSortKey === key} dir={archSortDir} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedArch.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ ...TD, textAlign: 'center', color: 'var(--brand-text-mid)', padding: '2rem 14px' }}>
                      No report data yet
                    </td>
                  </tr>
                ) : (
                  sortedArch.map(a => (
                    <tr key={a.name}>
                      <td style={{ ...TD, fontWeight: 600 }}>
                        <span style={{
                          display: 'inline-block', padding: '3px 10px', borderRadius: '6px',
                          background: 'rgba(37,99,235,0.07)', color: '#2563eb', fontSize: '0.82rem',
                          border: '1px solid rgba(37,99,235,0.15)',
                        }}>
                          {a.name}
                        </span>
                      </td>
                      <td style={TDR}>{a.count}</td>
                      <td style={TDR}>{a.percentage.toFixed(1)}%</td>
                      <td style={TDR}>
                        <RateBadge value={a.paidRate} colorFn={upgradeColor} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--brand-text-mid)', marginLeft: '6px' }}>
                          ({a.paidCount})
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════ TABLE 5: TOP DIRECTIONS ═══════ */}
        <div style={{ ...CARD, marginBottom: 0 }}>
          <div style={CARD_HEADER}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--brand-text)' }}>
              Top Directions
            </h3>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {([
                    ['title', 'Direction', false],
                    ['count', 'Times Recommended', true],
                    ['avgFitScore', 'Avg Fit Score', true],
                  ] as [string, string, boolean][]).map(([key, label, right]) => (
                    <th
                      key={key}
                      style={right ? THR : TH}
                      onClick={() => onDirSort(key as keyof typeof analytics.directions[0])}
                    >
                      {label}
                      <SortIcon active={dirSortKey === key} dir={dirSortDir} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedDirs.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ ...TD, textAlign: 'center', color: 'var(--brand-text-mid)', padding: '2rem 14px' }}>
                      No report data yet
                    </td>
                  </tr>
                ) : (
                  sortedDirs.map(d => (
                    <tr key={d.title}>
                      <td style={{ ...TD, fontWeight: 500, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {d.title}
                      </td>
                      <td style={TDR}>{d.count}</td>
                      <td style={TDR}>
                        <span style={{
                          display: 'inline-block', padding: '2px 8px', borderRadius: '6px',
                          fontSize: '0.8rem', fontWeight: 600,
                          background: d.avgFitScore >= 80 ? 'rgba(22,163,74,0.1)' : d.avgFitScore >= 60 ? 'rgba(217,119,6,0.1)' : 'rgba(100,116,139,0.1)',
                          color: d.avgFitScore >= 80 ? '#16a34a' : d.avgFitScore >= 60 ? '#d97706' : 'var(--brand-text-mid)',
                        }}>
                          {d.avgFitScore.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══════ RECENT DROP-OFFS TABLE ═══════ */}
      <div style={CARD}>
        <div style={CARD_HEADER}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--brand-text)' }}>
              Recent Drop-offs
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--brand-text-mid)', marginTop: '4px', marginBottom: 0 }}>
              Users who signed up but haven&apos;t completed the assessment
            </p>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={TH}>Name</th>
                <th style={TH}>Email</th>
                <th style={THR}>Questions</th>
                <th style={TH}>Last Section</th>
                <th style={TH}>Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentDropOffs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ ...TD, textAlign: 'center', color: 'var(--brand-text-mid)', padding: '2rem 14px' }}>
                    No drop-offs — everyone completed!
                  </td>
                </tr>
              ) : (
                analytics.recentDropOffs.map((d, i) => (
                  <tr key={i}>
                    <td style={{ ...TD, fontWeight: 600 }}>{d.firstName}</td>
                    <td style={TDMuted}>{d.email}</td>
                    <td style={TDR}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px',
                        background: d.questionsAnswered === 0 ? 'rgba(220,38,38,0.08)' : 'rgba(37,99,235,0.08)',
                        color: d.questionsAnswered === 0 ? '#dc2626' : '#2563eb',
                        borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500,
                      }}>
                        {d.questionsAnswered} / 75
                      </span>
                    </td>
                    <td style={TDMuted}>{d.lastSection || '—'}</td>
                    <td style={TDMuted}>
                      {new Date(d.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
