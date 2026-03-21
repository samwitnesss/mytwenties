'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PreCallThirdPath() {
  const [hasReport, setHasReport] = useState(false)
  const [firstName, setFirstName] = useState<string | null>(null)

  useEffect(() => {
    const rid = localStorage.getItem('mt_report_id')
    const uid = localStorage.getItem('mt_user_id')
    const name = localStorage.getItem('mt_first_name')
    if (rid && uid) setHasReport(true)
    if (name) setFirstName(name)
  }, [])

  return (
    <main style={{
      backgroundColor: 'var(--brand-bg)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '3rem 1.5rem'
    }}>
      <div style={{ maxWidth: '560px', width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 800,
            color: 'var(--brand-text)', lineHeight: 1.3, marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            Your call is booked.{firstName ? ` Nice one, ${firstName}.` : ''}<br />
            Complete these two steps to confirm it.
          </h1>
          <p style={{
            fontSize: '0.95rem', color: 'var(--brand-text-mid)', lineHeight: 1.6
          }}>
            If these aren&apos;t done before our call, we&apos;ll need to reschedule.
          </p>
        </div>

        {/* Step 1 */}
        <div style={{
          background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
          borderRadius: '16px', padding: '1.75rem', marginBottom: '1.25rem',
          position: 'relative', overflow: 'hidden'
        }}>
          {hasReport && (
            <div style={{
              position: 'absolute', top: '1rem', right: '1rem',
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(34,197,94,0.3)'
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem'
          }}>
            <span style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: hasReport ? 'rgba(34,197,94,0.1)' : 'rgba(37,99,235,0.08)',
              border: hasReport ? '1.5px solid rgba(34,197,94,0.25)' : '1.5px solid rgba(37,99,235,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700,
              color: hasReport ? '#16a34a' : '#2563eb'
            }}>1</span>
            <h2 style={{
              fontSize: '1.15rem', fontWeight: 700, color: 'var(--brand-text)', margin: 0
            }}>
              Take the MyTwenties Assessment
            </h2>
          </div>

          <p style={{
            fontSize: '0.9rem', color: 'var(--brand-text-mid)', lineHeight: 1.65,
            marginBottom: hasReport ? '0' : '1.25rem', paddingLeft: '44px'
          }}>
            25 minutes. This gives us both a clear picture of your situation so we can make the most of our time together.
          </p>

          {hasReport ? (
            <p style={{
              fontSize: '0.85rem', color: '#16a34a', fontWeight: 600,
              paddingLeft: '44px', margin: 0
            }}>
              Completed
            </p>
          ) : (
            <div style={{ paddingLeft: '44px' }}>
              <Link href="/start">
                <button style={{
                  background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                  color: '#fff', border: 'none', borderRadius: '100px',
                  padding: '0.75rem 1.75rem', fontSize: '0.9rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 4px 16px rgba(37,99,235,0.25)'
                }}>
                  Start the Assessment →
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div style={{
          background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
          borderRadius: '16px', padding: '1.75rem', marginBottom: '2.5rem'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem'
          }}>
            <span style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: 'rgba(37,99,235,0.08)', border: '1.5px solid rgba(37,99,235,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: '#2563eb'
            }}>2</span>
            <h2 style={{
              fontSize: '1.15rem', fontWeight: 700, color: 'var(--brand-text)', margin: 0
            }}>
              Watch this before our call
            </h2>
          </div>

          <p style={{
            fontSize: '0.9rem', color: 'var(--brand-text-mid)', lineHeight: 1.65,
            marginBottom: '1.25rem', paddingLeft: '44px'
          }}>
            3 minutes. What to expect and how to get the most out of our conversation.
          </p>

          {/* Video placeholder — replace src when ready */}
          <div style={{
            paddingLeft: '44px'
          }}>
            <div style={{
              width: '100%', aspectRatio: '16/9', borderRadius: '12px',
              background: 'var(--brand-bg-subtle)', border: '1px solid var(--brand-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* Replace this div with an iframe or video element when the URL is ready */}
              <p style={{
                fontSize: '0.85rem', color: 'var(--brand-text-subtle)', fontWeight: 500
              }}>
                Video coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p style={{
          textAlign: 'center', fontSize: '0.9rem', color: 'var(--brand-text-mid)',
          lineHeight: 1.6
        }}>
          Once you&apos;ve completed both steps, you&apos;re confirmed.<br />
          See you on the call.
        </p>

      </div>
    </main>
  )
}
