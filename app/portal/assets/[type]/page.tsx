'use client'

import { useParams } from 'next/navigation'
import { Suspense, useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { PortalUserContext } from '@/app/portal/layout'
import { ASSET_CONFIG, AssetType, SessionNotesData, RoadmapData, BrandBlueprintData, ClientPlaybookData } from '@/lib/accelerator-data'
import SessionNotesRenderer from '@/app/portal/assets/renderers/SessionNotes'
import RoadmapRenderer from '@/app/portal/assets/renderers/Roadmap'
import BrandBlueprintRenderer from '@/app/portal/assets/renderers/BrandBlueprint'
import ClientPlaybookRenderer from '@/app/portal/assets/renderers/ClientPlaybook'

// ─────────────────────────────────────────────
// Back link
// ─────────────────────────────────────────────

function BackLink({ previewUserId }: { previewUserId?: string | null }) {
  const href = previewUserId ? `/portal?preview_user=${previewUserId}` : '/portal'
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: '#475569',
        textDecoration: 'none',
        padding: '6px 0',
        transition: 'color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLAnchorElement).style.color = '#0f172a'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLAnchorElement).style.color = '#475569'
      }}
    >
      ← Back to Dashboard
    </Link>
  )
}

// ─────────────────────────────────────────────
// Page top bar
// ─────────────────────────────────────────────

function PageTopBar({ icon, title, description, previewUserId }: { icon: string; title: string; description: string; previewUserId?: string | null }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '20px 32px',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: '16px' }}>
          <BackLink previewUserId={previewUserId} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)',
              border: '1.5px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.625rem',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '1.375rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '0.875rem',
                color: '#64748b',
                lineHeight: 1.5,
              }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Loading state
// ─────────────────────────────────────────────

function LoadingState() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        @keyframes asset-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '3px solid #e2e8f0',
          borderTopColor: '#2563eb',
          animation: 'asset-spin 0.75s linear infinite',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// Coming Soon state
// ─────────────────────────────────────────────

function ComingSoon({ icon, title, weekUnlock }: { icon: string; title: string; weekUnlock: number }) {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '20px',
          padding: '48px 40px',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)',
            border: '1.5px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.25rem',
            margin: '0 auto 24px',
          }}
        >
          {icon}
        </div>

        <h2
          style={{
            margin: '0 0 10px',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
          }}
        >
          This asset is being built for you
        </h2>

        <p
          style={{
            margin: '0 0 8px',
            fontSize: '0.9375rem',
            color: '#475569',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: '#0f172a' }}>{title}</strong> will be ready in{' '}
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.8125rem',
              fontWeight: 700,
              padding: '1px 8px',
              borderRadius: '20px',
              backgroundColor: 'rgba(37,99,235,0.08)',
              color: '#2563eb',
            }}
          >
            Week {weekUnlock}
          </span>
        </p>

        <p
          style={{
            margin: '0 0 32px',
            fontSize: '0.875rem',
            color: '#94a3b8',
            lineHeight: 1.6,
          }}
        >
          Your coach is preparing this deliverable. You&apos;ll see it here as soon as it&apos;s ready.
        </p>

        <Link
          href="/portal"
          style={{
            display: 'inline-block',
            padding: '11px 28px',
            background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '0.9375rem',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.01em',
            boxShadow: '0 2px 10px rgba(37,99,235,0.28)',
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Invalid type state
// ─────────────────────────────────────────────

function NotFound() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '360px' }}>
        <div
          style={{
            fontSize: '3rem',
            marginBottom: '16px',
          }}
        >
          🔍
        </div>
        <h2
          style={{
            margin: '0 0 10px',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
          }}
        >
          Asset not found
        </h2>
        <p
          style={{
            margin: '0 0 28px',
            fontSize: '0.9375rem',
            color: '#475569',
            lineHeight: 1.6,
          }}
        >
          This asset type doesn&apos;t exist. Head back to the dashboard to see your available assets.
        </p>
        <Link
          href="/portal"
          style={{
            display: 'inline-block',
            padding: '11px 28px',
            background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '0.9375rem',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.01em',
            boxShadow: '0 2px 10px rgba(37,99,235,0.28)',
          }}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function AssetPage() {
  return (
    <Suspense>
      <AssetPageInner />
    </Suspense>
  )
}

function AssetPageInner() {
  const params = useParams()
  const user = useContext(PortalUserContext)
  const type = params?.type as AssetType

  const [loading, setLoading] = useState(true)
  const [assetContent, setAssetContent] = useState<unknown>(null)

  // Validate type against known asset types
  const config = type ? ASSET_CONFIG[type] : null

  // Use previewUserId from context (set once in layout), fall back to localStorage
  const resolvedUserId = user?.previewUserId || user?.id || null

  // Reset state when asset type changes
  useEffect(() => {
    setLoading(true)
    setAssetContent(null)
  }, [type])

  useEffect(() => {
    if (!config) {
      setLoading(false)
      return
    }

    const userId = resolvedUserId || localStorage.getItem('mt_user_id')
    if (!userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/portal/assets/${type}?userId=${userId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setAssetContent(data?.content ?? null)
        setLoading(false)
      })
      .catch(() => {
        setAssetContent(null)
        setLoading(false)
      })
  }, [type, config, resolvedUserId])

  if (!config) {
    return <NotFound />
  }

  const { title, description, icon, week_unlock } = config

  const renderContent = () => {
    if (loading) {
      return <LoadingState />
    }

    if (!assetContent) {
      return <ComingSoon icon={icon} title={title} weekUnlock={week_unlock} />
    }

    if (type === 'session_notes') {
      return <SessionNotesRenderer data={assetContent as SessionNotesData} />
    }

    if (type === 'roadmap') {
      return <RoadmapRenderer data={assetContent as RoadmapData} />
    }

    if (type === 'brand_blueprint') {
      return <BrandBlueprintRenderer data={assetContent as BrandBlueprintData} />
    }

    if (type === 'client_playbook') {
      return <ClientPlaybookRenderer data={assetContent as ClientPlaybookData} />
    }

    // Other asset types — coming soon until renderers are built
    return <ComingSoon icon={icon} title={title} weekUnlock={week_unlock} />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      }}
    >
      <PageTopBar icon={icon} title={title} description={description} previewUserId={user?.previewUserId} />

      <main
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '32px 24px 64px',
        }}
      >
        {renderContent()}
      </main>
    </div>
  )
}
