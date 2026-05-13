# Marketing Art Generator — Clair de Lune

> Sistema de geração de artes de marketing para o salão Clair de Lune.

## Sobre

Plataforma React/TypeScript para criar artes de marketing em formatos sociais padronizados, com identidade visual consistente e exportação automatizada.

**Formatos suportados:**
- Feed Instagram: 1080 × 1350px (4:5)
- Stories / Reels: 1080 × 1920px (9:16)

## Início rápido

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` para o preview interativo.

## Exportar PNGs

```bash
# Instalar browser do Playwright (uma vez)
npx playwright install chromium

# Exportar todas as campanhas
npm run export

# Exportar campanha específica
node scripts/export.js --campaign clube-escova

# Exportar formato específico
node scripts/export.js --campaign clube-escova --format 4:5
```

Os arquivos são salvos em `exports/4x5/` e `exports/9x16/`.

## Adicionar nova campanha

1. Editar `src/campaigns/campaigns.ts`
2. Adicionar entrada com `slug`, `headline`, `cta`, `format`
3. Verificar no preview
4. Exportar

## Estrutura

```
src/
├── components/      # Blocos reutilizáveis
│   ├── Artboard/    # Canvas principal
│   ├── Background/  # Fundos
│   ├── CTA/         # Botões de ação
│   ├── Headline/    # Títulos
│   ├── Logo/        # Marca
│   ├── PriceBlock/  # Bloco de preço
│   └── SafeArea/    # Margens obrigatórias
├── layouts/         # Layouts por formato
│   ├── Feed4x5/
│   └── Story9x16/
├── themes/          # Tokens de design
├── campaigns/       # Dados das campanhas
├── pages/           # Preview UI
└── utils/           # Utilitários
```

## Documentação

- [`AGENTS.md`](./AGENTS.md) — guia para IA (Claude Code)
- [`design-brand.md`](./design-brand.md) — identidade visual
- [`_context/`](./_context/) — regras e exemplos adicionais

## Fases do projeto

- [x] **Fase 1** — Fundação (React + Vite + componentes base + preview + export)
- [ ] **Fase 2** — Sistema Visual (tokens, spacing, tipografia completa)
- [ ] **Fase 3** — Sistema de Campanhas (JSON/TS dinâmico)
- [ ] **Fase 4** — Exportação Profissional (batch automático)
- [ ] **Fase 5** — Integração com IA (AGENTS.md robusto)
- [ ] **Fase 6** — Escalabilidade (múltiplas marcas, editor visual)
