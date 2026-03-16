'use client';

import { useState } from 'react';
import type { RoadmapData, RoadmapTask, RoadmapWeek, TaskPriority } from '@/lib/accelerator-data';

// ─── Types ───────────────────────────────────────

interface RoadmapProps {
  data: RoadmapData;
}

// ─── Priority config ─────────────────────────────

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; bg: string; color: string; borderColor: string }
> = {
  must_do: {
    label: 'Must Do',
    bg: '#fef2f2',
    color: '#dc2626',
    borderColor: '#fecaca',
  },
  should_do: {
    label: 'Should Do',
    bg: '#eff6ff',
    color: '#2563eb',
    borderColor: '#bfdbfe',
  },
  bonus: {
    label: 'Bonus',
    bg: '#f8fafc',
    color: '#64748b',
    borderColor: '#e2e8f0',
  },
};

// ─── Sub-components ──────────────────────────────

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 20px',
        background: '#f8fafc',
        border: '1px solid rgba(37,99,235,0.12)',
        borderRadius: 10,
        minWidth: 110,
        flex: 1,
      }}
    >
      <span
        style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          color: '#94a3b8',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 4,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#0f172a',
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        transition: 'transform 0.25s ease',
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="#64748b"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TaskItem({
  task,
  taskKey,
  expanded,
  onToggle,
}: {
  task: RoadmapTask;
  taskKey: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const priority = PRIORITY_CONFIG[task.priority];

  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        overflow: 'hidden',
        background: '#ffffff',
        transition: 'box-shadow 0.2s ease',
        boxShadow: expanded ? '0 2px 12px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      {/* Task header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          background: expanded ? '#fafbff' : '#ffffff',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.2s ease',
        }}
      >
        {/* Priority badge */}
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: priority.color,
            background: priority.bg,
            border: `1px solid ${priority.borderColor}`,
            borderRadius: 5,
            padding: '3px 7px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {priority.label}
        </span>

        {/* Title */}
        <span
          style={{
            flex: 1,
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#0f172a',
            lineHeight: 1.4,
          }}
        >
          {task.title}
        </span>

        {/* Time estimate */}
        <span
          style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            marginRight: 8,
          }}
        >
          {task.time_estimate}
        </span>

        <Chevron expanded={expanded} />
      </button>

      {/* Task body */}
      {expanded && (
        <div
          style={{
            padding: '0 16px 18px 16px',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          {/* Description */}
          <p
            style={{
              margin: '14px 0 18px 0',
              fontSize: '0.88rem',
              color: '#475569',
              lineHeight: 1.75,
            }}
          >
            {task.description}
          </p>

          {/* Sub-steps */}
          {task.sub_steps.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <p
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#94a3b8',
                  margin: '0 0 10px 0',
                }}
              >
                Steps
              </p>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {task.sub_steps.map((step, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: '#eff6ff',
                        color: '#2563eb',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.65 }}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tips */}
          {task.tips.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <p
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#94a3b8',
                  margin: '0 0 10px 0',
                }}
              >
                Tips
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {task.tips.map((tip, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span
                      style={{
                        color: '#0d9488',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      →
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.65 }}>
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources */}
          {task.resources.length > 0 && (
            <div>
              <p
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#94a3b8',
                  margin: '0 0 8px 0',
                }}
              >
                Resources
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {task.resources.map((res, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.75rem' }}>🔗</span>
                    <a
                      href={`https://${res.url_hint}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.8rem',
                        color: '#64748b',
                        textDecoration: 'none',
                        borderBottom: '1px dashed #cbd5e1',
                        lineHeight: 1.4,
                      }}
                    >
                      {res.title}
                    </a>
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

function WeekCard({
  week,
  weekIndex,
  isExpanded,
  expandedTasks,
  onToggleWeek,
  onToggleTask,
}: {
  week: RoadmapWeek;
  weekIndex: number;
  isExpanded: boolean;
  expandedTasks: Set<string>;
  onToggleWeek: () => void;
  onToggleTask: (key: string) => void;
}) {
  const taskCount = week.tasks.length;

  return (
    <div
      style={{
        border: '1px solid rgba(37,99,235,0.2)',
        borderRadius: 14,
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: isExpanded
          ? '0 4px 24px rgba(37,99,235,0.08)'
          : '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.25s ease',
      }}
    >
      {/* Week header */}
      <button
        onClick={onToggleWeek}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '18px 20px',
          background: isExpanded
            ? 'linear-gradient(135deg, #eff6ff 0%, #f0fdfa 100%)'
            : '#fafbfc',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.25s ease',
          borderBottom: isExpanded ? '1px solid rgba(37,99,235,0.12)' : '1px solid transparent',
        }}
      >
        {/* Week badge */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 10,
            background: isExpanded
              ? 'linear-gradient(135deg, #2563eb, #0891b2)'
              : '#e2e8f0',
            color: isExpanded ? '#ffffff' : '#64748b',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.02em',
            flexShrink: 0,
            transition: 'background 0.25s ease, color 0.25s ease',
          }}
        >
          W{week.week}
        </span>

        {/* Theme */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>
            Week {week.week}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            {week.theme}
          </div>
        </div>

        {/* Task count */}
        <span
          style={{
            fontSize: '0.75rem',
            color: '#64748b',
            background: '#f1f5f9',
            borderRadius: 20,
            padding: '4px 10px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            marginRight: 8,
          }}
        >
          {taskCount} task{taskCount !== 1 ? 's' : ''}
        </span>

        <Chevron expanded={isExpanded} />
      </button>

      {/* Week body */}
      {isExpanded && (
        <div style={{ padding: '20px' }}>
          {/* Tasks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {week.tasks.map((task, taskIndex) => {
              const taskKey = `${weekIndex}-${taskIndex}`;
              return (
                <TaskItem
                  key={taskKey}
                  task={task}
                  taskKey={taskKey}
                  expanded={expandedTasks.has(taskKey)}
                  onToggle={() => onToggleTask(taskKey)}
                />
              );
            })}
          </div>

          {/* Milestone */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
              border: '1px solid #bbf7d0',
              borderRadius: 10,
              padding: '14px 16px',
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803d', marginBottom: 6 }}>
              🏁 Week {week.week} Milestone
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534', lineHeight: 1.65 }}>
              {week.milestone}
            </p>
          </div>

          {/* Checkpoint */}
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 10,
              padding: '14px 16px',
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e', marginBottom: 6 }}>
              💬 Check-in
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#78350f', lineHeight: 1.65, fontStyle: 'italic' }}>
              {week.checkpoint_question}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────

export default function Roadmap({ data }: RoadmapProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([0]));
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  function toggleWeek(index: number) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function toggleTask(key: string) {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div
      style={{
        background: '#ffffff',
        color: '#0f172a',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        maxWidth: 780,
        margin: '0 auto',
        padding: '0 0 48px 0',
      }}
    >
      {/* ── 1. Overview card ─────────────────────── */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 16,
          padding: '28px 28px 24px 28px',
          marginBottom: 20,
          boxShadow: '0 2px 16px rgba(37,99,235,0.06)',
        }}
      >
        <h1
          style={{
            margin: '0 0 20px 0',
            fontSize: '1.55rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
          }}
        >
          Your 30-Day Roadmap
        </h1>

        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <StatPill label="Direction" value={data.direction} />
          <StatPill label="Hours / Week" value={`${data.hours_per_week}h`} />
          <StatPill label="Pacing" value={data.pacing} />
          <StatPill label="Starting Level" value={data.starting_level} />
        </div>
      </div>

      {/* ── 2. Personal note ─────────────────────── */}
      <div
        style={{
          background: '#fafaf9',
          border: '1px solid #e7e5e4',
          borderLeft: '4px solid #0d9488',
          borderRadius: '0 12px 12px 0',
          padding: '22px 24px',
          marginBottom: 32,
        }}
      >
        <div
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#0d9488',
            marginBottom: 12,
          }}
        >
          A note from Sam
        </div>
        <p
          style={{
            margin: 0,
            fontSize: '1rem',
            lineHeight: 1.8,
            color: '#292524',
            fontStyle: 'italic',
            whiteSpace: 'pre-line',
          }}
        >
          {data.personal_note}
        </p>
      </div>

      {/* ── 3. Week cards ────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
        {data.weeks.map((week, weekIndex) => (
          <WeekCard
            key={weekIndex}
            week={week}
            weekIndex={weekIndex}
            isExpanded={expandedWeeks.has(weekIndex)}
            expandedTasks={expandedTasks}
            onToggleWeek={() => toggleWeek(weekIndex)}
            onToggleTask={toggleTask}
          />
        ))}
      </div>

      {/* ── 4. Contingency section ───────────────── */}
      <div>
        <h2
          style={{
            margin: '0 0 16px 0',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              background: '#f1f5f9',
              borderRadius: 8,
              fontSize: '0.85rem',
            }}
          >
            ⚡
          </span>
          If Things Don&apos;t Go to Plan
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 14,
          }}
        >
          {/* Behind schedule */}
          <div
            style={{
              background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
              border: '1px solid #fde68a',
              borderRadius: 12,
              padding: '20px',
            }}
          >
            <div
              style={{
                fontSize: '1.25rem',
                marginBottom: 8,
              }}
            >
              🐢
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#92400e',
                marginBottom: 10,
              }}
            >
              Behind Schedule
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '0.84rem',
                color: '#78350f',
                lineHeight: 1.75,
              }}
            >
              {data.contingency.falling_behind}
            </p>
          </div>

          {/* Ahead of schedule */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              border: '1px solid #bbf7d0',
              borderRadius: 12,
              padding: '20px',
            }}
          >
            <div
              style={{
                fontSize: '1.25rem',
                marginBottom: 8,
              }}
            >
              🚀
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#15803d',
                marginBottom: 10,
              }}
            >
              Ahead of Schedule
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '0.84rem',
                color: '#166534',
                lineHeight: 1.75,
              }}
            >
              {data.contingency.ahead_of_schedule}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
