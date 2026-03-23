'use client';

import { useState } from 'react';
import type { BrandBlueprintData } from '@/lib/accelerator-data';

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

function ExpandableSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
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

export default function BrandBlueprint({ data }: { data: BrandBlueprintData }) {
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
          Brand Blueprint
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
          {bp.brand_identity.brand_name || 'Your Brand'}
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#475569', margin: '0 0 24px', fontStyle: 'italic', lineHeight: 1.5 }}>
          {bp.brand_identity.one_liner}
        </p>
        <hr style={{ border: 'none', borderTop: '1.5px solid #e2e8f0', margin: 0 }} />
      </header>

      {/* ── Brand Essence ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Brand Essence</SectionHeading>
        <Card>
          <BodyText>{bp.brand_identity.brand_essence}</BodyText>
        </Card>
      </section>

      {/* ── Brand Values ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Brand Values</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bp.brand_identity.brand_values.map((v, i) => (
            <Card key={i} style={{ borderLeft: '3px solid #2563eb', borderRadius: '0 12px 12px 0' }}>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{v.value}</p>
              <BodyText>{v.what_it_means}</BodyText>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Brand Personality ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Brand Personality</SectionHeading>

        <Card style={{ marginBottom: '16px' }}>
          <CardLabel icon="👤">If Your Brand Were a Person</CardLabel>
          <BodyText>{bp.brand_identity.brand_personality.if_your_brand_were_a_person}</BodyText>
        </Card>

        <Card style={{ marginBottom: '16px' }}>
          <CardLabel icon="🎤">Voice Attributes</CardLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {bp.brand_identity.brand_personality.voice_attributes.map((attr, i) => (
              <Pill key={i}>{attr}</Pill>
            ))}
          </div>
        </Card>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          <Card style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <CardLabel icon="✅">Do Say</CardLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {bp.brand_identity.brand_personality.do_say.map((s, i) => (
                <p key={i} style={{ fontSize: '0.88rem', color: '#15803d', margin: 0, lineHeight: 1.5 }}>{s}</p>
              ))}
            </div>
          </Card>

          <Card style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
            <CardLabel icon="🚫">Don&apos;t Say</CardLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {bp.brand_identity.brand_personality.dont_say.map((s, i) => (
                <p key={i} style={{ fontSize: '0.88rem', color: '#b91c1c', margin: 0, lineHeight: 1.5 }}>{s}</p>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ── Target Audience ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Target Audience</SectionHeading>

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
            <BodyText>{bp.target_audience.primary_audience.who}</BodyText>
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Pill>Age: {bp.target_audience.primary_audience.age_range}</Pill>
            </div>
          </Card>
          <Card>
            <CardLabel icon="🧠">What They Care About</CardLabel>
            <BodyText>{bp.target_audience.primary_audience.psychographics}</BodyText>
          </Card>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <Card>
            <CardLabel icon="📍">Where They Are</CardLabel>
            <BodyText>{bp.target_audience.primary_audience.where_they_are}</BodyText>
          </Card>
          <Card style={{ backgroundColor: '#f0f7ff', borderColor: '#bfdbfe' }}>
            <CardLabel icon="💬">What They Need to Hear</CardLabel>
            <p style={{ fontSize: '0.95rem', color: '#1e40af', margin: 0, lineHeight: 1.65, fontStyle: 'italic', fontWeight: 500 }}>
              &ldquo;{bp.target_audience.primary_audience.what_they_need_to_hear}&rdquo;
            </p>
          </Card>
        </div>

        <Card>
          <CardLabel icon="💡">Audience Insight</CardLabel>
          <BodyText>{bp.target_audience.audience_insight}</BodyText>
        </Card>
      </section>

      {/* ── Content Strategy ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Content Strategy</SectionHeading>

        {/* Content Pillars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {bp.content_strategy.content_pillars.map((pillar, i) => (
            <ExpandableSection key={i} title={pillar.pillar} icon="📌">
              <div style={{ paddingTop: '16px' }}>
                <BodyText>{pillar.description}</BodyText>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
                  <Pill color="#7c3aed" bg="#f5f3ff" border="#ddd6fe">
                    {pillar.purpose}
                  </Pill>
                  <Pill color="#475569" bg="#f8fafc" border="#e2e8f0">
                    {pillar.frequency}
                  </Pill>
                </div>

                {pillar.formats.length > 0 && (
                  <div style={{ marginTop: '14px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Formats
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {pillar.formats.map((f, j) => (
                        <Pill key={j} color="#475569" bg="#f1f5f9" border="#cbd5e1">{f}</Pill>
                      ))}
                    </div>
                  </div>
                )}

                {pillar.example_ideas.length > 0 && (
                  <div style={{ marginTop: '14px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Content Ideas
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {pillar.example_ideas.map((idea, j) => (
                        <p key={j} style={{ fontSize: '0.88rem', color: '#334155', margin: 0, lineHeight: 1.5, paddingLeft: '12px', borderLeft: '2px solid #e2e8f0' }}>
                          {idea}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ExpandableSection>
          ))}
        </div>

        {/* Posting Rhythm */}
        <Card style={{ marginBottom: '16px' }}>
          <CardLabel icon="📅">Posting Rhythm</CardLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
            <Pill>{bp.content_strategy.posting_rhythm.posts_per_week}x per week</Pill>
            {bp.content_strategy.posting_rhythm.batch_day && (
              <Pill color="#475569" bg="#f8fafc" border="#e2e8f0">Batch: {bp.content_strategy.posting_rhythm.batch_day}</Pill>
            )}
          </div>
          <BodyText>{bp.content_strategy.posting_rhythm.posting_schedule}</BodyText>
          {bp.content_strategy.posting_rhythm.best_formats.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Best Formats (ranked)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {bp.content_strategy.posting_rhythm.best_formats.map((f, i) => (
                  <p key={i} style={{ fontSize: '0.88rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                    {i + 1}. {f}
                  </p>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Content Rules */}
        <Card>
          <CardLabel icon="📏">Content Rules</CardLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {bp.content_strategy.content_rules.map((rule, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                }}
              >
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
                  {i + 1}
                </span>
                <p style={{ fontSize: '0.88rem', color: '#334155', margin: 0, lineHeight: 1.6 }}>{rule}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ── Visual Identity ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Visual Identity</SectionHeading>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <Card>
            <CardLabel icon="🎨">Current Aesthetic</CardLabel>
            <BodyText>{bp.visual_identity.current_aesthetic}</BodyText>
          </Card>
          <Card>
            <CardLabel icon="🌈">Color & Mood</CardLabel>
            <BodyText>{bp.visual_identity.color_mood}</BodyText>
          </Card>
        </div>

        <Card style={{ marginBottom: '16px' }}>
          <CardLabel icon="📸">Photo & Video Style</CardLabel>
          <BodyText>{bp.visual_identity.photo_style}</BodyText>
        </Card>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          <Card style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
            <CardLabel icon="🚫">Visual Don&apos;ts</CardLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {bp.visual_identity.visual_dont.map((d, i) => (
                <p key={i} style={{ fontSize: '0.88rem', color: '#b91c1c', margin: 0, lineHeight: 1.5 }}>{d}</p>
              ))}
            </div>
          </Card>
          <Card>
            <CardLabel icon="🛠️">Tools</CardLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {bp.visual_identity.tools.map((t, i) => (
                <Pill key={i} color="#475569" bg="#f8fafc" border="#e2e8f0">{t}</Pill>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ── Brand Evolution ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Brand Evolution</SectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
          <Card>
            <CardLabel icon="📍">Where You Are Now</CardLabel>
            <BodyText>{bp.brand_evolution.where_you_are_now}</BodyText>
          </Card>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            <Card style={{ backgroundColor: '#f0f7ff', borderColor: '#bfdbfe' }}>
              <CardLabel icon="🎯">3-Month Vision</CardLabel>
              <BodyText>{bp.brand_evolution.three_month_vision}</BodyText>
            </Card>
            <Card style={{ backgroundColor: '#ecfeff', borderColor: '#a5f3fc' }}>
              <CardLabel icon="🚀">6-Month Vision</CardLabel>
              <BodyText>{bp.brand_evolution.six_month_vision}</BodyText>
            </Card>
          </div>

          <Card style={{ borderLeft: '3px solid #06b6d4', borderRadius: '0 12px 12px 0' }}>
            <CardLabel icon="🌉">The Bridge</CardLabel>
            <BodyText>{bp.brand_evolution.the_bridge}</BodyText>
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
            {bp.personal_note}
          </p>
        </div>
      </section>
    </div>
  );
}
