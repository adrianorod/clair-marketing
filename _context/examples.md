# examples.md — Exemplos de Geração de Campanhas

Este arquivo serve como referência de como a IA deve gerar novas campanhas ou componentes de layout mantendo o padrão do Clair de Lune.

## Exemplo 1: Adicionar Nova Campanha no JSON

**Input do Usuário:**
"Crie uma campanha de Dia dos Namorados focada em casais que querem relaxar juntos. Use formato 4:5 e adicione uma foto bonita de casal num spa."

**Ação da IA:**
Adicionar o seguinte objeto no arquivo `src/campaigns/campaigns.ts`:

```typescript
  {
    slug: 'dia-dos-namorados-spa',
    name: 'Dia dos Namorados Spa',
    format: '4:5',
    headline: 'Conexão e relaxamento.',
    subheadline: 'Pacote Especial para Casais',
    price: 'R$ 490',
    priceSuffix: '/casal',
    cta: 'Presenteie seu amor',
    badge: 'DIA DOS NAMORADOS',
    theme: 'light',
    backgroundImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80',
    tags: ['sazonal', 'namorados', 'spa', 'casal'],
  }
```

## Exemplo 2: Criar Layout Reutilizável com Imagem Dinâmica

**Input:**
"Crie um componente decorativo que possa ser adicionado a um layout para exibir uma badge flutuante de desconto."

**Ação da IA (Criação de Componente):**

```tsx
import React from 'react'
import { clairDeLune as theme } from '@/themes/clairDeLune'

interface FloatingBadgeProps {
  text: string
  top?: number | string
  right?: number | string
}

export function FloatingBadge({ text, top = -20, right = -20 }: FloatingBadgeProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        right,
        background: theme.colors.rose,
        color: theme.colors.white,
        fontFamily: theme.typography.fontDisplay,
        fontSize: theme.typography.sizes.xs,
        fontWeight: theme.typography.weights.bold,
        padding: '12px 24px',
        borderRadius: theme.radii.pill,
        transform: 'rotate(15deg)',
        boxShadow: theme.shadows.medium,
      }}
    >
      {text}
    </div>
  )
}
```

## Resumo de Comportamentos Desejados

- Sempre usar `theme.colors`, `theme.typography`, `theme.spacing`.
- Sempre usar múltiplos de 8 para `gap`, `padding` ou dimensões fixas caso não use o theme.spacing.
- Textos devem ser curtos; a IA deve reescrever propostas longas do usuário para manter o impacto (headlines de até 8 palavras).
