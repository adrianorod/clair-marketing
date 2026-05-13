// ============================================================
// BACKGROUND — Fundo da arte
// ============================================================

import React from 'react'
import { clairDeLune as theme } from '@/themes/clairDeLune'

type BackgroundVariant =
  | 'dark'           // azul noite
  | 'light'          // cream
  | 'gold-gradient'  // gradiente dourado
  | 'dark-gradient'  // gradiente dark
  | 'image'          // imagem com overlay

interface BackgroundProps {
  variant?: BackgroundVariant
  /** URL da imagem (quando variant === 'image') */
  src?: string
  /** Intensidade do overlay na imagem (0–1). Default: 0.55 */
  overlayOpacity?: number
}

const variants: Record<BackgroundVariant, React.CSSProperties> = {
  dark: {
    background: theme.colors.primary,
  },
  light: {
    background: theme.colors.cream,
  },
  'gold-gradient': {
    background: `linear-gradient(145deg, ${theme.colors.primary} 0%, ${theme.colors.creamDark} 40%, ${theme.colors.gold} 100%)`,
  },
  'dark-gradient': {
    background: `linear-gradient(160deg, ${theme.colors.primary} 0%, ${theme.colors.creamDark} 100%)`,
  },
  image: {
    // A imagem é tratada separadamente abaixo
    background: theme.colors.primary,
  },
}

export function Background({
  variant = 'dark',
  src,
  overlayOpacity = 0.55,
}: BackgroundProps) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    ...variants[variant],
  }

  if (variant === 'image' && src) {
    return (
      <>
        {/* Imagem de fundo — NUNCA distorcer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Overlay escuro para legibilidade do texto */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: theme.colors.overlay,
            opacity: overlayOpacity,
          }}
        />
      </>
    )
  }

  return <div style={baseStyle} />
}
