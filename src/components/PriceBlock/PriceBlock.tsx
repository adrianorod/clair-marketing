// ============================================================
// PRICE BLOCK — Bloco de preço destacado
// ============================================================

import React from 'react'
import { clairDeLune as theme } from '@/themes/clairDeLune'

interface PriceBlockProps {
  price: string
  suffix?: string
  /** Texto acima do preço, ex: "a partir de" */
  label?: string
  variant?: 'dark' | 'light' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

export function PriceBlock({
  price,
  suffix,
  label,
  variant = 'light',
  size = 'md',
  style,
}: PriceBlockProps) {
  const priceSize = { sm: 72, md: 100, lg: 128 }[size]
  const suffixSize = { sm: 24, md: 32, lg: 40 }[size]
  const labelSize = { sm: 18, md: 22, lg: 28 }[size]

  const colors = {
    dark: { price: theme.colors.white, suffix: theme.colors.gold, label: theme.colors.muted },
    light: { price: theme.colors.black, suffix: theme.colors.gold, label: theme.colors.muted },
    gold: { price: theme.colors.gold, suffix: theme.colors.gold, label: theme.colors.gold },
  }[variant]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && (
        <span
          style={{
            fontFamily: theme.typography.fontDisplay,
            fontSize: labelSize,
            fontWeight: theme.typography.weights.regular,
            color: colors.label,
            letterSpacing: theme.typography.letterSpacings.wide,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <span
          style={{
            fontFamily: theme.typography.fontDisplay,
            fontSize: priceSize,
            fontWeight: theme.typography.weights.bold,
            lineHeight: 1,
            color: colors.price,
            letterSpacing: theme.typography.letterSpacings.tight,
          }}
        >
          {price}
        </span>
        {suffix && (
          <span
            style={{
              fontFamily: theme.typography.fontDisplay,
              fontSize: suffixSize,
              fontWeight: theme.typography.weights.regular,
              color: colors.suffix,
              paddingBottom: 8,
              lineHeight: 1,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
