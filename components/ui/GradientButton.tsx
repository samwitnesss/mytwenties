'use client'

import React from 'react'

interface GradientButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

export default function GradientButton({
  children, onClick, type = 'button', disabled = false, fullWidth = false, size = 'md', style
}: GradientButtonProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { fontSize: '0.85rem', padding: '0.6rem 1.4rem' },
    md: { fontSize: '1rem', padding: '0.85rem 2rem' },
    lg: { fontSize: '1.1rem', padding: '1rem 2.5rem' }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="gradient-btn"
      style={{
        ...sizeStyles[size],
        fontWeight: 700, color: '#ffffff', borderRadius: '100px', border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer', width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.6 : 1, display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', gap: '8px',
        ...style
      }}
    >
      {children}
    </button>
  )
}
