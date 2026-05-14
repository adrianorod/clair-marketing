// ============================================================
// LOGO — Marca Clair de Lune
// ============================================================

import React from 'react'
import logoImg from '../../../_media/logo.png'

type LogoSize = 'sm' | 'md' | 'lg'

interface LogoProps {
  /** @deprecated No longer used as we use a single logo image */
  variant?: 'light' | 'dark' | 'gold'
  size?: LogoSize
  /** @deprecated No longer used as we use a single logo image */
  iconOnly?: boolean
  style?: React.CSSProperties
}

const sizeMap: Record<LogoSize, number> = {
  sm: 120,
  md: 200,
  lg: 300,
}

export function Logo({ size = 'md', style }: LogoProps) {
  const width = sizeMap[size]

  return (
    <div style={{ display: 'inline-block', ...style }}>
      <img
        src={logoImg}
        alt="Clair de Lune"
        style={{
          width: width,
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
