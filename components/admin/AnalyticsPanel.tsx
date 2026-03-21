'use client'

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

export default function AnalyticsPanel({ analytics }: { analytics: AnalyticsData }) {
  return (
    <>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
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
          label="Conversion Rate"
          value={analytics.funnel.completedReports > 0 ? `${analytics.funnel.conversionRate}%` : '—'}
          sub={analytics.funnel.completedReports > 0 ? `${analytics.funnel.paidReports} paid of ${analytics.funnel.completedReports}` : 'No completed reports yet'}
          color={analytics.funnel.completedReports > 0 ? rateColor(analytics.funnel.conversionRate) : undefined}
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
  )
}
