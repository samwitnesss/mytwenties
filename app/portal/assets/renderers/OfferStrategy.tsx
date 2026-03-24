'use client';

import { useState } from 'react';
import type { OfferStrategyData } from '@/lib/accelerator-data';

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

export default function OfferStrategy({ data }: { data: OfferStrategyData }) {
  const os = data;

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
          Offer Strategy
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
          Your Offer Breakdown
        </h1>
        <Pill color="#475569" bg="#f8fafc" border="#e2e8f0">
          {os.offer_overview.offer_type}
        </Pill>
        <hr style={{ border: 'none', borderTop: '1.5px solid #e2e8f0', margin: '24px 0 0' }} />
      </header>

      {/* ── Offer Overview ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Overview</SectionHeading>

        <Card style={{ marginBottom: '16px' }}>
          <CardLabel icon="🛍️">What You Sell</CardLabel>
          <BodyText>{os.offer_overview.what_you_sell}</BodyText>
        </Card>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          <Card>
            <CardLabel icon="👥">Who It&apos;s For</CardLabel>
            <BodyText>{os.offer_overview.who_its_for}</BodyText>
          </Card>
          <Card style={{ backgroundColor: '#f0f7ff', borderColor: '#bfdbfe' }}>
            <CardLabel icon="✨">The Transformation</CardLabel>
            <BodyText>{os.offer_overview.the_transformation}</BodyText>
          </Card>
        </div>
      </section>

      {/* ── Offers ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Your Offers</SectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {os.offers.map((offer, i) => (
            <Card key={i} style={{ borderLeft: '3px solid #2563eb', borderRadius: '0 12px 12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
                  {offer.offer_name}
                </h3>
                <Pill color="#16a34a" bg="#f0fdf4" border="#bbf7d0">
                  {offer.price}
                </Pill>
              </div>

              <BodyText>{offer.description}</BodyText>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Cost to Deliver
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>{offer.cost_to_deliver}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Margin
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600, margin: 0 }}>{offer.margin}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Ideal Volume
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>{offer.ideal_volume}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Pricing Model
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0 }}>{offer.pricing_model}</p>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Positioning
                </p>
                <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.6 }}>{offer.positioning}</p>
              </div>

              <div style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Proof Points
                </p>
                <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.6 }}>{offer.proof_points}</p>
              </div>

              <div
                style={{
                  marginTop: '12px',
                  padding: '12px 14px',
                  backgroundColor: '#ecfeff',
                  borderRadius: '8px',
                  borderLeft: '3px solid #06b6d4',
                }}
              >
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0891b2', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Evolution Path
                </p>
                <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.6 }}>{offer.evolution_path}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Pricing Psychology ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Pricing Psychology</SectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ExpandableSection title="Anchoring Strategy" icon="⚓" defaultOpen>
            <div style={{ paddingTop: '16px' }}>
              <BodyText>{os.pricing_psychology.anchoring_strategy}</BodyText>
            </div>
          </ExpandableSection>

          <ExpandableSection title="Common Mistakes to Avoid" icon="⚠️">
            <div style={{ paddingTop: '16px' }}>
              <BodyText>{os.pricing_psychology.common_mistakes}</BodyText>
            </div>
          </ExpandableSection>

          <ExpandableSection title="When to Raise Prices" icon="📈">
            <div style={{ paddingTop: '16px' }}>
              <BodyText>{os.pricing_psychology.when_to_raise_prices}</BodyText>
            </div>
          </ExpandableSection>
        </div>
      </section>

      {/* ── Testing Plan ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Testing Plan</SectionHeading>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <Card>
            <CardLabel icon="🧪">What to Test First</CardLabel>
            <BodyText>{os.testing_plan.what_to_test_first}</BodyText>
          </Card>
          <Card>
            <CardLabel icon="📊">How to Test</CardLabel>
            <BodyText>{os.testing_plan.how_to_test}</BodyText>
          </Card>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          <Card style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <CardLabel icon="✅">Success Signals</CardLabel>
            <BodyText>{os.testing_plan.success_signals}</BodyText>
          </Card>
          <Card style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
            <CardLabel icon="🔄">Pivot Triggers</CardLabel>
            <BodyText>{os.testing_plan.pivot_triggers}</BodyText>
          </Card>
        </div>
      </section>

      {/* ── Competitive Context ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Competitive Context</SectionHeading>

        <Card style={{ marginBottom: '16px' }}>
          <CardLabel icon="🏪">The Landscape</CardLabel>
          <BodyText>{os.competitive_context.who_else_does_this}</BodyText>
        </Card>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          <Card style={{ backgroundColor: '#f0f7ff', borderColor: '#bfdbfe' }}>
            <CardLabel icon="⚡">Your Edge</CardLabel>
            <BodyText>{os.competitive_context.their_edge}</BodyText>
          </Card>
          <Card>
            <CardLabel icon="💲">Price Benchmarks</CardLabel>
            <BodyText>{os.competitive_context.price_benchmarks}</BodyText>
          </Card>
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
            {os.personal_note}
          </p>
        </div>
      </section>
    </div>
  );
}
