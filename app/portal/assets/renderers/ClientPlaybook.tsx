'use client';

import { useState } from 'react';
import type { ClientPlaybookData } from '@/lib/accelerator-data';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2
        style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#64748b',
          margin: '0 0 10px',
        }}
      >
        {children}
      </h2>
      <hr style={{ border: 'none', borderTop: '1.5px solid #e2e8f0', margin: 0 }} />
    </div>
  );
}

function Pill({ children, color = '#2563eb', bg = '#eff6ff', border = '#bfdbfe' }: { children: React.ReactNode; color?: string; bg?: string; border?: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
        color,
        backgroundColor: bg,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px 22px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardLabel({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#64748b',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <span style={{ fontSize: '1rem' }}>{icon}</span> {children}
    </p>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '0.9rem', color: '#0f172a', margin: 0, lineHeight: 1.65, whiteSpace: 'pre-line' }}>
      {children}
    </p>
  );
}

function ExpandableChannel({ channel, index }: { channel: ClientPlaybookData['channels'][number]; index: number }) {
  const [open, setOpen] = useState(index === 0);

  const roleColors: Record<string, { color: string; bg: string; border: string }> = {
    'Discovery': { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    'Nurture': { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    'Conversion': { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
    'Discovery + Nurture': { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  };

  const rc = roleColors[channel.role] || roleColors['Discovery'];

  return (
    <div
      style={{
        border: '1.5px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '16px 20px',
          backgroundColor: open ? '#f8fafc' : '#ffffff',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background-color 0.15s ease',
        }}
      >
        <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{channel.channel}</span>
        <Pill color={rc.color} bg={rc.bg} border={rc.border}>{channel.role}</Pill>
        <span
          style={{
            fontSize: '0.85rem',
            color: '#94a3b8',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f1f5f9' }}>
          {/* Current Performance */}
          <div style={{ paddingTop: '16px', marginBottom: '16px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Current Performance
            </p>
            <BodyText>{channel.current_performance}</BodyText>
          </div>

          {/* Strategy */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Strategy
            </p>
            <BodyText>{channel.strategy}</BodyText>
          </div>

          {/* Content Pillars */}
          {channel.content_pillars.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Content Pillars
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {channel.content_pillars.map((cp, i) => (
                  <div
                    key={i}
                    style={{
                      borderLeft: '2px solid #2563eb',
                      paddingLeft: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{cp.pillar}</p>
                      <Pill color="#475569" bg="#f8fafc" border="#e2e8f0">{cp.frequency}</Pill>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 4px', lineHeight: 1.55 }}>{cp.description}</p>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>{cp.why_it_works}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KPIs */}
          {channel.kpis.length > 0 && (
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Key Metrics
              </p>
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                {channel.kpis.map((kpi, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px 16px',
                      borderBottom: i < channel.kpis.length - 1 ? '1px solid #f1f5f9' : 'none',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', margin: '0 0 2px' }}>{kpi.metric}</p>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{kpi.why_it_matters}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      {kpi.current && (
                        <Pill color="#475569" bg="#f8fafc" border="#e2e8f0">Now: {kpi.current}</Pill>
                      )}
                      <Pill color="#059669" bg="#ecfdf5" border="#a7f3d0">Target: {kpi.target_30_day}</Pill>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ClientPlaybook({ data }: { data: ClientPlaybookData }) {
  const pb = data;
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
  const dayLabels: Record<string, string> = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        maxWidth: '820px',
        margin: '0 auto',
        padding: 'clamp(24px, 5vw, 56px) clamp(20px, 5vw, 48px)',
        lineHeight: 1.6,
      }}
    >
      {/* ── Header ── */}
      <header style={{ marginBottom: '36px' }}>
        <p
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#06b6d4',
            marginBottom: '8px',
          }}
        >
          Client Acquisition Playbook
        </p>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            margin: '0 0 24px',
            lineHeight: 1.2,
          }}
        >
          How You Get Customers
        </h1>
        <hr style={{ border: 'none', borderTop: '1.5px solid #e2e8f0', margin: 0 }} />
      </header>

      {/* ── Overview ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Acquisition Overview</SectionHeading>

        <Card style={{ marginBottom: '16px' }}>
          <CardLabel icon="🎯">Primary Channel</CardLabel>
          <BodyText>{pb.acquisition_overview.primary_channel}</BodyText>
          {pb.acquisition_overview.secondary_channels.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {pb.acquisition_overview.secondary_channels.map((ch, i) => (
                <Pill key={i} color="#475569" bg="#f8fafc" border="#e2e8f0">{ch}</Pill>
              ))}
            </div>
          )}
        </Card>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          <Card>
            <CardLabel icon="📍">Current Funnel</CardLabel>
            <BodyText>{pb.acquisition_overview.current_funnel}</BodyText>
          </Card>
          <Card style={{ backgroundColor: '#f0f7ff', borderColor: '#bfdbfe' }}>
            <CardLabel icon="🚀">Target Funnel (30 Days)</CardLabel>
            <BodyText>{pb.acquisition_overview.target_funnel}</BodyText>
          </Card>
        </div>
      </section>

      {/* ── Channels ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Channels</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pb.channels.map((ch, i) => (
            <ExpandableChannel key={i} channel={ch} index={i} />
          ))}
        </div>
      </section>

      {/* ── Outreach Scripts ── */}
      {pb.outreach_scripts.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <SectionHeading>Scripts & Templates</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pb.outreach_scripts.map((script, i) => (
              <Card key={i}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {script.scenario}
                </p>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    marginBottom: '10px',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0, lineHeight: 1.7, fontStyle: 'italic', whiteSpace: 'pre-line' }}>
                    {script.script}
                  </p>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.55 }}>
                  <span style={{ fontWeight: 700 }}>Note:</span> {script.notes}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── Content-to-Customer Flywheel ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Content-to-Customer Flywheel</SectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          {[pb.content_to_customer_flywheel.step_1, pb.content_to_customer_flywheel.step_2, pb.content_to_customer_flywheel.step_3, pb.content_to_customer_flywheel.step_4].map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                {i + 1}
              </div>
              <Card style={{ flex: 1 }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{step.action}</p>
                <BodyText>{step.description}</BodyText>
              </Card>
            </div>
          ))}
        </div>

        <Card style={{ borderLeft: '3px solid #06b6d4', borderRadius: '0 12px 12px 0' }}>
          <CardLabel icon="🔄">How It Compounds</CardLabel>
          <BodyText>{pb.content_to_customer_flywheel.flywheel_note}</BodyText>
        </Card>
      </section>

      {/* ── Weekly Rhythm ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Weekly Acquisition Rhythm</SectionHeading>

        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
            <Pill>{pb.weekly_acquisition_rhythm.total_hours} / week</Pill>
          </div>
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            {days.map((day, i) => {
              const task = pb.weekly_acquisition_rhythm[day];
              return (
                <div
                  key={day}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '12px 16px',
                    borderBottom: i < 6 ? '1px solid #f1f5f9' : 'none',
                    backgroundColor: !task ? '#fafbfc' : '#ffffff',
                    opacity: !task ? 0.6 : 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#475569',
                      width: '36px',
                      flexShrink: 0,
                      paddingTop: '2px',
                    }}
                  >
                    {dayLabels[day]}
                  </span>
                  <p style={{ fontSize: '0.88rem', color: task ? '#0f172a' : '#94a3b8', margin: 0, lineHeight: 1.55 }}>
                    {task || 'Off'}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* ── 30-Day Targets ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>First 30-Day Targets</SectionHeading>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          {[
            { icon: '👥', label: 'Audience', value: pb.first_30_day_targets.followers_or_audience },
            { icon: '💬', label: 'Leads / Inquiries', value: pb.first_30_day_targets.leads_or_inquiries },
            { icon: '💰', label: 'Sales / Clients', value: pb.first_30_day_targets.sales_or_clients },
            { icon: '📈', label: 'Revenue', value: pb.first_30_day_targets.revenue },
          ].map((target, i) => (
            <Card key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', margin: '0 0 6px' }}>{target.icon}</p>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
                {target.label}
              </p>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', margin: 0, lineHeight: 1.5 }}>
                {target.value}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Personal Note ── */}
      <section>
        <div
          style={{
            background: 'linear-gradient(135deg, #1d4ed8, #0891b2)',
            borderRadius: '14px',
            padding: 'clamp(24px, 4vw, 36px) clamp(22px, 4vw, 36px)',
            color: '#ffffff',
            boxShadow: '0 4px 24px rgba(29,78,216,0.25)',
          }}
        >
          <p
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.65)',
              marginBottom: '12px',
            }}
          >
            💡 From Sam
          </p>
          <p
            style={{
              fontSize: 'clamp(0.88rem, 1.8vw, 0.95rem)',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.88)',
              margin: 0,
              whiteSpace: 'pre-line',
            }}
          >
            {pb.personal_note}
          </p>
        </div>
      </section>
    </div>
  );
}
