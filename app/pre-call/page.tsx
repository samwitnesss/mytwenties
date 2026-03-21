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
      padding: '3rem 1.5rem', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '20%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '15%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(50px)'
        }} />
      </div>

      <div style={{ maxWidth: '580px', width: '100%', position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4.5vw, 2rem)', fontWeight: 800,
            color: 'var(--brand-text)', lineHeight: 1.3, marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}>
            Your call is not confirmed yet.{firstName ? ` ${firstName}, complete` : ' Complete'} these two steps to confirm it.
          </h1>
        </div>

        {/* Step 1 */}
        <div style={{
          background: 'var(--brand-card)',
          border: '1px solid rgba(37,99,235,0.15)',
          borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(37,99,235,0.08), 0 1px 3px rgba(0,0,0,0.04)'
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: '2rem', right: '2rem', height: '2px',
            background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
            borderRadius: '0 0 2px 2px'
          }} />

          {hasReport && (
            <div style={{
              position: 'absolute', top: '1.25rem', right: '1.25rem',
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(34,197,94,0.35)'
            }}>
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1rem'
          }}>
            <span style={{
              width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
              background: hasReport
                ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(22,163,74,0.08))'
                : 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(6,182,212,0.08))',
              border: hasReport ? '1.5px solid rgba(34,197,94,0.3)' : '1.5px solid rgba(37,99,235,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 800,
              color: hasReport ? '#16a34a' : '#2563eb'
            }}>1</span>
            <h2 style={{
              fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-text)', margin: 0
            }}>
              Take the MyTwenties Assessment
            </h2>
          </div>

          <p style={{
            fontSize: '0.92rem', color: 'var(--brand-text-mid)', lineHeight: 1.7,
            marginBottom: hasReport ? '0' : '1.5rem', paddingLeft: '50px'
          }}>
            In 25 minutes you&apos;ll have more clarity on your situation than school ever gave you. We&apos;ll both have a crystal-clear picture of where you are and where you should be heading, so we can make the absolute most of our time together.
          </p>

          {hasReport ? (
            <p style={{
              fontSize: '0.9rem', color: '#16a34a', fontWeight: 600,
              paddingLeft: '50px', margin: 0
            }}>
              Completed
            </p>
          ) : (
            <div style={{ paddingLeft: '50px' }}>
              <Link href="/start">
                <button style={{
                  background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                  color: '#fff', border: 'none', borderRadius: '100px',
                  padding: '0.85rem 2rem', fontSize: '0.95rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 6px 20px rgba(37,99,235,0.3)',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}>
                  Start the Assessment →
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div style={{
          background: 'var(--brand-card)',
          border: '1px solid rgba(6,182,212,0.15)',
          borderRadius: '20px', padding: '2rem', marginBottom: '2.5rem',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(6,182,212,0.08), 0 1px 3px rgba(0,0,0,0.04)'
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: '2rem', right: '2rem', height: '2px',
            background: 'linear-gradient(90deg, #06b6d4, #2563eb)',
            borderRadius: '0 0 2px 2px'
          }} />

          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1rem'
          }}>
            <span style={{
              width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(37,99,235,0.08))',
              border: '1.5px solid rgba(6,182,212,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 800, color: '#0891b2'
            }}>2</span>
            <h2 style={{
              fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-text)', margin: 0
            }}>
              Watch this before our call
            </h2>
          </div>

          <p style={{
            fontSize: '0.92rem', color: 'var(--brand-text-mid)', lineHeight: 1.7,
            marginBottom: '1.5rem', paddingLeft: '50px'
          }}>
            What to expect on our call, how the MyTwenties Accelerator works, and why this isn&apos;t like anything you&apos;ve done before. Watch this so you come in ready to move, not just listen.
          </p>

          {/* Video placeholder */}
          <div style={{ paddingLeft: '50px' }}>
            <div style={{
              width: '100%', aspectRatio: '16/9', borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(37,99,235,0.04), rgba(6,182,212,0.06))',
              border: '1px solid rgba(6,182,212,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(6,182,212,0.06)'
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
          textAlign: 'center', fontSize: '0.95rem', color: 'var(--brand-text-mid)',
          lineHeight: 1.7
        }}>
          Once you&apos;ve completed both steps, you&apos;re confirmed.<br />
          See you on the call :)
        </p>

      </div>
    </main>
  )
}
