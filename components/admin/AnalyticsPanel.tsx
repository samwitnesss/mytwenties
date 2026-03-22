'use client'

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts'

interface AnalyticsData {
  funnel: {
    totalUsers: number
    completedReports: number
    paidReports: number
    completionRate: number
    conversionRate: number
    totalRevenue: number
  }
  dropOffBySection: { section: string; count: number }[]
  signupsOverTime: { date: string; signups: number; completions: number }[]
  recentDropOffs: {
    firstName: string
    email: string
    questionsAnswered: number
    lastSection: string
    createdAt: string
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

function rateColor(rate: number): string {
  if (rate >= 70) return '#16a34a'
  if (rate >= 40) return '#d97706'
  return '#dc2626'
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{
      background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
      borderRadius: '14px', padding: '1.25rem 1.5rem'
    }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-text-mid)', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: color || 'var(--brand-text)' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '0.8rem', color: 'var(--brand-text-mid)', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px',
      padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
    }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>{label}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} style={{ fontSize: '0.78rem', color: entry.color, display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, display: 'inline-block' }} />
          {entry.name}: <strong>{entry.value}</strong>
        </div>
      ))}
    </div>
  )
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const SECTION_ABBREV: Record<string, string> = {
  'The Basics': 'Basics',
  'Your Wiring': 'Wiring',
  'Your Inner World': 'Inner World',
  'Relationships & Roots': 'Relationships',
  'Energy & Patterns': 'Energy',
  'Interests & Skills': 'Interests',
  "What's in the Way": 'Blockers',
  'The Deep Cut': 'Deep Cut',
  'Never Started': 'Never Started',
}

export default function AnalyticsPanel({ analytics, onDateChange }: {
  analytics: AnalyticsData
  onDateChange: (date: string | null) => void
}) {
  const [view, setView] = useState<'overall' | 'daily'>('overall')
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])

  function handleViewChange(v: 'overall' | 'daily') {
    setView(v)
    if (v === 'daily') {
      onDateChange(selectedDate)
    } else {
      onDateChange(null)
    }
  }

  function handleDateChange(date: string) {
    setSelectedDate(date)
    onDateChange(date)
  }

  return (
    <>
      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '1px solid var(--brand-border)' }}>
        {(['overall', 'daily'] as const).map(v => (
          <button
            key={v}
            onClick={() => handleViewChange(v)}
            style={{
              padding: '0.75rem 1.5rem', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '0.9rem', fontWeight: view === v ? 700 : 500, fontFamily: 'inherit',
              color: view === v ? '#2563eb' : 'var(--brand-text-mid)',
              borderBottom: view === v ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: '-1px', transition: 'all 0.15s'
            }}
          >
            {v === 'overall' ? 'Overall' : 'Daily'}
          </button>
        ))}
      </div>

      {view === 'daily' && (
        <>
          {/* Date Picker */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-text-mid)' }}>
              Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => handleDateChange(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              style={{
                padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--brand-border)',
                background: 'var(--brand-card)', color: 'var(--brand-text)', fontSize: '0.9rem',
                fontFamily: 'inherit', outline: 'none'
              }}
            />
          </div>

          {/* Daily Stat Cards */}
          {analytics.daily ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <StatCard
                label="Signups"
                value={String(analytics.daily.signups)}
              />
              <StatCard
                label="Completed"
                value={String(analytics.daily.completions)}
              />
              <StatCard
                label="Completion Rate"
                value={analytics.daily.signups > 0 ? `${analytics.daily.completionRate}%` : '—'}
                color={analytics.daily.signups > 0 ? rateColor(analytics.daily.completionRate) : undefined}
              />
              <StatCard
                label="Paid Upgrades"
                value={String(analytics.daily.paid)}
              />
              <StatCard
                label="Revenue"
                value={analytics.daily.revenue > 0 ? `$${analytics.daily.revenue}` : '$0'}
                color={analytics.daily.revenue > 0 ? '#16a34a' : undefined}
              />
              <StatCard
                label="Paid Conversion"
                value={analytics.daily.completions > 0 ? `${analytics.daily.conversionRate}%` : '—'}
                color={analytics.daily.completions > 0 ? rateColor(analytics.daily.conversionRate) : undefined}
              />
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--brand-text-mid)', fontSize: '0.9rem' }}>
              Loading daily stats...
            </div>
          )}
        </>
      )}

      {view === 'overall' && (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard
              label="Total Users"
              value={String(analytics.funnel.totalUsers)}
              sub="All signups"
            />
            <StatCard
              label="Completion Rate"
              value={`${analytics.funnel.completionRate}%`}
              sub={`${analytics.funnel.completedReports} of ${analytics.funnel.totalUsers} completed`}
              color={rateColor(analytics.funnel.completionRate)}
            />
            <StatCard
              label="Paid Upgrades"
              value={String(analytics.funnel.paidReports)}
              sub={`${analytics.funnel.conversionRate}% conversion`}
            />
            <StatCard
              label="Total Revenue"
              value={analytics.funnel.totalRevenue > 0 ? `$${analytics.funnel.totalRevenue}` : '$0'}
              sub={`${analytics.funnel.paidReports} × $29`}
              color={analytics.funnel.totalRevenue > 0 ? '#16a34a' : undefined}
            />
            <StatCard
              label="Call Bookings"
              value="—"
              sub="Coming soon"
            />
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Drop-off by Section */}
            <div style={{
              background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
              borderRadius: '14px', padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 1.25rem 0', color: 'var(--brand-text)' }}>
                Drop-off by Section
              </h3>
              {analytics.dropOffBySection.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={analytics.dropOffBySection.map(d => ({ ...d, section: SECTION_ABBREV[d.section] || d.section }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" />
                    <XAxis dataKey="section" tick={{ fontSize: 11, fill: 'var(--brand-text-mid)' }} interval={0} angle={-30} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--brand-text-mid)' }} allowDecimals={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="count" name="Dropped" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-text-mid)', fontSize: '0.9rem' }}>
                  Not enough data yet
                </div>
              )}
            </div>

            {/* Signups & Completions Over Time */}
            <div style={{
              background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
              borderRadius: '14px', padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 1.25rem 0', color: 'var(--brand-text)' }}>
                Signups & Completions (30 days)
              </h3>
              {analytics.signupsOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={analytics.signupsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--brand-text-mid)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--brand-text-mid)' }} allowDecimals={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="signups" name="Signups" stroke="#2563eb" fill="rgba(37,99,235,0.15)" strokeWidth={2} />
                    <Area type="monotone" dataKey="completions" name="Completions" stroke="#06b6d4" fill="rgba(6,182,212,0.15)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-text-mid)', fontSize: '0.9rem' }}>
                  Not enough data yet
                </div>
              )}
            </div>
          </div>

          {/* Recent Drop-offs Table */}
          <div style={{
            background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
            borderRadius: '14px', overflow: 'hidden'
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--brand-border)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--brand-text)' }}>
                Recent Drop-offs
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--brand-text-mid)', marginTop: '4px' }}>
                Users who signed up but haven&apos;t completed the assessment
              </p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--brand-border)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--brand-text-mid)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--brand-text-mid)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--brand-text-mid)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Questions</th>
                    <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--brand-text-mid)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Section</th>
                    <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--brand-text-mid)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Signed Up</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentDropOffs.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '2rem 16px', textAlign: 'center', color: 'var(--brand-text-mid)', fontSize: '0.9rem' }}>
                        No drop-offs — everyone completed!
                      </td>
                    </tr>
                  ) : (
                    analytics.recentDropOffs.map((d, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--brand-text)' }}>
                          {d.firstName}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--brand-text-mid)', fontSize: '0.85rem' }}>
                          {d.email}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            display: 'inline-block', padding: '3px 10px',
                            background: d.questionsAnswered === 0 ? 'rgba(220,38,38,0.08)' : 'rgba(37,99,235,0.08)',
                            color: d.questionsAnswered === 0 ? '#dc2626' : '#2563eb',
                            borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500
                          }}>
                            {d.questionsAnswered} / 75
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--brand-text-mid)', fontSize: '0.85rem' }}>
                          {d.lastSection || '—'}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--brand-text-mid)', fontSize: '0.85rem' }}>
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
      )}
    </>
  )
}
