# AGENTS.md — Guia de Comportamento da IA

## Projeto

Marketing Art Generator para **Clair de Lune** — salão de beleza em Pedra de Guaratiba, Rio de Janeiro.

**Slogan:** "Viva sua melhor fase"
**Foco:** Transformação, empoderamento e cuidado feminino.
**Modelo de negócio:** Clubes de assinatura.

---

## Stack

- React + TypeScript + Vite
- Inline styles (sem Tailwind, sem CSS Modules)
- Playwright para exportação PNG

---

## Formatos Aceitos

| Formato         | Dimensões            | Slug   |
| --------------- | -------------------- | ------ |
| Feed Instagram  | 1080 × 1350px (4:5)  | `4x5`  |
| Stories / Reels | 1080 × 1920px (9:16) | `9x16` |

**NUNCA criar formatos fora desses dois.**

---

## Identidade Visual

### Paleta

| Token     | Valor     | Uso                                             |
| --------- | --------- | ----------------------------------------------- |
| `primary` | `#FFFFFF` | fundo principal (light)                         |
| `gold`    | `#C9A96E` | acentos, logo, destaques                        |
| `rose`    | `#D4A5A5` | variação de cor de destaques, quando necessário |
| `cream`   | `#FAF6F0` | variante fundo claro                            |
| `black`   | `#000000` | texto base sobre fundo claro                    |

### Tipografia

- **Display/Headlines/CTAs:** Albert Sans
- **Textos destaque/auxiliares:** Updock

### Tom Visual

- Sofisticado, feminino, acolhedor
- Dourado como acento de luxo acessível
- Não "cor de rosa infantil" — rosa antigo, rose
- Evitar gradientes vibrantes ou neon

---

## Regras Fundamentais

### 1. NUNCA distorcer imagens

```tsx
// CORRETO
backgroundSize: 'cover'
backgroundSize: 'contain'

// ERRADO
backgroundSize: '100% 100%'
width: '100%', height: '100%' // sem object-fit
```

### 2. SEMPRE usar Safe Areas

```tsx
// Feed 4:5
top: 80, bottom: 80, left: 72, right: 72

// Story 9:16
top: 160, bottom: 200, left: 72, right: 72
```

### 3. Hierarquia visual obrigatória

Toda arte deve ter:

1. **Headline dominante**
2. **Elemento visual principal** (imagem, preço, decoração)
3. **CTA** (legível, pill shape)
4. **Logo** (Clair de Lune)

### 4. Limite de texto

- Headlines: máximo 8 palavras
- Body: máximo 2 linhas
- Sem parágrafos, sem bullets

### 5. Spacing system

Use apenas múltiplos de 8px:
`8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 96, 128`

---

## Estrutura de Componentes

```
Artboard         → canvas raiz, controla dimensões + escala
├── Background   → fundo (variant: light, dark, gold-gradient, image)
├── SafeArea     → margens obrigatórias
│   ├── Logo
│   ├── Headline / Subheadline
│   ├── PriceBlock
│   └── CTA
└── [decorações abstratas via divs inline]
```

---

## Convenções de Código

- Componentes: `PascalCase.tsx`
- Variáveis: `camelCase`
- Pastas: `kebab-case` (exceto componentes)
- Sempre tipado com TypeScript
- Props explícitas, sem any
- Estilos inline via `React.CSSProperties`
- Importar tema de `@/themes/clairDeLune`

---

## Adicionando Novas Campanhas

1. Adicionar entrada em `src/campaigns/campaigns.ts`
2. Definir `slug`, `headline`, `cta`, `format`, `theme`
3. Usar layout existente (`Feed4x5` ou `Story9x16`)
4. Testar no preview antes de exportar

---

## Exportação

```bash
# Exportar tudo
npm run export

# Exportar campanha específica
node scripts/export.js --campaign clube-escova

# Exportar formato específico
node scripts/export.js --campaign clube-escova --format 4:5
```

Saída em: `exports/4x5/` e `exports/9x16/`

---

## O que NÃO fazer

- ❌ Medidas mágicas sem contexto (`margin-top: 37px`)
- ❌ CSS acoplado ao conteúdo específico
- ❌ Misturar responsabilidade de layout com dados
- ❌ Criar novos formatos sem atualizar `dimensions.ts`
- ❌ Usar imagens sem `object-fit: cover/contain`
- ❌ Inline styles sem o tema importado
- ❌ Fonts sem fallback
- ❌ Texto sobreposto sem overlay em imagens
