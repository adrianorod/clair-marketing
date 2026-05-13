// ============================================================
// ARTBOARD — Canvas principal de renderização
// ============================================================
// Responsabilidades:
//   - controlar dimensões exatas (1080px base)
//   - escalar para preview
//   - aplicar safe area
//   - centralizar no viewport
//   - ser o target do screenshot do Playwright

import React from 'react'
import { FORMATS, getPreviewScale } from '@/utils/dimensions'
import type { ArtFormat } from '@/utils/dimensions'
import { clairDeLune as theme } from '@/themes/clairDeLune'

interface ArtboardProps {
  format: ArtFormat
  /** Largura disponível para preview em px. Default: window.innerWidth */
  previewWidth?: number
  /** Altura disponível para preview em px. Default: window.innerHeight */
  previewHeight?: number
  /** Se true, renderiza em escala 1:1 (para exportação via Playwright) */
  fullResolution?: boolean
  children: React.ReactNode
}

export function Artboard({
  format,
  previewWidth,
  previewHeight,
  fullResolution = false,
  children,
}: ArtboardProps) {
  const { width, height } = FORMATS[format]

  // Calcula escala para preview
  const availW = previewWidth ?? (typeof window !== 'undefined' ? window.innerWidth - 48 : width)
  const availH = previewHeight ?? (typeof window !== 'undefined' ? window.innerHeight - 48 : height)
  const scale = fullResolution ? 1 : getPreviewScale(format, availW, availH)

  const containerStyle: React.CSSProperties = {
    // Dimensões base (1080px)
    width,
    height,
    position: 'relative',
    overflow: 'hidden',
    // Escala para preview — transform-origin: top left para não deslocar
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    // Fundo padrão — será sobrescrito por Background component
    background: theme.colors.primary,
    // Garante que é o contexto de stacking correto
    isolation: 'isolate',
  }

  const wrapperStyle: React.CSSProperties = {
    // Espaço real no DOM após scale
    width: Math.round(width * scale),
    height: Math.round(height * scale),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }

  return (
    <div style={wrapperStyle} data-artboard-wrapper>
      <div
        id="artboard"
        data-format={format}
        data-width={width}
        data-height={height}
        style={containerStyle}
      >
        {children}
      </div>
    </div>
  )
}
