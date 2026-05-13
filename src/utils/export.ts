// ============================================================
// EXPORTAÇÃO — Playwright PNG export
// ============================================================
// Este módulo é usado via Node.js (scripts/export.js)
// Não importar diretamente no bundle do browser.

import type { ArtFormat } from './dimensions'
import { FORMATS } from './dimensions'

export interface ExportOptions {
  format: ArtFormat
  campaignSlug: string
  outputDir?: string
}

/**
 * Exporta a arte renderizada como PNG 1:1 (1080px).
 * Requer Playwright instalado e o servidor Vite rodando.
 *
 * Uso:
 *   await exportArt({ format: '4:5', campaignSlug: 'clube-escova' })
 */
export async function exportArt(options: ExportOptions): Promise<string> {
  // Import dinâmico — evita erro no bundle do browser
  const { chromium } = await import('playwright')

  const { format, campaignSlug, outputDir = 'exports' } = options
  const { width, height, slug } = FORMATS[format]

  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Viewport exato para pixel-perfect
  await page.setViewportSize({ width, height })

  // URL do preview com parâmetros de query
  const url = `http://localhost:5173/preview?format=${encodeURIComponent(format)}&campaign=${campaignSlug}`
  await page.goto(url, { waitUntil: 'networkidle' })

  // Aguarda fonte carregada
  await page.waitForFunction(() => document.fonts.ready)

  // Screenshot
  const filename = `${outputDir}/${slug}/${campaignSlug}.png`
  await page.screenshot({
    path: filename,
    clip: { x: 0, y: 0, width, height },
  })

  await browser.close()
  console.log(`✅ Exportado: ${filename}`)
  return filename
}

/**
 * Exporta todos os formatos de uma campanha.
 */
export async function exportAllFormats(
  campaignSlug: string,
  outputDir?: string
): Promise<string[]> {
  const formats: ArtFormat[] = ['4:5', '9:16']
  const results: string[] = []

  for (const format of formats) {
    const path = await exportArt({ format, campaignSlug, outputDir })
    results.push(path)
  }

  return results
}
