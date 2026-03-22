'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const AnalyticsPanel = dynamic(() => import('@/components/admin/AnalyticsPanel'), { ssr: false })

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

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState<UserReport[]>([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'reports' | 'analytics'>('reports')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analytics, setAnalytics] = useState<any>(null)
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

  const fetchAnalytics = useCallback(async (date?: string | null) => {
    setAnalyticsLoading(true)
    setAnalyticsError('')
    try {
      const body: Record<string, string> = { email: authEmail, password: authPassword }
      if (date) body.date = date
      const res = await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) {
        setAnalyticsError(data.error || 'Failed to load analytics.')
      } else {
        setAnalytics(data)
        setAnalyticsFetched(true)
      }
    } catch {
      setAnalyticsError('Something went wrong loading analytics.')
    }
    setAnalyticsLoading(false)
  }, [authEmail, authPassword])

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
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
        <div style={{ display: 'flex', borderBottom: '1px solid var(--brand-border)', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              padding: '12px 24px', background: 'none', border: 'none',
              borderBottom: activeTab === 'reports' ? '2px solid #2563eb' : '2px solid transparent',
              color: activeTab === 'reports' ? 'var(--brand-text)' : 'var(--brand-text-mid)',
              fontWeight: activeTab === 'reports' ? 700 : 500,
              fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '12px 24px', background: 'none', border: 'none',
              borderBottom: activeTab === 'analytics' ? '2px solid #2563eb' : '2px solid transparent',
              color: activeTab === 'analytics' ? 'var(--brand-text)' : 'var(--brand-text-mid)',
              fontWeight: activeTab === 'analytics' ? 700 : 500,
              fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'analytics' && (
          <div>
            {!analyticsFetched && !analyticsLoading && !analyticsError && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <button
                  onClick={() => fetchAnalytics()}
                  className="gradient-btn"
                  style={{ padding: '12px 28px', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Load Analytics
                </button>
              </div>
            )}

            {!analytics && analyticsLoading && (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--brand-text-mid)' }}>Loading analytics...</div>
            )}

            {analyticsError && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p style={{ color: '#dc2626', fontSize: '0.9rem' }}>{analyticsError}</p>
                <button onClick={() => { setAnalyticsError(''); fetchAnalytics() }} style={{ marginTop: '1rem', padding: '8px 20px', background: 'var(--brand-card)', border: '1px solid var(--brand-border)', borderRadius: '8px', color: 'var(--brand-text)', cursor: 'pointer', fontFamily: 'inherit' }}>Retry</button>
              </div>
            )}

            {analytics && (
              <AnalyticsPanel
                analytics={{
                  funnel: {
                    totalUsers: analytics.funnel?.totalUsers ?? 0,
                    completedReports: analytics.funnel?.usersWithReport ?? 0,
                    paidReports: analytics.funnel?.paidReports ?? 0,
                    completionRate: analytics.funnel?.completionRate ?? 0,
                    conversionRate: analytics.funnel?.conversionRate ?? 0,
                    totalRevenue: analytics.funnel?.totalRevenue ?? 0,
                    daysActive: analytics.funnel?.daysActive ?? 1,
                  },
                  dropOffBySection: (analytics.dropOff ?? []).map((d: { section: string; count: number }) => ({ section: d.section, count: d.count })),
                  totalDropped: analytics.totalDropped ?? 0,
                  signupsOverTime: analytics.signupsOverTime ?? [],
                  recentDropOffs: (analytics.recentDropOffs ?? []).map((d: { firstName: string; email: string; questionsAnswered: number; lastSection: string; signedUp: string }) => ({
                    firstName: d.firstName,
                    email: d.email,
                    questionsAnswered: d.questionsAnswered,
                    lastSection: d.lastSection,
                    createdAt: d.signedUp,
                  })),
                  dailyTracker: analytics.dailyTracker ?? [],
                  archetypes: analytics.archetypes ?? [],
                  directions: analytics.directions ?? [],
                  daily: analytics.daily ?? undefined,
                }}
                onDateChange={(date) => fetchAnalytics(date)}
              />
            )}
          </div>
        )}

        {activeTab === 'reports' && (<>
        {/* Search */}
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

        {/* Table */}
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
        </>)}
      </div>
    </main>
  )
}
