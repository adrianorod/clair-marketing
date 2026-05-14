import { queryDatabase, createCard, cardToNotionProps } from './notion.js'
import { getWeekSeasonality, CATEGORY_SPLIT, TEMAS_VOCABULARY } from './seasonality.js'
import { getRecentHistory } from './history.js'

const LLM_API_KEY = process.env.LLM_API_KEY
const LLM_MODEL = process.env.LLM_MODEL || 'gpt-4o'
const LLM_BASE = process.env.LLM_BASE || 'https://api.openai.com/v1'

const POSTS_PER_WEEK = parseInt(process.env.POSTS_PER_WEEK || '7', 10)
const WEEKS_OF_HISTORY = parseInt(process.env.WEEKS_OF_HISTORY || '4', 10)

async function callLLM(prompt: string): Promise<string> {
  const res = await fetch(`${LLM_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`LLM error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}

function buildPrompt(opts: {
  weekStart: string
  weekEnd: string
  seasonality: string
  events: string[]
  history: any
  backlog: any[]
}): string {
  const histByCat = Object.entries(opts.history.postsPorCategoria)
    .map(([cat, data]: any) => `  • ${cat}: ${data.count} posts — temas: [${data.temas.join(', ')}]`)
    .join('\n')

  const temasBlock = Object.entries(TEMAS_VOCABULARY)
    .map(([cat, temas]) => `  ${cat}: ${temas.join(', ')}`)
    .join('\n')

  return `
Você é o planejador de conteúdo do salão Clair de Lune, em Pedra de Guaratiba, Rio de Janeiro.
Slogan: "Viva sua melhor fase". Foco em transformação, empoderamento e cuidado feminino.

Contexto:
- Semana: ${opts.weekStart} a ${opts.weekEnd}
- Temporada: ${opts.seasonality}
- Eventos da semana: ${opts.events.join(', ') || 'nenhum'}
- Backlog disponível: ${opts.backlog.map((b) => `"${b.headline}"`).join(', ') || 'vazio'}
- Total de posts a planejar: ${POSTS_PER_WEEK}

Histórico recente (últimas ${WEEKS_OF_HISTORY} semanas):
- Total de posts: ${opts.history.totalPosts}
- Por categoria:
${histByCat || '  (nenhum)}
- Headlines usadas: ${opts.history.headlinhasUsadas.join(', ') || 'nenhuma'}

REGRAS DE DISTRIBUIÇÃO (${opts.seasonality} temporada):
${Object.entries(CATEGORY_SPLIT[opts.seasonality as keyof typeof CATEGORY_SPLIT])
  .map(([cat, pct]) => `- ${cat}: ${pct}% (${Math.round(POSTS_PER_WEEK * pct / 100)} posts)`)
  .join('\n')}

REGRAS DE DIVERSIDADE (OBRIGATÓRIAS):
1. NENHUMA headline pode repetir headline das últimas ${WEEKS_OF_HISTORY} semanas
2. NENHUM tema pode repetir tema já usado na MESMA categoria
3. BRIEF de mídia deve ser diferente dos briefs recentes
4. Variar ângulo entre semanas
5. Temas devem vir do vocabulário controlado abaixo

VOCABULÁRIO DE TEMAS (escolher dentro destes):
${temasBlock}

Para cada post, gere um BRIEF DE MÍDIA DETALHADO instruindo o humano sobre o que fotografar/gravar.
Ex de brief: "Foto em close do cabelo finalizado com escova modeladora. Fundo claro, luz natural."

Formato da saída: JSON com array de objetos.
Cada objeto:
{
  "categoria": "autoestima" | "dicas" | "venda" | "bastidores",
  "tema": "string (do vocabulário)",
  "angulo": "antes-depois | tutorial | storytelling | ritual | promocao | making-of",
  "headline": "string (max 8 palavras, tom sofisticado, sem emojis)",
  "formato": "4:5 | 9:16",
  "tipoConteudo": "Feed | Reels | Carrossel",
  "roteiro": "descrição do layout e estilo visual da arte",
  "briefMidia": "instrução detalhada do que o humano deve produzir (foto/vídeo)",
  "cta": "texto do call-to-action",
  "dataPrevista": "YYYY-MM-DD",
  "retornoEst": 1-5
}
Retorne APENAS o JSON, sem texto extra.
`
}

function validateDiversity(posts: any[], history: any): string[] {
  const errors: string[] = []
  const seenHeadlines = new Set(history.headlinhasUsadas)

  for (const post of posts) {
    const hl = post.headline?.toLowerCase()
    if (hl && seenHeadlines.has(hl)) {
      errors.push(`Headline repetida: "${post.headline}"`)
    }
    seenHeadlines.add(hl)
  }

  return errors
}

async function main() {
  console.log('=== Weekly Planner ===')
  console.log(`Posts por semana: ${POSTS_PER_WEEK}`)

  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const fmt = (d: Date) => d.toISOString().split('T')[0]

  console.log(`Período: ${fmt(weekStart)} a ${fmt(weekEnd)}`)

  const { seasonality, events } = getWeekSeasonality(now)
  console.log(`Temporada: ${seasonality}, Eventos: ${events.join(', ') || 'nenhum'}`)

  const backlogCards = await queryDatabase({ property: 'Status', value: 'Backlog' })
  console.log(`Backlog: ${backlogCards.length} cards`)

  const history = await getRecentHistory(WEEKS_OF_HISTORY)
  console.log(`Histórico: ${history.totalPosts} posts nos últimos ${WEEKS_OF_HISTORY} semanas`)

  const prompt = buildPrompt({
    weekStart: fmt(weekStart),
    weekEnd: fmt(weekEnd),
    seasonality,
    events,
    history,
    backlog: backlogCards,
  })

  console.log('Chamando LLM...')
  const raw = await callLLM(prompt)

  let posts: any[]
  try {
    const parsed = JSON.parse(raw)
    posts = Array.isArray(parsed) ? parsed : parsed.posts || []
  } catch {
    throw new Error(`Resposta da LLM não é JSON válido:\n${raw}`)
  }

  console.log(`LLM gerou ${posts.length} posts`)

  const errors = validateDiversity(posts, history)
  if (errors.length > 0) {
    console.warn('⚠ Violações de diversidade:')
    errors.forEach((e) => console.warn(`  - ${e}`))
  }

  for (const post of posts) {
    const props = cardToNotionProps({
      headline: post.headline,
      categoria: post.categoria,
      tema: post.tema,
      angulo: post.angulo,
      formato: post.formato,
      tipoConteudo: post.tipoConteudo,
      roteiro: post.roteiro,
      briefMidia: post.briefMidia,
      cta: post.cta,
      dataPrevista: post.dataPrevista,
      status: 'Plano da Semana',
      retornoEst: post.retornoEst,
    })

    const id = await createCard(props)
    console.log(`  ✅ Card criado: "${post.headline}" (${post.categoria}) — ${id}`)
  }

  console.log(`\n=== Concluído: ${posts.length} cards em "Plano da Semana" ===`)
  if (errors.length > 0) {
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error('❌ Erro:', err)
  process.exit(1)
})
