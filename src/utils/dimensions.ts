// ============================================================
// DIMENSÕES — Formatos oficiais
// ============================================================

export type ArtFormat = '4:5' | '9:16'

export interface Dimensions {
  width: number
  height: number
  label: string
  slug: string
}

export const FORMATS: Record<ArtFormat, Dimensions> = {
  '4:5': {
    width: 1080,
    height: 1350,
    label: 'Feed Instagram (4:5)',
    slug: '4x5',
  },
  '9:16': {
    width: 1080,
    height: 1920,
    label: 'Stories / Reels (9:16)',
    slug: '9x16',
  },
}

/**
 * Calcula o scale para exibir o canvas em preview,
 * dado o espaço disponível em px.
 */
export function getPreviewScale(
  format: ArtFormat,
  availableWidth: number,
  availableHeight: number
): number {
  const { width, height } = FORMATS[format]
  const scaleW = availableWidth / width
  const scaleH = availableHeight / height
  return Math.min(scaleW, scaleH, 1) // nunca escalar acima de 1:1
}

/**
 * Retorna as dimensões de preview em px.
 */
export function getPreviewDimensions(
  format: ArtFormat,
  scale: number
): { width: number; height: number } {
  const { width, height } = FORMATS[format]
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}
