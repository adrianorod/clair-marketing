# Notion Board — Guia do Schema

## Nome do Board

`Clair de Lune — Produção de Conteúdo`

---

## Colunas (Status)

| Coluna | Valor no DB | Descrição |
|---|---|---|
| Backlog | `Backlog` | Ideias soltas, sem compromisso |
| Plano da Semana | `Plano da Semana` | Posts definidos para a semana |
| Pronto pra Fazer | `Pronto pra Fazer` | Card com mídia anexada pelo humano |
| Em Validação | `Em Validação` | Arte gerada aguardando review |
| Done | `Done` | Post publicado |

---

## Propriedades de Cada Card

| Nome | Tipo | Opções | Obrigatório | Preenchido por |
|---|---|---|---|---|
| `Headline` | Title | — | Sim | IA |
| `Categoria` | Select | `Autoestima`, `Dicas`, `Venda`, `Bastidores` | Sim | IA |
| `Tema` | Select | *(ver abaixo)* | Sim | IA |
| `Ângulo` | Rich Text | — | Sim | IA |
| `Formato` | Select | `4:5`, `9:16` | Sim | IA |
| `Tipo Conteúdo` | Select | `Feed`, `Reels`, `Carrossel` | Sim | IA |
| `Roteiro` | Rich Text | — | Sim | IA |
| `Brief Mídia` | Rich Text | — | Sim | IA |
| `CTA` | Rich Text | — | Sim | IA |
| `Data Prevista` | Date | — | Sim | IA |
| `Copy` | Rich Text | — | Não | IA (no generate) |
| `Retorno Est` | Number | 1–5 | Não | IA |
| `Mídia` | Files | — | Não | Humano (uploads) |
| `Status` | Select | `Backlog`, `Plano da Semana`, `Pronto pra Fazer`, `Em Validação`, `Done` | Sim | IA + Humano |
| `Arte Gerada` | Files | — | Não | IA (generate-art) |

### Vocabulary de Tema (Select)

**Autoestima:** `transformação`, `antes/depois`, `depoimento-cliente`, `ritual-autocuidado`, `dia-da-mulher`, `poder-feminino`, `amor-proprio`

**Dicas:** `hidratação`, `escova-modeladora`, `cronograma-capilar`, `finalizacao`, `queda-cabelo`, `oleosidade`, `quimica`, `coloracao`

**Venda:** `clube-escova`, `clube-hidratacao`, `combo-verao`, `gift-card`, `promocao-black-friday`, `pacote-noivas`, `vale-presente`

**Bastidores:** `dia-no-salao`, `equipe`, `preparacao`, `antes-da-transformacao`, `bastidores-evento`, `making-of`

---

## Convenções de Nomenclatura

- Headline: máx 8 palavras, sem emojis
- Categoria: usar os valores do select (case-sensitive)
- Datas: formato ISO (`YYYY-MM-DD`)

---

## Como Criar o Board

1. Criar database vazia no Notion com nome `Clair de Lune — Produção de Conteúdo`
2. Adicionar colunas como "Status" (Select) com os 5 valores
3. Adicionar cada propriedade listada acima
4. Convidar a integração (token) para o board
5. Copiar o Database ID da URL: `https://www.notion.so/workspace/DB_ID?v=...`
6. Configurar `NOTION_DATABASE_ID` no GitHub Secrets
