'use client'

import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  glowColor?: string
  onClick?: () => void
}

export default function GlassCard({ children, style, className, glowColor, onClick }: GlassCardProps) {
  return (
    <div
      className={`glass-card ${className || ''}`}
      onClick={onClick}
      style={{
        borderRadius: '20px', padding: '1.5rem', position: 'relative', overflow: 'hidden',
        boxShadow: glowColor ? `0 0 40px ${glowColor}20` : '0 0 40px rgba(124,58,237,0.06)',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {glowColor && (
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px',
          background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
          borderRadius: '50%', filter: 'blur(25px)', pointerEvents: 'none'
        }} />
      )}
      <div style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  )
}
