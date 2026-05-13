// ============================================================
// HEADLINE — Título principal da arte
// ============================================================

import React from 'react'
import { clairDeLune as theme } from '@/themes/clairDeLune'

type HeadlineSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero'
type HeadlineColor = 'white' | 'gold' | 'dark' | 'rose'

interface HeadlineProps {
  children: React.ReactNode
  size?: HeadlineSize
  color?: HeadlineColor
  align?: React.CSSProperties['textAlign']
  italic?: boolean
  style?: React.CSSProperties
}

const sizeMap: Record<HeadlineSize, number> = {
  sm: theme.typography.sizes.sm,
  md: theme.typography.sizes.md,
  lg: theme.typography.sizes.lg,
  xl: theme.typography.sizes.xl,
  hero: theme.typography.sizes.hero,
}

const colorMap: Record<HeadlineColor, string> = {
  white: theme.colors.white,
  gold: theme.colors.gold,
  dark: theme.colors.black,
  rose: theme.colors.rose,
}

export function Headline({
  children,
  size = 'lg',
  color = 'white',
  align = 'left',
  italic = false,
  style,
}: HeadlineProps) {
  const headlineStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontDisplay,
    fontSize: sizeMap[size],
    fontWeight: theme.typography.weights.bold,
    fontStyle: italic ? 'italic' : 'normal',
    lineHeight: theme.typography.lineHeights.tight,
    letterSpacing: theme.typography.letterSpacings.tight,
    color: colorMap[color],
    margin: 0,
    padding: 0,
    textAlign: align,
    ...style,
  }

  return <h1 style={headlineStyle}>{children}</h1>
}

// ----------------------------------------------------------
// SUBHEADLINE
// ----------------------------------------------------------

interface SubheadlineProps {
  children: React.ReactNode
  color?: HeadlineColor
  align?: React.CSSProperties['textAlign']
  style?: React.CSSProperties
}

export function Subheadline({
  children,
  color = 'gold',
  align = 'left',
  style,
}: SubheadlineProps) {
  const subStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontAccent,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    lineHeight: theme.typography.lineHeights.snug,
    letterSpacing: theme.typography.letterSpacings.wider,
    color: colorMap[color],
    margin: 0,
    padding: 0,
    textAlign: align,
    ...style,
  }

  return <p style={subStyle}>{children}</p>
}
