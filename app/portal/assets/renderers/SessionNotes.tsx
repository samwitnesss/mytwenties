'use client';

import type { SessionNotesData, Priority } from '@/lib/accelerator-data';

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function isDeadlinePast(deadlineStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = deadlineStr.split('-').map(Number);
  const deadline = new Date(year, month - 1, day);
  return deadline < today;
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, React.CSSProperties> = {
    must: {
      backgroundColor: '#fff1f0',
      color: '#c0392b',
      border: '1px solid #fca5a5',
    },
    should: {
      backgroundColor: '#eff6ff',
      color: '#2563eb',
      border: '1px solid #bfdbfe',
    },
    bonus: {
      backgroundColor: '#f8fafc',
      color: '#64748b',
      border: '1px solid #e2e8f0',
    },
  };

  const labels: Record<Priority, string> = {
    must: 'Must Do',
    should: 'Should Do',
    bonus: 'Bonus',
  };

  return (
    <span
      style={{
        ...styles[priority],
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {labels[priority]}
    </span>
  );
}

export default function SessionNotes({ data }: { data: SessionNotesData }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        maxWidth: '820px',
        margin: '0 auto',
        padding: 'clamp(24px, 5vw, 56px) clamp(20px, 5vw, 48px)',
        lineHeight: 1.6,
      }}
    >
      {/* ── 1. Header ── */}
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
          Session {data.session_number}
        </p>

        <p
          style={{
            fontSize: '0.9rem',
            color: '#64748b',
            marginBottom: '10px',
            fontWeight: 500,
          }}
        >
          {formatDate(data.date)}
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
          {data.client_name}&rsquo;s Session Notes
        </h1>

        <hr
          style={{
            border: 'none',
            borderTop: '1.5px solid #e2e8f0',
            margin: 0,
          }}
        />
      </header>

      {/* ── 2. Summary cards ── */}
      <section style={{ marginBottom: '40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          {/* Current Situation */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px 22px',
            }}
          >
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
              <span style={{ fontSize: '1rem' }}>📍</span> Current Situation
            </p>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#0f172a',
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              {data.current_situation}
            </p>
          </div>

          {/* Building Toward */}
          <div
            style={{
              backgroundColor: '#f0f7ff',
              border: '1.5px solid #bfdbfe',
              borderRadius: '12px',
              padding: '20px 22px',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#2563eb',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '1rem' }}>🎯</span> Building Toward
            </p>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#0f172a',
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              {data.building_toward}
            </p>
          </div>
        </div>

        {/* Direction pill */}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 18px',
              borderRadius: '24px',
              border: '1.5px solid #bfdbfe',
              backgroundColor: '#f0f7ff',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Direction: {data.direction}
            </span>
          </span>
        </div>
      </section>

      {/* ── 3. Key Moments ── */}
      <section style={{ marginBottom: '40px' }}>
        <SectionHeading>Key Moments from This Call</SectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.key_moments.map((moment, i) => (
            <div
              key={i}
              style={{
                borderLeft: '3px solid #2563eb',
                borderRadius: '0 10px 10px 0',
                backgroundColor: '#fafbff',
                padding: '20px 22px',
                boxShadow: '0 1px 4px rgba(37,99,235,0.06)',
              }}
            >
              <p
                style={{
                  fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                  lineHeight: 0.8,
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Georgia, serif',
                  userSelect: 'none',
                }}
                aria-hidden="true"
              >
                &ldquo;
              </p>
              <p
                style={{
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  fontStyle: 'italic',
                  color: '#0f172a',
                  lineHeight: 1.65,
                  margin: '0 0 12px',
                  fontWeight: 500,
                }}
              >
                {moment.quote}
              </p>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                &mdash; Context: {moment.context}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Reframe / Key Insight ── */}
      <section style={{ marginBottom: '40px' }}>
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
            💡 Key Insight
          </p>
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
              fontWeight: 700,
              lineHeight: 1.4,
              margin: '0 0 14px',
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}
          >
            {data.reframe.headline}
          </p>
          <p
            style={{
              fontSize: 'clamp(0.88rem, 1.8vw, 0.95rem)',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.88)',
              margin: 0,
            }}
          >
            {data.reframe.body}
          </p>
        </div>
      </section>

      {/* ── 5. Next Steps ── */}
      <section>
        <SectionHeading>Next Steps</SectionHeading>

        <div
          style={{
            border: '1.5px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {data.next_steps.map((step, i) => {
            const past = isDeadlinePast(step.deadline);
            const isLast = i === data.next_steps.length - 1;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '16px 20px',
                  borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                  backgroundColor: '#ffffff',
                }}
              >
                {/* Priority badge */}
                <div style={{ paddingTop: '2px' }}>
                  <PriorityBadge priority={step.priority} />
                </div>

                {/* Action text */}
                <p
                  style={{
                    flex: 1,
                    margin: 0,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    lineHeight: 1.55,
                  }}
                >
                  {step.action}
                </p>

                {/* Deadline */}
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: past ? '#dc2626' : '#0f172a',
                    whiteSpace: 'nowrap',
                    paddingTop: '3px',
                    flexShrink: 0,
                  }}
                >
                  Due {formatDate(step.deadline)}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

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
      <hr
        style={{
          border: 'none',
          borderTop: '1.5px solid #e2e8f0',
          margin: 0,
        }}
      />
    </div>
  );
}
