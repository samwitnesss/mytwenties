'use client';

import { useState } from 'react';
import type { BusinessPlanData } from '@/lib/accelerator-data';

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

function ExpandableSection({ title, icon, children, defaultOpen = false }: { title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
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
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{title}</span>
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
          {children}
        </div>
      )}
    </div>
  );
}

const likelihoodColor: Record<string, { color: string; bg: string; border: string }> = {
  High: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  Medium: { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  Low: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
};

export default function BusinessPlan({ data }: { data: BusinessPlanData }) {
  const bp = data;

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
          Business Plan
        </p>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            margin: '0 0 10px',
            lineHeight: 1.2,
          }}
        >
          {bp.business_overview.business_name}
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#475569', margin: '0 0 16px', fontStyle: 'italic', lineHeight: 1.5 }}>
          {bp.business_overview.one_liner}
        </p>
        <Pill color="#475569" bg="#f8fafc" border="#e2e8f0">
          Stage: {bp.business_overview.stage}
        </Pill>
        <hr style={{ border: 'none', borderTop: '1.5px solid #e2e8f0', margin: '24px 0 0' }} />
      </header>

      {/* ── Business Model ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Business Model</SectionHeading>
        <Card>
          <BodyText>{bp.business_overview.business_model}</BodyText>
        </Card>
      </section>

      {/* ── What Makes This Different ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>What Makes This Different</SectionHeading>
        <Card style={{ borderLeft: '3px solid #2563eb', borderRadius: '0 12px 12px 0' }}>
          <BodyText>{bp.business_overview.what_makes_this_different}</BodyText>
        </Card>
      </section>

      {/* ── Target Customer ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Target Customer</SectionHeading>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <Card>
            <CardLabel icon="👥">Who They Are</CardLabel>
            <BodyText>{bp.target_customer.who}</BodyText>
          </Card>
          <Card>
            <CardLabel icon="📍">Where They Hang Out</CardLabel>
            <BodyText>{bp.target_customer.where_they_hang_out}</BodyText>
          </Card>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          <Card>
            <CardLabel icon="💡">What They Want</CardLabel>
            <BodyText>{bp.target_customer.what_they_want}</BodyText>
          </Card>
          <Card style={{ backgroundColor: '#f0f7ff', borderColor: '#bfdbfe' }}>
            <CardLabel icon="🎯">Why You</CardLabel>
            <BodyText>{bp.target_customer.why_this_member}</BodyText>
          </Card>
        </div>
      </section>

      {/* ── Revenue Model ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Revenue Model</SectionHeading>

        {/* Revenue Streams */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {bp.revenue_model.revenue_streams.map((rs, i) => (
            <ExpandableSection key={i} title={rs.stream} icon="💰" defaultOpen={i === 0}>
              <div style={{ paddingTop: '16px' }}>
                <BodyText>{rs.description}</BodyText>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
                  <Pill>Avg: {rs.average_price}</Pill>
                  <Pill color="#475569" bg="#f8fafc" border="#e2e8f0">{rs.monthly_revenue_potential}/mo potential</Pill>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '12px', lineHeight: 1.55 }}>
                  <strong style={{ color: '#475569' }}>Volume:</strong> {rs.estimated_volume}
                </p>
              </div>
            </ExpandableSection>
          ))}
        </div>

        {/* Monthly Target */}
        <Card style={{ marginBottom: '16px', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <CardLabel icon="🎯">Monthly Revenue Target</CardLabel>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#15803d', margin: 0 }}>
            {bp.revenue_model.total_monthly_target}
          </p>
        </Card>

        {/* Cost Structure */}
        <Card style={{ marginBottom: '16px' }}>
          <CardLabel icon="📉">Cost Structure</CardLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Fixed Costs
              </p>
              <BodyText>{bp.revenue_model.cost_structure.fixed_costs}</BodyText>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Variable Costs
              </p>
              <BodyText>{bp.revenue_model.cost_structure.variable_costs}</BodyText>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
              <Pill color="#d97706" bg="#fffbeb" border="#fde68a">
                Monthly: {bp.revenue_model.cost_structure.estimated_monthly_expenses}
              </Pill>
              <Pill color="#16a34a" bg="#f0fdf4" border="#bbf7d0">
                Break-even: {bp.revenue_model.cost_structure.break_even}
              </Pill>
            </div>
          </div>
        </Card>

        {/* Pricing Rationale */}
        <Card style={{ borderLeft: '3px solid #06b6d4', borderRadius: '0 12px 12px 0' }}>
          <CardLabel icon="💬">Pricing Rationale</CardLabel>
          <BodyText>{bp.revenue_model.pricing_rationale}</BodyText>
        </Card>
      </section>

      {/* ── Operations ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Operations</SectionHeading>

        {/* Weekly Workflow */}
        <Card style={{ marginBottom: '16px' }}>
          <CardLabel icon="📅">Weekly Workflow</CardLabel>
          <BodyText>{bp.operations.weekly_workflow}</BodyText>
        </Card>

        {/* Tools */}
        <Card style={{ marginBottom: '16px' }}>
          <CardLabel icon="🛠️">Tools & Platforms</CardLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {bp.operations.tools_and_platforms.map((t, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t.tool}</p>
                  <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>{t.purpose}</p>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '4px 0 0' }}>Cost: {t.cost}</p>
                </div>
                <Pill
                  color={t.priority === 'Essential' ? '#16a34a' : '#64748b'}
                  bg={t.priority === 'Essential' ? '#f0fdf4' : '#f8fafc'}
                  border={t.priority === 'Essential' ? '#bbf7d0' : '#e2e8f0'}
                >
                  {t.priority}
                </Pill>
              </div>
            ))}
          </div>
        </Card>

        {/* Key Processes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bp.operations.key_processes.map((proc, i) => (
            <ExpandableSection key={i} title={proc.process} icon="⚙️">
              <div style={{ paddingTop: '16px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                  <Pill color="#475569" bg="#f8fafc" border="#e2e8f0">{proc.frequency}</Pill>
                  <Pill color="#475569" bg="#f8fafc" border="#e2e8f0">{proc.time_required}</Pill>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {proc.steps.map((step, j) => (
                    <div key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#2563eb',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        {j + 1}
                      </span>
                      <p style={{ fontSize: '0.88rem', color: '#334155', margin: 0, lineHeight: 1.6 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ExpandableSection>
          ))}
        </div>
      </section>

      {/* ── Risks ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Risks & Reality Checks</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bp.risks_and_reality_checks.map((r, i) => {
            const lc = likelihoodColor[r.likelihood] || likelihoodColor.Medium;
            return (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.4 }}>
                    {r.risk}
                  </p>
                  <Pill color={lc.color} bg={lc.bg} border={lc.border}>
                    {r.likelihood}
                  </Pill>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Mitigation
                  </p>
                  <BodyText>{r.mitigation}</BodyText>
                </div>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    borderLeft: '3px solid #06b6d4',
                  }}
                >
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0891b2', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Sam&apos;s Take
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.6 }}>{r.sam_note}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── 3-Month Milestones ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>3-Month Milestones</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bp.three_month_milestones.map((m, i) => (
            <Card key={i} style={{ borderLeft: '3px solid #2563eb', borderRadius: '0 12px 12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {m.month}
                </span>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Month {m.month}
                </p>
              </div>
              <BodyText>{m.target}</BodyText>
              <div style={{ marginTop: '12px' }}>
                <Pill color="#16a34a" bg="#f0fdf4" border="#bbf7d0">
                  Key Metric: {m.key_metric}
                </Pill>
              </div>
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
            From Sam
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
            {bp.personal_note}
          </p>
        </div>
      </section>
    </div>
  );
}
