import { queryDatabase, NotionCard } from './notion.js'

export interface HistorySummary {
  totalPosts: number
  postsPorCategoria: Record<string, { count: number; temas: string[] }>
  headlinhasUsadas: string[]
  ultimosBriefs: string[]
}

function getWeekAgo(weeks: number): string {
  const d = new Date()
  d.setDate(d.getDate() - weeks * 7)
  return d.toISOString()
}

export async function getRecentHistory(weeks = 4): Promise<HistorySummary> {
  const doneCards = await queryDatabase({ property: 'Status', value: 'Done' })

  const cutoff = getWeekAgo(weeks)
  const recent = doneCards.filter((c) => c.dataPrevista >= cutoff)

  const postsPorCategoria: Record<string, { count: number; temas: string[] }> = {}

  for (const card of recent) {
    const cat = card.categoria?.toLowerCase() || 'outros'
    if (!postsPorCategoria[cat]) {
      postsPorCategoria[cat] = { count: 0, temas: [] }
    }
    postsPorCategoria[cat].count++
    if (card.tema && !postsPorCategoria[cat].temas.includes(card.tema)) {
      postsPorCategoria[cat].temas.push(card.tema)
    }
  }

  return {
    totalPosts: recent.length,
    postsPorCategoria,
    headlinhasUsadas: recent.map((c) => c.headline.toLowerCase()),
    ultimosBriefs: recent.map((c) => c.briefMidia).filter(Boolean),
  }
}
