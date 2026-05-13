// ============================================================
// CTA — Call to Action
// ============================================================

import React from 'react'
import { clairDeLune as theme } from '@/themes/clairDeLune'

type CTAVariant = 'primary' | 'outline' | 'ghost' | 'gold'

interface CTAProps {
  children: React.ReactNode
  variant?: CTAVariant
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

const variantStyles: Record<CTAVariant, React.CSSProperties> = {
  primary: {
    background: theme.colors.rose,
    color: theme.colors.white,
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: theme.colors.white,
    border: `2px solid ${theme.colors.white}`,
  },
  ghost: {
    background: 'rgba(255,255,255,0.12)',
    color: theme.colors.white,
    border: `1px solid rgba(255,255,255,0.25)`,
    backdropFilter: 'blur(8px)',
  },
  gold: {
    background: theme.colors.gold,
    color: theme.colors.black,
    border: 'none',
  },
}

const sizeStyles: Record<'sm' | 'md' | 'lg', React.CSSProperties> = {
  sm: {
    fontSize: theme.typography.sizes.xs,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: theme.radii.pill,
  },
  md: {
    fontSize: theme.typography.sizes.sm,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 56,
    paddingRight: 56,
    borderRadius: theme.radii.pill,
  },
  lg: {
    fontSize: theme.typography.sizes.md,
    paddingTop: 32,
    paddingBottom: 32,
    paddingLeft: 72,
    paddingRight: 72,
    borderRadius: theme.radii.pill,
  },
}

export function CTA({ children, variant = 'primary', size = 'md', style }: CTAProps) {
  const ctaStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: theme.typography.fontDisplay,
    fontWeight: theme.typography.weights.semibold,
    letterSpacing: theme.typography.letterSpacings.wide,
    textTransform: 'uppercase',
    lineHeight: 1,
    cursor: 'default',
    userSelect: 'none',
    boxShadow: theme.shadows.medium,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  }

  return <div style={ctaStyle}>{children}</div>
}
