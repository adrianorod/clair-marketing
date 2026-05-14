const NOTION_TOKEN = process.env.NOTION_TOKEN
const DATABASE_ID = process.env.NOTION_DATABASE_ID

if (!NOTION_TOKEN) throw new Error('NOTION_TOKEN não definido')
if (!DATABASE_ID) throw new Error('NOTION_DATABASE_ID não definido')

const NOTION_API = 'https://api.notion.com/v1'
const HEADERS = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28',
}

export interface NotionCard {
  id: string
  headline: string
  categoria: string
  tema: string
  angulo: string
  formato: string
  tipoConteudo: string
  roteiro: string
  briefMidia: string
  cta: string
  dataPrevista: string
  status: string
  retornoEst?: number
  copy?: string
}

function extractValue(prop: any): any {
  if (!prop) return null
  switch (prop.type) {
    case 'title': return prop.title.map((t: any) => t.plain_text).join('')
    case 'rich_text': return prop.rich_text.map((t: any) => t.plain_text).join('')
    case 'select': return prop.select?.name ?? null
    case 'number': return prop.number ?? null
    case 'date': return prop.date?.start ?? null
    case 'files': return prop.files.map((f: any) => f.name)
    default: return null
  }
}

function makeTitle(text: string) {
  return { title: [{ type: 'text', text: { content: text } }] }
}

function makeRichText(text: string) {
  return { rich_text: [{ type: 'text', text: { content: text } }] }
}

function makeSelect(name: string) {
  return { select: { name } }
}

function makeDate(date: string) {
  return { date: { start: date } }
}

function makeNumber(n: number) {
  return { number: n }
}

export async function queryDatabase(filter?: {
  property: string
  value: string
}): Promise<NotionCard[]> {
  const body: any = { page_size: 100 }
  if (filter) {
    body.filter = {
      property: filter.property,
      select: { equals: filter.value },
    }
  }

  const res = await fetch(`${NOTION_API}/databases/${DATABASE_ID}/query`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Notion query error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.results.map((page: any) => ({
    id: page.id,
    headline: extractValue(page.properties.Headline) ?? '',
    categoria: extractValue(page.properties.Categoria) ?? '',
    tema: extractValue(page.properties.Tema) ?? '',
    angulo: extractValue(page.properties['Ângulo']) ?? '',
    formato: extractValue(page.properties.Formato) ?? '',
    tipoConteudo: extractValue(page.properties['Tipo Conteúdo']) ?? '',
    roteiro: extractValue(page.properties.Roteiro) ?? '',
    briefMidia: extractValue(page.properties['Brief Mídia']) ?? '',
    cta: extractValue(page.properties.CTA) ?? '',
    dataPrevista: extractValue(page.properties['Data Prevista']) ?? '',
    status: extractValue(page.properties.Status) ?? '',
    retornoEst: extractValue(page.properties['Retorno Est']) ?? undefined,
    copy: extractValue(page.properties.Copy) ?? undefined,
  }))
}

export async function createCard(properties: Record<string, any>): Promise<string> {
  const res = await fetch(`${NOTION_API}/pages`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      parent: { database_id: DATABASE_ID },
      properties,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Notion create error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.id
}

export async function updateCard(pageId: string, properties: Record<string, any>): Promise<void> {
  const res = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({ properties }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Notion update error ${res.status}: ${err}`)
  }
}

export async function addFileToCard(pageId: string, fileUrl: string, fileName: string): Promise<void> {
  const res = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({
      properties: {
        'Arte Gerada': {
          files: [{ name: fileName, type: 'external', external: { url: fileUrl } }],
        },
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Notion file upload error ${res.status}: ${err}`)
  }
}

export function cardToNotionProps(card: Partial<NotionCard> & { headline: string }) {
  const props: Record<string, any> = {
    Headline: makeTitle(card.headline),
    Status: makeSelect(card.status || 'Backlog'),
  }

  if (card.categoria) props.Categoria = makeSelect(card.categoria)
  if (card.tema) props.Tema = makeSelect(card.tema)
  if (card.angulo) props['Ângulo'] = makeRichText(card.angulo)
  if (card.formato) props.Formato = makeSelect(card.formato)
  if (card.tipoConteudo) props['Tipo Conteúdo'] = makeSelect(card.tipoConteudo)
  if (card.roteiro) props.Roteiro = makeRichText(card.roteiro)
  if (card.briefMidia) props['Brief Mídia'] = makeRichText(card.briefMidia)
  if (card.cta) props.CTA = makeRichText(card.cta)
  if (card.dataPrevista) props['Data Prevista'] = makeDate(card.dataPrevista)
  if (card.copy) props.Copy = makeRichText(card.copy)
  if (card.retornoEst !== undefined) props['Retorno Est'] = makeNumber(card.retornoEst)

  return props
}
