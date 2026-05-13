# Marketing Art Generator — Vision & Implementation Guide

## Objetivo

Criar uma plataforma baseada em HTML/CSS/React para geração de artes de marketing em formatos sociais padronizados, com foco em:

- Feed Instagram (4:5 — 1080x1350)
- Stories/Reels (9:16 — 1080x1920)

O sistema deve permitir:

- reutilização máxima de layouts;
- consistência visual;
- velocidade de criação;
- exportação automatizada;
- adaptação rápida entre formatos;
- uso assistido por IA/Codex;
- evolução futura para múltiplas marcas.

---

# Motivação

Ferramentas tradicionais de design visual possuem limitações para automação:

- dificuldade de reutilização programática;
- baixa integração com IA;
- manutenção manual de múltiplas versões;
- inconsistência visual;
- exportações repetitivas.

A proposta deste projeto é transformar artes de marketing em um sistema componentizado.

Em vez de “desenhar uma arte”, a ideia é:

- montar blocos reutilizáveis;
- parametrizar campanhas;
- gerar múltiplas versões automaticamente;
- padronizar identidade visual;
- permitir geração orientada por IA.

---

# Filosofia do Projeto

## 1. Layout como código

Toda arte deve ser reproduzível por código.

Não depender de ajustes manuais em ferramentas externas.

---

## 2. Componentização

Evitar HTML “solto”.

Toda estrutura recorrente deve virar componente:

- Headline
- CTA
- Background
- PriceBlock
- Logo
- Badge
- ImageFrame
- SafeArea

---

## 3. Responsividade controlada

Não é um site tradicional responsivo.

Os formatos são conhecidos e fixos.

O sistema deve:
- adaptar layout entre formatos;
- preservar hierarquia visual;
- evitar distorções.

---

## 4. IA como copiloto

O Codex deve:
- entender regras da marca;
- seguir constraints visuais;
- gerar novas artes;
- reaproveitar padrões existentes;
- evitar “inventar moda” fora da identidade.

---

# Stack Recomendada

## Base

- React
- TypeScript
- Vite

---

## Styling

Escolha recomendada:

### Opção A — Tailwind (recomendada)

Prós:
- velocidade;
- consistência;
- ótimo para IA;
- menos CSS espalhado.

### Opção B — CSS Modules

Prós:
- mais controle visual;
- CSS mais explícito.

---

## Exportação

- Playwright
ou
- Puppeteer

Objetivo:
- renderizar artes;
- exportar PNG real em 1080px.

---

# Estrutura Inicial

```txt
marketing-art-generator/
│
├── AGENTS.md
├── design-brand.md
├── README.md
│
├── _context/
│   ├── copywriting.md
│   ├── layout-rules.md
│   ├── export-rules.md
│   ├── examples.md
│   └── prompts.md
│
├── _media/
│   ├── logos/
│   ├── backgrounds/
│   ├── products/
│   ├── references/
│   └── textures/
│
├── src/
│   ├── main.tsx
│   │
│   ├── components/
│   │   ├── Artboard/
│   │   ├── Headline/
│   │   ├── CTA/
│   │   ├── Logo/
│   │   ├── SafeArea/
│   │   ├── PriceBlock/
│   │   └── Background/
│   │
│   ├── layouts/
│   │   ├── Feed4x5/
│   │   └── Story9x16/
│   │
│   ├── themes/
│   │   └── clairDeLune.ts
│   │
│   ├── campaigns/
│   │   └── campaigns.ts
│   │
│   ├── pages/
│   │   └── Preview.tsx
│   │
│   └── utils/
│       ├── export.ts
│       ├── dimensions.ts
│       └── image.ts
│
└── exports/
    ├── 4x5/
    └── 9x16/
```

---

# Aspect Ratios Oficiais

## Feed 4:5

```ts
width: 1080
height: 1350
```

---

## Story/Reels 9:16

```ts
width: 1080
height: 1920
```

---

# Regras Fundamentais

## Nunca distorcer imagens

Sempre usar:

```css
object-fit: cover;
```

ou

```css
object-fit: contain;
```

Dependendo da proposta visual.

---

## Safe Areas

Criar margens internas obrigatórias.

Evitar:
- textos colados;
- CTAs próximos demais das bordas;
- cortes em stories.

---

## Hierarquia Visual

Toda arte deve ter:

1. headline dominante;
2. elemento visual principal;
3. CTA;
4. marca.

---

## Limite de Texto

Evitar:
- parágrafos;
- excesso de informação;
- densidade visual.

---

## Reaproveitamento

Se um bloco visual aparece 2 vezes:
→ ele deve virar componente.

---

# Sistema de Layout

## Componente Artboard

Toda arte deve ser renderizada dentro de um Artboard.

Exemplo:

```tsx
<Artboard format="4:5">
  <CampaignLayout />
</Artboard>
```

---

## Responsabilidade do Artboard

- controlar dimensões;
- controlar escala;
- centralizar preview;
- aplicar background;
- aplicar safe area;
- exportar corretamente.

---

# Estrutura de Dados

Campanhas devem ser parametrizadas.

Exemplo:

```ts
export const campaign = {
  title: "Clube de Escova",
  subtitle: "Toda semana",
  price: "R$ 99/mês",
  cta: "Assine agora",
  format: "4:5",
};
```

---

# Objetivo Futuro

Permitir geração automática:

```ts
generateCampaign({
  type: "beauty",
  objective: "subscription",
  format: "9:16",
});
```

---

# AGENTS.md

O arquivo AGENTS.md deve ensinar o comportamento esperado da IA.

Ele deve conter:

- regras de layout;
- limitações;
- identidade visual;
- proporções;
- convenções de componentes;
- regras de exportação.

---

# Design Brand

O arquivo design-brand.md deve conter:

- paleta;
- tipografia;
- tom visual;
- exemplos;
- restrições estéticas;
- referências;
- linguagem da marca.

---

# Estratégia de Implementação

# FASE 1 — Fundação

Objetivo:
Criar infraestrutura mínima.

Implementar:

- React + Vite;
- TypeScript;
- Artboard;
- formatos;
- preview;
- export simples.

Entrega esperada:
- uma arte renderizando corretamente nos dois formatos.

---

# FASE 2 — Sistema Visual

Objetivo:
Criar consistência.

Implementar:

- tokens;
- tema;
- spacing;
- tipografia;
- componentes base;
- safe areas.

Entrega esperada:
- múltiplas artes mantendo padrão visual.

---

# FASE 3 — Sistema de Campanhas

Objetivo:
Separar layout de conteúdo.

Implementar:
- campanhas via JSON/TS;
- componentes reutilizáveis;
- props dinâmicas.

Entrega esperada:
- gerar várias campanhas trocando apenas dados.

---

# FASE 4 — Exportação Profissional

Objetivo:
Exportar assets reais.

Implementar:
- Playwright/Puppeteer;
- PNG;
- automação de geração;
- export batch.

Entrega esperada:
- exportar dezenas de artes automaticamente.

---

# FASE 5 — Integração com IA

Objetivo:
Codex gerar layouts corretamente.

Implementar:
- AGENTS.md robusto;
- exemplos;
- prompts;
- padrões reutilizáveis.

Entrega esperada:
- IA conseguindo criar novas artes mantendo identidade.

---

# FASE 6 — Escalabilidade

Objetivo:
Transformar em plataforma.

Possibilidades:
- editor visual;
- múltiplas marcas;
- geração automática;
- banco de templates;
- timeline;
- animações;
- vídeo;
- geração por prompt.

---

# Regras Importantes

## Não usar medidas mágicas

Evitar:

```css
margin-top: 37px;
```

Sem contexto.

Preferir:
- spacing system;
- tokens;
- grid.

---

## Não criar CSS acoplado

Evitar CSS específico demais.

---

## Não misturar responsabilidade

Layout:
→ componente.

Conteúdo:
→ dados.

---

## Não usar imagens sem otimização

Criar pipeline:
- compressão;
- naming;
- organização.

---

# Convenções

## Componentes

```txt
PascalCase
```

Exemplo:

```txt
PriceBlock.tsx
```

---

## Variáveis

```txt
camelCase
```

---

## Pastas

```txt
kebab-case
```

---

# Objetivo Final

Construir um sistema capaz de:

- gerar artes consistentes;
- acelerar campanhas;
- reduzir retrabalho;
- permitir automação;
- funcionar perfeitamente com IA;
- escalar para múltiplos formatos e marcas.