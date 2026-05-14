# Plano de Evolução — Fase 6: Content Operations Workflow

> Substitui a "Fase 6 — Escalabilidade" original.  
> Foco: operacionalizar a produção de conteúdo com IA + Notion + GitHub Actions.

---

## Visão Geral

Criar um sistema semi-automatizado onde:

1. **IA (via GitHub Actions)** planeja semanticamente a semana de posts
2. **Notion** funciona como o board de produção (visão humana)
3. **Humano** enriquece cards com fotos, vídeos e descrições
4. **GitHub Actions periódico** detecta cards prontos e gera as artes
5. **Humano** valida, ajusta e publica

**Fluxo principal:**

```
IA planeja → Plano da Semana → Humano enriquece → Pronto pra Fazer
→ IA gera arte → Em Validação → Humano aprova → Done
```

O generator de artes (fases 1-5) vira o braço de execução visual; este plano é o cérebro de planejamento e operação.

---

## Stack Adicional

| Ferramenta       | Função                                   |
| ---------------- | ---------------------------------------- |
| Notion API       | Board de produção (CRUD de cards)        |
| GitHub Actions   | Gatilho semanal + rotinas auxiliares     |
| OpenAI / Claude  | Geração de planejamento e copywriting    |
| scripts/plan.ts  | Lógica de planejamento (Node + TS)       |

---

## Estrutura do Board (Notion)

### Colunas (Pipeline)

| Coluna              | O que entra                                              | Quem move                      |
| ------------------- | -------------------------------------------------------- | ------------------------------ |
| **Backlog**         | Ideias soltas, temas avulsos, referências                | Humano + IA                    |
| **Plano da Semana** | Cards priorizados para a semana vigente                  | IA (weekly-plan)               |
| **Pronto pra Fazer**| Card enriquecido pelo humano: +fotos, +vídeos, +descrição| Humano (move de Plano p/ cá)   |
| **Em Validação**    | Arte gerada pela IA aguardando review humano             | IA (generate-art, após detectar)|
| **Done**            | Post publicado na rede social                            | Humano                         |

### Propriedades de cada Card

| Propriedade     | Tipo         | Descrição                                      |
| --------------- | ------------ | ---------------------------------------------- |
| `Categoria`     | Select       | `Autoestima`, `Dicas`, `Venda`, `Bastidores`   |
| `Formato`       | Select       | `4:5`, `9:16`                                  |
| `Headline`      | Text         | Título do post (máx 8 palavras)                |
| `Roteiro`       | Text         | Descrição do que deve ser feito                |
| `Mídia`         | Files        | Assets necessários (foto, vídeo, textura)      |
| `Status`        | Select       | Mapeado para a coluna atual                    |
| `Data Prevista` | Date         | Quando deve ir ao ar                           |
| `Sazonalidade`  | Text         | Ex: "Dia das Mães", "Baixa temporada (março)" |
| `Copy`          | Text         | Texto final da legenda                         |
| `Retorno Est`   | Number       | Estimativa de retorno financeiro (1-5)         |

---

## Mix de Conteúdo (Distribuição Alvo)

| Categoria                       | %     | Objetivo                                  |
| ------------------------------- | ----- | ----------------------------------------- |
| Autoestima e Inspiração         | 35%   | Engajamento, autoridade emocional         |
| Dicas e Educação Capilar        | 25%   | Autoridade técnica, tráfego               |
| Venda Direta (Serviços/Combos)  | 20%   | Conversão direta, retorno financeiro      |
| Bastidores e Experiência        | 20%   | Prova social, conexão humana              |

---

## Antirrepetição — Memória de Conteúdo

### O Problema

Sem histórico explícito, a IA repete:
- Mesmos tipos de headline ("Transforme seu visual", "Seu cabelo merece")
- Mesmos ângulos de conteúdo (toda dica é "hidratação", toda venda é "clube de escova")
- Mesmos briefs de mídia (close do cabelo, mão segurando produto)

### Solução: Histórico Estruturado + Prompt com Memória

O `weekly-plan` deve consultar o que já foi publicado e forçar diversidade.

#### Fonte de Histórico

| Fonte | Conteúdo | Como acessar |
|---|---|---|
| Coluna **Done** no Notion | Todos os posts já publicados | `notion.query({ status: "Done" })` |
| Propriedade `Headline` | Headline de cada post | Campo texto no card |
| Propriedade `Categoria` | Bucket do conteúdo | Select no card |
| Propriedade `Tema` | Tema específico (ex: "escova modeladora", "autoestima pós-transformacao") | Select no card |
| `Data Prevista` | Quando foi ao ar | Date no card |

> Incluir propriedade `Tema` no board — campo Select controlado com temas recorrentes. Quando um post vai para Done, o humano marca o tema. Isso vira um vocabulário controlado.

#### Script `scripts/history.ts`

```typescript
interface HistoryEntry {
  headline: string
  categoria: string
  tema: string
  data: string
  formato: string
}

async function getRecentHistory(notion: NotionClient, weeks: number): Promise<{
  entries: HistoryEntry[]
  temasUsados: string[]           // temas já explorados no período
  headlinhasUsadas: string[]      // para evitar repetição literal
  ultimosTemasPorCategoria: Record<string, string[]>  // últimos 3 temas de cada bucket
}> {
  const done = await notion.query({
    status: "Done",
    dateRange: { lastWeeks: weeks }
  })
  return {
    entries: done.map(toHistoryEntry),
    temasUsados: [...new Set(done.map(d => d.tema))],
    headlinhasUsadas: done.map(d => d.headline.toLowerCase()),
    ultimosTemasPorCategoria: groupBy(done, 'categoria', d => d.tema)
  }
}
```

#### Como o Prompt Usa o Histórico

O prompt do planner recebe um bloco `Histórico recente (últimas 4 semanas)`:

```
Histórico recente (últimas 4 semanas):
- Total de posts publicados: 14
- Por categoria:
  • Autoestima: 5 posts — temas: [transformação, antes/depois, depoimento]
  • Dicas: 4 posts — temas: [hidratação, escova modeladora, cronograma]
  • Venda: 3 posts — temas: [clube-escova, combo-verao, gift-card]
  • Bastidores: 2 posts — temas: [dia-no-salao, equipe]

Regras de diversidade:
- NENHUMA headline nova pode repetir headline das últimas 4 semanas
- Dentro de cada categoria, NÃO repetir tema já usado nas últimas 4 semanas
- Se uma categoria já usou todos os temas disponíveis, sugerir novo tema inédito
- Variar ângulo: se semana passada o post de autoestima foi "depoimento",
  essa semana deve ser "ritual de autocuidado" ou "transformação visual"
- Brief de mídia não pode ser igual ao brief de posts recentes da mesma categoria
```

#### Validação Pós-Planejamento

Após a IA gerar os cards, o `planner.ts` executa validações duras:

| Validação | Falha → Ação |
|---|---|
| Headline igual a alguma das últimas 4 semanas | Rejeitar e pedir nova headline |
| Tema repetido na mesma categoria | Reatribuir tema |
| Brief de mídia muito similar (cosine similarity > 0.85) | Regerar brief |
| Distribuição fora do alvo ±5% | Rebalancear |

#### Tabela de Temas (Vocabulary Control)

Para dar à IA um vocabulário fixo de temas, evitando que ela invente temas vagos:

| Categoria | Temas Possíveis |
|---|---|
| Autoestima | transformação, antes/depois, depoimento-cliente, ritual-autocuidado, día-da-mulher, poder-feminino, amor-proprio |
| Dicas | hidratação, escova-modeladora, cronograma-capilar, finalizacao, queda-cabelo, oleosidade, quimica, coloracao |
| Venda | clube-escova, clube-hidratacao, combo-verao, gift-card, promocao-black-friday, pacote-noivas, vale-presente |
| Bastidores | dia-no-salao, equipe, preparacao, antes-da-transformacao, bastidores-evento, making-of |

#### Novas Propriedades no Card do Notion

| Propriedade | Tipo | Preenchido por |
|---|---|---|
| `Tema` | Select (vocabulário fixo) | IA + Humano |
| `Ângulo` | Text (ex: "antes/depois", "tutorial", "storytelling") | IA |

---

## Calendário Sazonal (Exemplo Base)

### Alta Temporada (foco em Venda Direta)

| Período            | Evento                    | Estratégia                       |
| ------------------ | ------------------------- | -------------------------------- |
| Jan-Fev            | Carnaval / Verão          | Combos de escova + hidratação    |
| Março              | Dia da Mulher             | Autoestima + promoção especial   |
| Abril              | Páscoa                    | Presentear-se, combos gift       |
| Maio               | Dia das Mães              | Presente para mãe, clube presente |
| Junho              | Noivas (inverno)          | Pacotes para noivas              |
| Novembro           | Black Friday              | Mega ofertas anuais              |
| Dezembro           | Natal / Ano Novo          | Looks para festas, vale-presente |

### Baixa Temporada (foco em Conteúdo + Retenção)

| Período   | Estratégia                                    |
| --------- | --------------------------------------------- |
| Julho     | Férias — dicas de manutenção em casa          |
| Agosto    | Reforço de marca, bastidores, storytelling    |
| Setembro  | Educação capilar profunda, tutoriais          |
| Outubro   | Preparação para alta (Black Friday + Natal)   |

---

## Rotina Semanal (GitHub Actions)

### Workflow: `weekly-plan.yml`

**Gatilho:** Toda segunda 08:00 BRT (`cron: 0 11 * * 1`)

**Passos:**

1. **Fetch context** — Lê `_context/` (campanhas ativas, identidade, regras)
2. **Fetch board** — Puxa cards do Backlog via Notion API
3. **Fetch sazonalidade** — Descobre datas importantes da semana via calendário embutido
4. **Fetch histórico** — Puxa últimos 30 dias de posts "Done" via `scripts/history.ts`
5. **IA planeja** — Chama LLM com prompt que inclui:
   - Distribuição dos 4 buckets
   - Sazonalidade da semana
   - Backlog disponível
   - **Histórico recente** (headlines, temas, briefs usados)
   - Regras de diversidade + vocabulário de temas
6. **Valida saída** — Script confere:
   - Headlines inéditas vs. histórico
   - Temas não repetidos na mesma categoria
   - Distribuição dentro do alvo ±5%
7. **Cria cards no Notion** — Popula coluna "Plano da Semana" com escopo completo:
   - `Headline` — título do post (máx 8 palavras)
   - `Categoria` — bucket de conteúdo
   - `Tema` — do vocabulário controlado
   - `Ângulo` — antes/depois, tutorial, storytelling...
   - `Formato` — 4:5 ou 9:16
   - `Roteiro` — descrição do que mostrar, cenário, estilo visual
   - `Brief de Mídia` — instrução explícita do que o humano precisa produzir:
     ```
     📸 Ex: "Foto em close do cabelo finalizado com escova modeladora.
     Fundo claro, luz natural, mão segurando a escova.
     Opcional: vídeo de 15s mostrando o movimento da escova no cabelo."
     ```
   - `Tipo de Conteúdo` — Select: `Feed`, `Reels`, `Carrossel`
   - `Referência` — sugestão de pose, enquadramento, cor de fundo
   - `CTA` — texto do call-to-action
   - `Data Prevista` — dia sugerido para postar
8. **Notifica** — Envia resumo da semana com os briefs para o usuário

> ⚠️ **Importante:** weekly-plan **não anexa mídia real**. O card chega em "Plano da Semana" com escopo claro para o humano saber exatamente o que produzir. O humano adiciona as fotos/vídeos seguindo o brief e move para "Pronto pra Fazer".

### Workflow: `generate-art.yml`

**Gatilho:** A cada 2 horas (`cron: 0 */2 * * *`) + `workflow_dispatch` manual

**Objetivo:** Detectar cards em "Pronto pra Fazer" que estão completos e gerar a arte automaticamente.

**Passos:**

1. **Fetch board** — Puxa todos os cards da coluna "Pronto pra Fazer"
2. **Filtrar completos** — Verifica se card tem: headline, mídia anexada, roteiro preenchido, formato definido
3. **IA gera arte** — Para cada card completo:
   - Lê headline, categoria, roteiro, mídia
   - Cria campanha em `src/campaigns/campaigns.ts`
   - Executa export → gera PNG
4. **Anexa arte ao card** — Faz upload do PNG gerado como anexo no Notion
5. **Move para "Em Validação"** — Atualiza status no board
6. **Notifica** — Alerta o usuário que há artes aguardando validação

---

## Prompt de Planejamento Semanal (Estrutura)

```
Contexto:
- Semana: [DATA_INICIO] a [DATA_FIM]
- Sazonalidade: [EVENTOS/BAIXA_ALTA]
- Backlog disponível: [LISTA_DE_IDEIAS]
- Campanhas ativas: [LISTA]

Histórico recente (últimas 4 semanas):
- Total de posts: [N]
- Por categoria:
  • Autoestima: [N] posts — temas: [LISTA]
  • Dicas: [N] posts — temas: [LISTA]
  • Venda: [N] posts — temas: [LISTA]
  • Bastidores: [N] posts — temas: [LISTA]
- Headlines usadas: [LISTA]
- Últimos briefs de mídia: [LISTA_RESUMIDA]

Regras:
- Distribuir [N] posts nos 4 buckets:
  • Autoestima: [35%] → [N*0.35] posts
  • Dicas:      [25%] → [N*0.25] posts
  • Venda:      [20%] → [N*0.20] posts
  • Bastidores: [20%] → [N*0.20] posts
- Se for alta temporada: priorizar bucket Venda (pode ir até 35%)
- Se for baixa temporada: priorizar Autoestima + Dicas
- Headline: máx 8 palavras, tom sofisticado, sem emojis
- Sugerir formato ideal (4:5 para feed, 9:16 para reels/stories)
- Cada post deve ter call-to-action alinhado ao objetivo
- Para cada card, GERAR UM BRIEF DE MÍDIA detalhado instruindo o humano sobre o que fotografar/gravar

REGRAS DE DIVERSIDADE (OBRIGATÓRIAS):
1. NENHUMA headline pode repetir headline das últimas 4 semanas
2. NENHUM tema pode repetir tema já usado na MESMA categoria nas últimas 4 semanas
3. BRIEF de mídia não pode ser similar ao brief de posts recentes da mesma categoria
4. Variar ângulo entre semanas: se semana passada foi "antes/depois",
   essa semana usar "tutorial" ou "storytelling"
5. Temas devem vir do vocabulário controlado abaixo

Vocabulário de Temas (escolher dentro destes):
- Autoestima: transformação, antes/depois, depoimento-cliente,
  ritual-autocuidado, dia-da-mulher, poder-feminino, amor-proprio
- Dicas: hidratação, escova-modeladora, cronograma-capilar,
  finalizacao, queda-cabelo, oleosidade, quimica, coloracao
- Venda: clube-escova, clube-hidratacao, combo-verao,
  gift-card, promocao-black-friday, pacote-noivas, vale-presente
- Bastidores: dia-no-salao, equipe, preparacao,
  antes-da-transformacao, bastidores-evento, making-of

Saída esperada (JSON):
[
  {
    "categoria": "venda",
    "tema": "clube-escova",
    "angulo": "antes/depois",
    "headline": "Assine seu clube de escova hoje",
    "formato": "4:5",
    "roteiro": "Foto de antes/depois + badge preço + CTA 'Assine'",
    "cta": "Garanta seu look",
    "dataPrevista": "2026-05-18",
    "briefMidia": "Foto em close do cabelo finalizado com escova modeladora. Fundo claro, luz natural. Opcional: vídeo 15s mostrando movimento da escova no cabelo.",
    "tipoConteudo": "Feed"
  }
]
```

---

## Script de Planejamento (`scripts/planner.ts`)

```typescript
interface WeeklyPlanInput {
  weekStart: string
  weekEnd: string
  seasonality: 'alta' | 'baixa' | 'normal'
  events: string[]
  backlog: BacklogCard[]
  activeCampaigns: string[]
  history: RecentHistory     // nova: histórico de posts publicados
}

interface RecentHistory {
  totalPosts: number
  postsPorCategoria: Record<string, { count: number; temas: string[] }>
  headlinhasUsadas: string[]
  ultimosBriefs: string[]
}

interface WeeklyPlanOutput {
  posts: {
    categoria: string
    tema: string              // do vocabulário controlado
    angulo: string            // "antes/depois" | "tutorial" | "storytelling" | ...
    headline: string
    formato: string
    roteiro: string
    cta: string
    dataPrevista: string
    briefMidia: string
    tipoConteudo: 'Feed' | 'Reels' | 'Carrossel'
  }[]
}

const CATEGORY_SPLIT: Record<Seasonality, Record<Category, number>> = {
  alta: { autoestima: 25, dicas: 20, venda: 35, bastidores: 20 },
  baixa: { autoestima: 40, dicas: 30, venda: 10, bastidores: 20 },
  normal: { autoestima: 35, dicas: 25, venda: 20, bastidores: 20 },
}

function buildPrompt(input: WeeklyPlanInput): string { /* ... */ }
async function callLLM(prompt: string): Promise<WeeklyPlanOutput> { /* ... */ }
async function pushToNotion(plan: WeeklyPlanOutput) { /* Notion API */ }
```

---

## Estrutura de Pastas (Novos Arquivos)

```
scripts/
├── planner.ts            # Lógica de planejamento + prompt
├── notion.ts             # Client Notion API (list, create, update cards)
├── seasonality.ts        # Calendário sazonal hardcoded
├── history.ts            # Busca posts Done e monta resumo para o prompt
└── generate-art.ts       # Gera arte a partir de card enriquecido

.github/
└── workflows/
    ├── weekly-plan.yml     # Segunda 08h — IA planeja semana
    └── generate-art.yml    # A cada 2h — detecta cards prontos e gera artes

_context/
├── content-mix.md      # Este plano de distribuição
├── seasonality.md      # Calendário completo
└── notion-guide.md     # Schema do board no Notion
```

---

## Integração com Generator Existente

Quando `generate-art.yml` detecta um card em "Pronto pra Fazer" com insumos suficientes:

1. Script lê o card: `headline`, `categoria`, `formato`, `cta`, `Mídia`
2. Mapeia para campanha → `src/campaigns/campaigns.ts`
3. Executa `npm run export --campaign <slug>`
4. Anexa asset (PNG) ao card no Notion
5. Move para "Em Validação"

---

## Implementação (Ordem Recomendada)

### Etapa 1 — Setup Notion

- Criar board manualmente com as 5 colunas
- Configurar integração Notion API (token interno)
- Criar `scripts/notion.ts` com client básico (CRUD)
- Salvar schema em `_context/notion-guide.md`

### Etapa 2 — Calendário Sazonal

- Hardcodar `scripts/seasonality.ts` com feriados, alta/baixa temporada
- Função `getWeekSeasonality(date: string) → { events, seasonality }`

### Etapa 3 — Motor de Planejamento

- Criar `scripts/planner.ts` com prompt estruturado
- Chamar LLM (OpenAI ou Claude via API key no GitHub Secrets)
- Validar saída JSON
- Criar cards no Notion na coluna "Plano da Semana"

### Etapa 4 — Workflow Semanal (GitHub Actions)

- Criar `.github/workflows/weekly-plan.yml`
- Usar `workflow_dispatch` + `schedule` (cron: toda segunda 08h)
- Definir secrets: `NOTION_TOKEN`, `OPENAI_API_KEY`, `NOTION_DATABASE_ID`

### Etapa 5 — Geração Automática de Artes

- Criar `scripts/generate-art.ts`:
  - Lê card do Notion (headline, mídia, roteiro, formato)
  - Mapeia para campanha → `src/campaigns/campaigns.ts`
  - Executa `npm run export --campaign <slug>`
  - Faz upload do PNG anexado ao card no Notion
  - Move card para "Em Validação"
- Criar `.github/workflows/generate-art.yml` com cron a cada 2h

### Etapa 6 — Loop Validar + Publicar

- Feedback loop: "Em Validação" → humano revisa → se OK, move pra "Done"
- Se precisa de ajuste: humano edita card e move de volta pra "Pronto pra Fazer"

---

## GitHub Secrets Necessários

| Secret               | Descrição                     |
| -------------------- | ----------------------------- |
| `NOTION_TOKEN`       | Integration token do Notion   |
| `NOTION_DATABASE_ID` | ID do database do board       |
| `OPENAI_API_KEY`     | Para chamadas de LLM          |
| `ANTHROPIC_API_KEY`  | Alternativa / complementar    |

---

## Métricas de Sucesso

| Métrica                      | Meta         | Como medir                         |
| ---------------------------- | ------------ | ---------------------------------- |
| Cards planejados vs. publicados | >80%        | Notion: Done / Plano da Semana     |
| Mix dentro do alvo           | ±5% por bucket | Relatório semanal automático     |
| Headlines repetidas (últimos 30d) | 0%      | Script de validação no planner     |
| Temas repetidos na mesma categoria | 0%     | Script de validação no planner     |
| Tempo entre "Pronto" e "Done"| <48h         | Notion: timestamps nas colunas     |
| Retorno financeiro estimado  | aumentar 20% | Correlação posts venda × conversão |

---

## Próximos Passos Imediatos

1. [ ] Criar board Notion (5 colunas + propriedades: Headline, Brief Mídia, Categoria, Formato, Tipo Conteúdo, CTA, Data Prevista)
2. [ ] Gerar token Notion e testar `scripts/notion.ts`
3. [ ] Criar `scripts/seasonality.ts` com calendário 2026
4. [ ] Criar `scripts/planner.ts` com prompt que gera `briefMidia` em cada card
5. [ ] Testar `weekly-plan.yml` manual (`workflow_dispatch`) — verificar se os briefs estão claros
6. [ ] Criar `scripts/generate-art.ts` integrado com exportador
7. [ ] Testar `generate-art.yml` com card enriquecido manualmente
