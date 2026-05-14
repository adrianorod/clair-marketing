import { queryDatabase, updateCard, cardToNotionProps } from './notion.js'
import { execSync } from 'child_process'
import { readFileSync, appendFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CAMPAIGNS_PATH = join(__dirname, '..', 'src', 'campaigns', 'campaigns.ts')

function slugify(text: string): string {
  return 'gen-' + text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

function appendCampaign(campaign: {
  slug: string
  headline: string
  cta: string
  format: string
  categoria: string
}): void {
  const formatMap: Record<string, string> = {
    '4:5': "'4:5'",
    '9:16': "'9:16'",
  }

  const entry = `  {
    slug: '${campaign.slug}',
    name: '${campaign.headline}',
    format: ${formatMap[campaign.format] || "'4:5'"},
    headline: '${campaign.headline.replace(/'/g, "\\'")}',
    cta: '${campaign.cta.replace(/'/g, "\\'")}',
    tags: ['gerado', '${campaign.categoria}'],
  },
`

  const content = readFileSync(CAMPAIGNS_PATH, 'utf-8')
  const insertBefore = content.lastIndexOf('];')
  if (insertBefore === -1) {
    throw new Error('Não foi possível encontrar o final do array de campanhas')
  }

  const updated = content.slice(0, insertBefore) + entry + content.slice(insertBefore)
  appendFileSync(CAMPAIGNS_PATH, updated.slice(content.length))
  console.log(`  📝 Campanha "${campaign.slug}" adicionada a campaigns.ts`)
}

function exportCampaign(slug: string, format: string): string {
  const exportsDir = join(__dirname, '..', 'exports')
  const dirName = format.replace(':', 'x')
  const outDir = join(exportsDir, dirName)

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
  }

  const cmd = `node scripts/export.js --campaign ${slug} --format ${format}`
  console.log(`  ⚙️  Executando: ${cmd}`)

  execSync(cmd, {
    cwd: join(__dirname, '..'),
    stdio: 'inherit',
    timeout: 60000,
  })

  return join(outDir, `${slug}.png`)
}

interface ReadyCard {
  id: string
  headline: string
  categoria: string
  formato: string
  cta: string
}

async function main() {
  console.log('=== Generate Art ===')

  const readyCards = await queryDatabase({ property: 'Status', value: 'Pronto pra Fazer' })
  const complete = readyCards.filter(
    (c) => c.headline && c.formato && c.cta,
  )

  if (complete.length === 0) {
    console.log('Nenhum card completo em "Pronto pra Fazer".')
    return
  }

  console.log(`Encontrados ${complete.length} cards prontos`)

  const results: Array<{ card: ReadyCard; file?: string; error?: string }> = []

  for (const card of complete) {
    console.log(`\n--- Processando: "${card.headline}" ---`)

    const slug = slugify(card.headline)

    try {
      appendCampaign({
        slug,
        headline: card.headline,
        cta: card.cta,
        format: card.formato,
        categoria: card.categoria,
      })

      const filePath = exportCampaign(slug, card.formato)
      console.log(`  ✅ PNG gerado: ${filePath}`)

      await updateCard(card.id, cardToNotionProps({
        headline: card.headline,
        status: 'Em Validação',
        copy: card.copy,
      }))

      results.push({ card, file: filePath })
      console.log(`  ✅ Card movido para "Em Validação"`)
    } catch (err: any) {
      console.error(`  ❌ Erro: ${err.message}`)
      results.push({ card, error: err.message })
    }
  }

  const success = results.filter((r) => r.file)
  const failed = results.filter((r) => r.error)

  console.log(`\n=== Resumo ===`)
  console.log(`✅ ${success.length} arte(s) gerada(s)`)
  if (failed.length > 0) {
    console.log(`❌ ${failed.length} falha(s)`)
    failed.forEach((f) => console.log(`  - "${f.card.headline}": ${f.error}`))
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})
