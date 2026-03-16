'use client'

import { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { PortalUserContext } from '@/app/portal/layout'
import { ASSET_CONFIG, AssetType } from '@/lib/accelerator-data'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface AssetEntry {
  type: AssetType
  title: string
  description: string
  icon: string
  weekUnlock: number
}

// ─────────────────────────────────────────────
// Asset Card
// ─────────────────────────────────────────────

function AssetCard({ asset, programWeek }: { asset: AssetEntry; programWeek: number }) {
  const unlocked = asset.weekUnlock <= programWeek

  return (
    <div style={{
      backgroundColor: unlocked ? '#ffffff' : '#f8fafc',
      border: unlocked ? '1.5px solid #bfdbfe' : '1.5px solid #e2e8f0',
      borderRadius: 16,
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      opacity: unlocked ? 1 : 0.7,
      position: 'relative',
      boxShadow: unlocked
        ? '0 4px 24px rgba(37,99,235,0.07), 0 1px 4px rgba(0,0,0,0.04)'
        : '0 1px 4px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.15s ease',
    }}>
      {/* Icon circle */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: unlocked
          ? 'linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)'
          : '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        flexShrink: 0,
      }}>
        {unlocked ? asset.icon : '🔒'}
      </div>

      {/* Title + badge row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <h3 style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 700,
          color: unlocked ? '#0f172a' : '#94a3b8',
          lineHeight: 1.3,
        }}>
          {asset.title}
        </h3>
        <span style={{
          flexShrink: 0,
          fontSize: 11,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 20,
          backgroundColor: unlocked ? '#dcfce7' : '#f1f5f9',
          color: unlocked ? '#16a34a' : '#94a3b8',
          whiteSpace: 'nowrap',
        }}>
          Week {asset.weekUnlock}
        </span>
      </div>

      {/* Description */}
      <p style={{
        margin: 0,
        fontSize: 13,
        color: unlocked ? '#475569' : '#94a3b8',
        lineHeight: 1.55,
        flexGrow: 1,
      }}>
        {asset.description}
      </p>

      {/* Action */}
      {unlocked ? (
        <Link href={`/portal/assets/${asset.type}`} style={{
          display: 'inline-block',
          marginTop: 4,
          padding: '9px 18px',
          background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
          color: '#ffffff',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 700,
          textDecoration: 'none',
          textAlign: 'center',
          letterSpacing: '0.01em',
          boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
        }}>
          Open
        </Link>
      ) : (
        <p style={{
          margin: 0,
          marginTop: 4,
          fontSize: 12,
          color: '#94a3b8',
          fontWeight: 600,
        }}>
          Coming Week {asset.weekUnlock}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Progress Bar
// ─────────────────────────────────────────────

function ProgramProgress({ week }: { week: number }) {
  const pct = Math.min(100, Math.round((week / 12) * 100))

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Program progress</span>
        <span style={{ fontSize: 13, color: '#2563eb', fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{
        height: 8,
        borderRadius: 99,
        backgroundColor: '#e2e8f0',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 99,
          background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
          transition: 'width 0.6s ease',
        }} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 6,
      }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>Week 1</span>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>Week 12</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Report Promo Banner
// ─────────────────────────────────────────────

function ReportBanner() {
  const [reportId, setReportId] = useState<string | null>(null)

  useEffect(() => {
    setReportId(localStorage.getItem('mt_report_id'))
  }, [])

  const href = reportId ? `/report/${reportId}` : '/login'

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0e4f6e 100%)',
      borderRadius: 20,
      padding: '28px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap',
      boxShadow: '0 8px 40px rgba(15,23,42,0.18)',
    }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 24 }}>📊</span>
          <h3 style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.01em',
          }}>
            Your MyTwenties Report
          </h3>
        </div>
        <p style={{
          margin: 0,
          fontSize: 14,
          color: '#94a3b8',
          lineHeight: 1.6,
          maxWidth: 480,
        }}>
          Your deep-profile assessment — archetypes, strengths, blind spots, and direction — all in one place. The full foundation your Accelerator work is built on.
        </p>
      </div>
      <Link href={href} style={{
        flexShrink: 0,
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
        color: '#ffffff',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 700,
        textDecoration: 'none',
        letterSpacing: '0.01em',
        boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
        whiteSpace: 'nowrap',
      }}>
        View Report →
      </Link>
    </div>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function PortalPage() {
  const user = useContext(PortalUserContext)

  // Layout handles loading; if user is null after load, show nothing meaningful
  if (!user) return null

  const { firstName, programWeek } = user

  const assets: AssetEntry[] = Object.entries(ASSET_CONFIG).map(([type, config]) => ({
    type: type as AssetType,
    title: config.title,
    description: config.description,
    icon: config.icon,
    weekUnlock: config.week_unlock,
  }))

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    }}>
      {/* Header bar */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <span style={{
          fontSize: 16,
          fontWeight: 800,
          background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
        }}>
          MyTwenties Accelerator
        </span>
      </header>

      {/* Main content */}
      <main style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '36px 24px 64px',
      }}>

        {/* Welcome section */}
        <section style={{ marginBottom: 36 }}>
          <h1 style={{
            margin: '0 0 6px',
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}>
            Your Program Assets, {firstName}
          </h1>
          <p style={{
            margin: '0 0 28px',
            fontSize: 16,
            color: '#64748b',
            fontWeight: 500,
          }}>
            Week {programWeek} of 12 · Accelerator Program
          </p>
          <ProgramProgress week={programWeek} />
        </section>

        {/* Asset grid */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            margin: '0 0 20px',
            fontSize: 14,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Program Assets
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {assets.map(asset => (
              <AssetCard key={asset.type} asset={asset} programWeek={programWeek} />
            ))}
          </div>
        </section>

        {/* Report promo */}
        <section>
          <h2 style={{
            margin: '0 0 20px',
            fontSize: 14,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Your Foundation
          </h2>
          <ReportBanner />
        </section>
      </main>
    </div>
  )
}
