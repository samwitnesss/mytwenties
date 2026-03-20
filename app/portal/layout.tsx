'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { LayoutDashboard, FileText, Settings } from 'lucide-react'
import type { PortalUser } from '@/lib/accelerator-data'

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

export const PortalUserContext = createContext<PortalUser | null>(null)

export function usePortalUser() {
  return useContext(PortalUserContext)
}

// ─────────────────────────────────────────────
// Nav items
// ─────────────────────────────────────────────

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

function useNavItems(): NavItem[] {
  const [reportId, setReportId] = useState<string | null>(null)

  useEffect(() => {
    setReportId(localStorage.getItem('mt_report_id'))
  }, [])

  return [
    {
      label: 'Dashboard',
      href: '/portal',
      icon: <LayoutDashboard size={16} />,
    },
    {
      label: 'My Report',
      href: reportId ? `/report/${reportId}` : '/',
      icon: <FileText size={16} />,
    },
    {
      label: 'Settings',
      href: '/portal/settings',
      icon: <Settings size={16} />,
    },
  ]
}

// ─────────────────────────────────────────────
// Sidebar nav item
// ─────────────────────────────────────────────

function SidebarNavItem({
  item,
  isActive,
  onClick,
}: {
  item: NavItem
  isActive: boolean
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={item.href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 12px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? '#2563eb' : hovered ? '#0f172a' : '#475569',
        background: isActive
          ? 'rgba(37,99,235,0.08)'
          : hovered
          ? 'rgba(15,23,42,0.04)'
          : 'transparent',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          color: isActive ? '#2563eb' : hovered ? '#334155' : '#94a3b8',
          transition: 'color 0.15s ease',
          flexShrink: 0,
        }}
      >
        {item.icon}
      </span>
      {item.label}
    </a>
  )
}

// ─────────────────────────────────────────────
// Sidebar content (shared between desktop + mobile overlay)
// ─────────────────────────────────────────────

function SidebarContent({
  user,
  onNavClick,
}: {
  user: PortalUser | null
  onNavClick?: () => void
}) {
  const pathname = usePathname()
  const navItems = useNavItems()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '24px 16px',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '32px', paddingLeft: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span
            className="gradient-text"
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
            }}
          >
            MyTwenties
          </span>
          <span
            style={{
              fontSize: '0.58rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              background: 'rgba(37,99,235,0.1)',
              color: '#2563eb',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(37,99,235,0.18)',
              whiteSpace: 'nowrap' as const,
            }}
          >
            Accelerator
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive =
            item.href === '/portal'
              ? pathname === '/portal'
              : pathname.startsWith(item.href)
          return (
            <SidebarNavItem
              key={item.href}
              item={item}
              isActive={isActive}
              onClick={onNavClick}
            />
          )
        })}
      </nav>

      {/* User footer */}
      {user && (
        <div
          style={{
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '4px',
            }}
          >
            {user.firstName}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              marginBottom: '10px',
            }}
          >
            Week {user.programWeek} of 12
          </div>
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
              color: '#ffffff',
              padding: '3px 8px',
              borderRadius: '4px',
              display: 'inline-block',
            }}
          >
            Accelerator
          </span>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Spinner
// ─────────────────────────────────────────────

function Spinner() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#ffffff',
      }}
    >
      <style>{`
        @keyframes portal-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '3px solid #e2e8f0',
          borderTopColor: '#2563eb',
          animation: 'portal-spin 0.75s linear infinite',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// Access required
// ─────────────────────────────────────────────

function AccessRequired() {
  const [reportId, setReportId] = useState<string | null>(null)

  useEffect(() => {
    setReportId(localStorage.getItem('mt_report_id'))
  }, [])

  const assets = [
    { icon: '\u{1F5FA}\uFE0F', name: '30-Day High-Leverage Plan', desc: 'Your first move, sequenced and prioritised.', weeks: 'Weeks 1\u20132' },
    { icon: '\u{1F4CB}', name: 'Your Business Plan', desc: 'A real plan built around your wiring, not a template.', weeks: 'Weeks 3\u20134' },
    { icon: '\u{1F4B0}', name: 'Offer & Pricing Strategy', desc: 'What to sell, what to charge, and why it works for you.', weeks: 'Weeks 3\u20134' },
    { icon: '\u{1F3AF}', name: 'Client Acquisition Playbook', desc: 'How to get your first paying clients without guessing.', weeks: 'Weeks 5\u20136' },
    { icon: '\u2728', name: 'Personal Brand Blueprint', desc: 'How to show up online in a way that attracts the right people.', weeks: 'Weeks 7\u20138' },
    { icon: '\u{1F5C2}\uFE0F', name: 'Portfolio Builder', desc: "Turn what you've done into proof that you're the right choice.", weeks: 'Weeks 7\u20138' },
    { icon: '\u{1F4CA}', name: 'Session Notes', desc: 'Key moments, reframes, and next steps from your coaching sessions.', weeks: 'Weeks 1\u201312' },
    { icon: '\u{1F4C5}', name: '90-Day Strategic Plan', desc: 'Your next quarter mapped out with clear priorities.', weeks: 'Weeks 11\u201312' },
    { icon: '\u{1F4C8}', name: 'Growth Roadmap', desc: 'The long-game plan \u2014 where you go after the 12 weeks.', weeks: 'Weeks 11\u201312' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '1rem', fontWeight: 800 }}>
          <span className="gradient-text">MyTwenties</span>{' '}
          <span style={{ color: '#64748b', fontWeight: 500 }}>Accelerator</span>
        </span>
        <a href={reportId ? `/report/${reportId}` : '/'} style={{ fontSize: '0.85rem', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>
          \u2190 Back to report
        </a>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)',
            borderRadius: '100px', padding: '5px 14px', marginBottom: '20px',
            fontSize: '0.7rem', color: '#2563eb', letterSpacing: '0.06em', textTransform: 'uppercase' as const, fontWeight: 700
          }}>
            The MyTwenties Accelerator
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '12px', lineHeight: 1.15 }}>
            12 weeks. 6 calls with Sam.<br />Every asset built from your situation.
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}>
            The Accelerator gives you a personal portal with every deliverable built live on a call \u2014 not a course you watch and forget.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px', marginBottom: '48px' }}>
          {assets.map(({ icon, name, desc, weeks }) => (
            <div key={name} style={{
              background: '#ffffff', borderRadius: '16px', padding: '20px',
              border: '1px solid #e2e8f0', opacity: 0.6, position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '14px', right: '14px', fontSize: '0.7rem', color: '#94a3b8' }}>🔒</div>
              <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{icon}</div>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px', paddingRight: '1rem' }}>{name}</p>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.55, marginBottom: '10px' }}>{desc}</p>
              <span style={{
                display: 'inline-block', fontSize: '0.65rem', fontWeight: 700, color: '#2563eb',
                background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)',
                borderRadius: '100px', padding: '2px 10px', letterSpacing: '0.04em'
              }}>{weeks}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Book a free Strategy Call with Sam
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 24px' }}>
            Every deliverable is built live, on a call, from your specific situation.
          </p>
        </div>
        <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <iframe
            src="https://api.leadconnectorhq.com/widget/booking/ibvCFYwaWf95LNjupgii"
            style={{ width: '100%', height: '700px', border: 'none', display: 'block' }}
            scrolling="yes"
            title="Book a Free Strategy Call with Sam"
          />
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '12px' }}>
          Free 30-minute call with Sam
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Hamburger button
// ─────────────────────────────────────────────

function HamburgerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open navigation"
      style={{
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        gap: '5px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '6px',
        borderRadius: '6px',
        flexShrink: 0,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: 'block',
            width: '20px',
            height: '2px',
            background: '#334155',
            borderRadius: '2px',
          }}
        />
      ))}
    </button>
  )
}

// ─────────────────────────────────────────────
// Portal layout
// ─────────────────────────────────────────────

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<PortalUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adminPreview, setAdminPreview] = useState(false)

  useEffect(() => {
    const previewUserId = searchParams.get('preview_user')
    const userId = previewUserId || localStorage.getItem('mt_user_id')

    if (previewUserId) setAdminPreview(true)

    if (!userId) {
      router.replace('/')
      return
    }

    fetch(`/api/portal/me?userId=${userId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || data.error) {
          router.replace('/')
          return
        }

        if (data.tier !== 'accelerator') {
          setAccessDenied(true)
          setLoading(false)
          return
        }

        setUser({
          id: data.id,
          firstName: data.firstName,
          tier: data.tier,
          programWeek: data.programWeek,
          programStartDate: data.programStartDate,
        })
        setLoading(false)
      })
      .catch(() => {
        router.replace('/')
      })
  }, [router])

  if (loading) return <Spinner />
  if (accessDenied) return <AccessRequired />

  return (
    <PortalUserContext.Provider value={user}>
      {adminPreview && (
        <div style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
          color: '#ffffff', textAlign: 'center',
          padding: '8px 16px', fontSize: '0.8rem', fontWeight: 600,
          letterSpacing: '0.02em',
        }}>
          Admin Preview — Viewing {user?.firstName}&apos;s Portal
          <a href="/admin" style={{ color: '#ffffff', marginLeft: '16px', textDecoration: 'underline', fontWeight: 700 }}>
            ← Back to Admin
          </a>
        </div>
      )}
      <style>{`
        @media (min-width: 768px) {
          .portal-mobile-sidebar { display: none !important; }
          .portal-mobile-backdrop { display: none !important; }
          .portal-mobile-header { display: none !important; }
          .portal-desktop-sidebar { display: flex !important; }
          .portal-main { margin-left: 220px !important; }
          .portal-topbar { display: flex !important; }
        }
        @media (max-width: 767px) {
          .portal-desktop-sidebar { display: none !important; }
          .portal-topbar { display: none !important; }
        }
      `}</style>

      {/* Mobile backdrop */}
      <div
        className="portal-mobile-backdrop"
        onClick={() => setMobileOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(15,23,42,0.45)',
          backdropFilter: 'blur(2px)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Mobile slide-in sidebar */}
      <div
        className="portal-mobile-sidebar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '260px',
          zIndex: 50,
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '4px 0 24px rgba(0,0,0,0.10)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <SidebarContent user={user} onNavClick={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <div
        className="portal-desktop-sidebar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '220px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          zIndex: 30,
          flexDirection: 'column',
          display: 'none', // overridden to flex by media query
        }}
      >
        <SidebarContent user={user} />
      </div>

      {/* Mobile sticky header */}
      <div
        className="portal-mobile-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '0 20px',
          height: '56px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        }}
      >
        <HamburgerButton onClick={() => setMobileOpen(true)} />
        <span
          style={{
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.02em',
          }}
        >
          <span className="gradient-text">MyTwenties</span>
          {' '}
          <span style={{ color: '#64748b', fontWeight: 500 }}>Accelerator</span>
        </span>
      </div>

      {/* Main content */}
      <div
        className="portal-main"
        style={{
          minHeight: '100vh',
          background: '#f8faff',
          marginLeft: 0,
        }}
      >
        {/* Desktop top bar */}
        <div
          className="portal-topbar"
          style={{
            display: 'none', // overridden to flex by media query
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 32px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '0.8125rem',
                color: '#64748b',
                margin: '0 0 2px',
              }}
            >
              Welcome back
            </p>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              {user?.firstName ? `Hey, ${user.firstName}` : 'Your portal'}
            </h1>
          </div>
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 16px',
                borderRadius: '10px',
                background: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.14)',
              }}
            >
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#2563eb',
                }}
              >
                Week {user.programWeek} of 12
              </span>
            </div>
          )}
        </div>

        {/* Page content */}
        {children}
      </div>
    </PortalUserContext.Provider>
  )
}
