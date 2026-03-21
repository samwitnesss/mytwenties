'use client'

import { useState } from 'react'
import Link from 'next/link'

interface UserReport {
  reportId: string
  userId: string
  firstName: string
  email: string
  tier: string
  reportType: string
  completedAt: string
  headline: string
  primaryArchetype: string
}

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

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState<UserReport[]>([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'reports' | 'analytics'>('reports')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState('')
  const [analyticsFetched, setAnalyticsFetched] = useState(false)

  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter email and password.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error === 'Unauthorized' ? 'Invalid credentials.' : data.error)
        setLoading(false)
        return
      }

      setUsers(data.users)
      setAuthEmail(email.trim())
      setAuthPassword(password)
      setAuthed(true)
      setLoading(false)
    } catch {
      setError('Something went wrong.')
      setLoading(false)
    }
  }

  async function fetchAnalytics() {
    if (analyticsFetched) return
    setAnalyticsLoading(true)
    setAnalyticsError('')

    try {
      const res = await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      })
      const data = await res.json()

      if (!res.ok) {
        setAnalyticsError(data.error || 'Failed to load analytics.')
        setAnalyticsLoading(false)
        return
      }

      setAnalytics(data)
      setAnalyticsFetched(true)
      setAnalyticsLoading(false)
    } catch {
      setAnalyticsError('Something went wrong loading analytics.')
      setAnalyticsLoading(false)
    }
  }

  function handleTabClick(tab: 'reports' | 'analytics') {
    setActiveTab(tab)
    if (tab === 'analytics' && !analyticsFetched) {
      fetchAnalytics()
    }
  }

  const filtered = users.filter(u => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return u.firstName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  if (!authed) {
    return (
      <main style={{
        backgroundColor: 'var(--brand-bg)', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div className="animate-pulse-glow" style={{
            position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(50px)'
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '380px' }}>
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)',
              borderRadius: '100px', padding: '6px 16px', marginBottom: '1.5rem',
              fontSize: '0.8rem', color: '#2563eb', letterSpacing: '0.05em', fontWeight: 600
            }}>
              Admin Access
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', color: 'var(--brand-text)' }}>
              Assessment{' '}
              <span className="gradient-text">Dashboard</span>
            </h1>
            <p style={{ color: 'var(--brand-text-mid)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Sign in to view completed reports.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--brand-text-muted)', marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
                  borderRadius: '12px', color: 'var(--brand-text)', fontSize: '1rem',
                  outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = 'var(--brand-border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--brand-text-muted)', marginBottom: '8px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Admin password"
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
                  borderRadius: '12px', color: 'var(--brand-text)', fontSize: '1rem',
                  outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = 'var(--brand-border)'}
              />
            </div>
            {error && (
              <p style={{ color: '#dc2626', fontSize: '0.85rem', padding: '10px 14px', background: 'rgba(220,38,38,0.06)', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.15)', margin: 0 }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="gradient-btn"
              style={{
                fontSize: '1.05rem', fontWeight: 700, color: '#ffffff',
                padding: '1rem', borderRadius: '12px', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.25rem',
                opacity: loading ? 0.7 : 1, fontFamily: 'inherit'
              }}
            >
              {loading ? 'Loading...' : 'Sign In →'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main style={{
      backgroundColor: 'var(--brand-bg)', minHeight: '100vh', padding: '2rem 1.5rem',
      color: 'var(--brand-text)', fontFamily: 'inherit'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--brand-text)' }}>
              Assessment <span className="gradient-text">Dashboard</span>
            </h1>
            <p style={{ color: 'var(--brand-text-mid)', fontSize: '0.85rem', marginTop: '4px' }}>
              {users.length} completed report{users.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href="/" style={{ color: 'var(--brand-text-mid)', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Back to site
          </Link>
        </div>

        {/* Tab Bar */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--brand-border)', marginBottom: '1.5rem' }}>
          {(['reports', 'analytics'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              style={{
                padding: '12px 24px', background: 'none', border: 'none',
                borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                color: activeTab === tab ? 'var(--brand-text)' : 'var(--brand-text-mid)',
                fontWeight: activeTab === tab ? 700 : 500,
                fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s', textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                style={{
                  width: '100%', maxWidth: '400px', padding: '12px 16px',
                  background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
                  borderRadius: '12px', color: 'var(--brand-text)', fontSize: '0.95rem',
                  outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = 'var(--brand-border)'}
              />
            </div>

            <div style={{
              overflowX: 'auto', borderRadius: '14px',
              border: '1px solid var(--brand-border)',
              background: 'var(--brand-card)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--brand-border)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--brand-text-mid)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--brand-text-mid)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--brand-text-mid)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Archetype</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--brand-text-mid)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tier</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--brand-text-mid)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem 16px', textAlign: 'center', color: 'var(--brand-text-subtle)' }}>
                        {search ? 'No results found.' : 'No completed assessments yet.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map(u => (
                      <tr key={u.reportId} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--brand-text)' }}>{u.firstName}</div>
                          {u.headline && (
                            <div style={{ color: 'var(--brand-text-subtle)', fontSize: '0.78rem', marginTop: '2px', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {u.headline}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--brand-text-mid)', fontSize: '0.9rem' }}>
                          {u.email}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {u.primaryArchetype && (
                            <span style={{
                              display: 'inline-block', padding: '4px 10px',
                              background: 'rgba(37,99,235,0.08)', color: '#2563eb',
                              borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500,
                              border: '1px solid rgba(37,99,235,0.15)'
                            }}>
                              {u.primaryArchetype}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            display: 'inline-block', padding: '4px 10px',
                            background: u.tier === 'accelerator' ? 'rgba(6,182,212,0.08)' : u.reportType === 'paid' ? 'rgba(37,99,235,0.08)' : 'rgba(100,116,139,0.08)',
                            color: u.tier === 'accelerator' ? '#06b6d4' : u.reportType === 'paid' ? '#2563eb' : 'var(--brand-text-mid)',
                            borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500,
                            border: u.tier === 'accelerator' ? '1px solid rgba(6,182,212,0.2)' : u.reportType === 'paid' ? '1px solid rgba(37,99,235,0.15)' : '1px solid rgba(100,116,139,0.15)'
                          }}>
                            {u.tier === 'accelerator' ? 'Accelerator' : u.reportType === 'paid' ? 'Paid' : 'Free'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--brand-text-mid)', fontSize: '0.85rem' }}>
                          {new Date(u.completedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {u.tier === 'accelerator' && (
                            <a
                              href={'/portal?preview_user=' + u.userId}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-block', padding: '8px 16px',
                                color: '#06b6d4', borderRadius: '8px',
                                fontSize: '0.85rem', fontWeight: 600,
                                textDecoration: 'none', whiteSpace: 'nowrap',
                                marginRight: '8px',
                                background: 'rgba(6,182,212,0.08)',
                                border: '1px solid rgba(6,182,212,0.2)',
                              }}
                            >
                              View Portal
                            </a>
                          )}
                          <a
                            href={'/report/' + u.reportId + '?unlocked=1'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gradient-btn"
                            style={{
                              display: 'inline-block', padding: '8px 16px',
                              color: '#ffffff', borderRadius: '8px',
                              fontSize: '0.85rem', fontWeight: 600,
                              textDecoration: 'none', whiteSpace: 'nowrap'
                            }}
                          >
                            View Report
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            {analyticsLoading && (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--brand-text-mid)' }}>
                Loading analytics...
              </div>
            )}

            {analyticsError && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p style={{ color: '#dc2626', fontSize: '0.9rem' }}>{analyticsError}</p>
                <button
                  onClick={() => { setAnalyticsFetched(false); fetchAnalytics() }}
                  style={{
                    marginTop: '1rem', padding: '8px 20px', background: 'var(--brand-card)',
                    border: '1px solid var(--brand-border)', borderRadius: '8px',
                    color: 'var(--brand-text)', cursor: 'pointer', fontFamily: 'inherit'
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {analytics && !analyticsLoading && (
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
                    value={analytics.funnel.completedReports > 0 ? `${analytics.funnel.conversionRate}%` : '\u2014'}
                    sub={analytics.funnel.completedReports > 0 ? `${analytics.funnel.paidReports} paid of ${analytics.funnel.completedReports}` : 'No completed reports yet'}
                    color={analytics.funnel.completedReports > 0 ? rateColor(analytics.funnel.conversionRate) : undefined}
                  />
                  <StatCard
                    label="Call Bookings"
                    value="\u2014"
                    sub="Coming soon"
                  />
                </div>

                {/* Drop-off by Section */}
                <div style={{
                  background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
                  borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--brand-text)' }}>
                    Drop-off by Section
                  </h3>
                  {analytics.dropOffBySection.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {analytics.dropOffBySection.map(d => {
                        const maxCount = Math.max(...analytics.dropOffBySection.map(x => x.count), 1)
                        return (
                          <div key={d.section} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '140px', flexShrink: 0, fontSize: '0.82rem', color: 'var(--brand-text-mid)', textAlign: 'right' }}>
                              {d.section}
                            </div>
                            <div style={{ flex: 1, background: 'var(--brand-border)', borderRadius: '4px', height: '24px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${(d.count / maxCount) * 100}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
                                borderRadius: '4px',
                                minWidth: d.count > 0 ? '2px' : '0'
                              }} />
                            </div>
                            <div style={{ width: '30px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--brand-text)' }}>
                              {d.count}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--brand-text-mid)', fontSize: '0.9rem' }}>Not enough data yet</p>
                  )}
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
                      Users who signed up but haven&#39;t completed the assessment
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
                              No drop-offs &#8212; everyone completed!
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
                                {d.lastSection || '\u2014'}
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
          </div>
        )}
      </div>
    </main>
  )
}
