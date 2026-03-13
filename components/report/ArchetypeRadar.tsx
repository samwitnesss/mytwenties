'use client'

import { useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis, Tooltip } from 'recharts'

interface RadarScore {
  axis: string
  value: number
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: RadarScore }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
      borderRadius: '10px', padding: '10px 14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      fontSize: '0.85rem', pointerEvents: 'none'
    }}>
      <p style={{ fontWeight: 700, color: 'var(--brand-text)', marginBottom: '2px' }}>{d.axis}</p>
      <p style={{ color: '#2563eb', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{d.value}%</p>
    </div>
  )
}

export default function ArchetypeRadar({ scores, primaryAxis }: { scores: RadarScore[], primaryAxis: string }) {
  const [activeAxis, setActiveAxis] = useState<string | null>(null)

  return (
    <div style={{
      background: 'var(--brand-card)', borderRadius: '20px', padding: '1.25rem',
      border: '1px solid var(--brand-border)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex', flexDirection: 'column', flex: 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        {activeAxis ? (
          <span style={{
            fontSize: '0.8rem', fontWeight: 700, color: '#2563eb',
            background: 'rgba(37,99,235,0.08)', borderRadius: '100px', padding: '3px 12px',
            border: '1px solid rgba(37,99,235,0.2)'
          }}>
            {activeAxis}: {scores.find(s => s.axis === activeAxis)?.value}%
          </span>
        ) : (
          <p style={{ fontSize: '0.75rem', color: 'var(--brand-text-subtle)', margin: 0 }}>
            Hover over points to explore your scores
          </p>
        )}
      </div>
      <ResponsiveContainer width="100%" height={520}>
        <RadarChart data={scores} margin={{ top: 24, right: 36, bottom: 24, left: 36 }}>
          <PolarGrid stroke="var(--brand-border)" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: 'var(--brand-text-mid)', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="You"
            dataKey="value"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.14}
            strokeWidth={2.5}
            dot={(props) => {
              const { cx, cy, payload } = props as { cx: number; cy: number; payload: RadarScore }
              const isPrimary = payload.axis === primaryAxis
              const isActive = payload.axis === activeAxis
              const r = isPrimary ? 9 : isActive ? 8 : 5
              const fill = isPrimary ? '#06b6d4' : '#2563eb'
              const stroke = isPrimary ? '#0891b2' : '#1d4ed8'
              return (
                <circle
                  key={`dot-${payload.axis}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                  style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                  onMouseEnter={() => setActiveAxis(payload.axis)}
                  onMouseLeave={() => setActiveAxis(null)}
                />
              )
            }}
            activeDot={{ r: 10, fill: '#06b6d4', stroke: '#0891b2', strokeWidth: 2 }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#06b6d4', border: '2px solid #0891b2' }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--brand-text-subtle)' }}>Primary archetype</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb', border: '2px solid #1d4ed8' }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--brand-text-subtle)' }}>Other archetypes</span>
        </div>
      </div>
    </div>
  )
}
