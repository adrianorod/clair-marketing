// ============================================================
// SAFE AREA — Margens obrigatórias por formato
// ============================================================

import React from 'react'
import type { ArtFormat } from '@/utils/dimensions'
import { clairDeLune as theme } from '@/themes/clairDeLune'

interface SafeAreaProps {
  format: ArtFormat
  /** Se true, exibe as bordas da safe area (debug mode) */
  debug?: boolean
  children: React.ReactNode
}

export function SafeArea({ format, debug = false, children }: SafeAreaProps) {
  const margins = theme.safeArea[format === '4:5' ? 'feed' : 'story']

  const style: React.CSSProperties = {
    position: 'absolute',
    top: margins.top,
    bottom: margins.bottom,
    left: margins.left,
    right: margins.right,
    // Debug: mostra a safe area com borda
    ...(debug && {
      outline: '2px dashed rgba(201, 169, 110, 0.5)',
      outlineOffset: -1,
    }),
  }

  return <div style={style}>{children}</div>
}
