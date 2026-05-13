// ============================================================
// scripts/export.js
// ============================================================
// Exporta todas as campanhas como PNG via Playwright.
//
// Uso:
//   npm run export
//   node scripts/export.js
//   node scripts/export.js --campaign clube-escova
//   node scripts/export.js --campaign clube-escova --format 4:5
//
// Requer:
//   - npm run dev (Vite deve estar rodando na porta 5173)
//   - npx playwright install chromium

import { chromium } from 'playwright'
import { createServer } from 'vite'
import path from 'path'
import fs from 'fs'

const BASE_URL = 'http://localhost:5173'

const CAMPAIGNS = [
  { slug: 'clube-escova', format: '4:5', dir: '4x5' },
  { slug: 'clube-escova-story', format: '9:16', dir: '9x16' },
  { slug: 'dia-das-maes', format: '4:5', dir: '4x5' },
]

const FORMATS = {
  '4:5': { width: 1080, height: 1350 },
  '9:16': { width: 1080, height: 1920 },
}

async function exportCampaign(browser, { slug, format, dir }) {
  const { width, height } = FORMATS[format]
  const page = await browser.newPage()

  await page.setViewportSize({ width, height })

  const url = `${BASE_URL}/preview?format=${encodeURIComponent(format)}&campaign=${slug}&export=true`
  console.log(`⏳ Abrindo: ${url}`)

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForFunction(() => document.fonts.ready)

  // Aguarda um frame extra para garantir rendering completo
  await page.waitForTimeout(500)

  const outputDir = path.join('exports', dir)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const filename = path.join(outputDir, `${slug}.png`)
  await page.screenshot({
    path: filename,
    clip: { x: 0, y: 0, width, height },
  })

  await page.close()
  console.log(`✅ Exportado: ${filename} (${width}x${height}px)`)
  return filename
}

async function main() {
  const args = process.argv.slice(2)
  const campaignArg = args.find((_, i) => args[i - 1] === '--campaign')
  const formatArg = args.find((_, i) => args[i - 1] === '--format')

  let targets = CAMPAIGNS
  if (campaignArg) {
    targets = CAMPAIGNS.filter((c) => c.slug === campaignArg)
    if (formatArg) {
      targets = targets.filter((c) => c.format === formatArg)
    }
  }

  if (targets.length === 0) {
    console.error('❌ Nenhuma campanha encontrada com os filtros fornecidos.')
    process.exit(1)
  }

  console.log(`\n🎨 Marketing Art Generator — Clair de Lune`)
  console.log(`📸 Exportando ${targets.length} arte(s)...\n`)

  console.log('🚀 Iniciando servidor de desenvolvimento Vite...')
  const vite = await createServer({
    server: { port: 5173 },
    appType: 'spa',
  })
  await vite.listen()

  const browser = await chromium.launch()

  const results = []
  for (const target of targets) {
    try {
      const file = await exportCampaign(browser, target)
      results.push({ ...target, file, success: true })
    } catch (err) {
      console.error(`❌ Erro ao exportar ${target.slug}:`, err.message)
      results.push({ ...target, success: false })
    }
  }

  await browser.close()
  await vite.close()

  console.log('\n📋 Resumo:')
  results.forEach(({ slug, file, success }) => {
    console.log(success ? `  ✅ ${slug} → ${file}` : `  ❌ ${slug} — falhou`)
  })

  const failed = results.filter((r) => !r.success).length
  if (failed > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})
