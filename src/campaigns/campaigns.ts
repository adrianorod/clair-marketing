// ============================================================
// CAMPANHAS — Tipos e dados
// ============================================================

import type { ArtFormat } from '@/utils/dimensions'

// ----------------------------------------------------------
// TIPOS
// ----------------------------------------------------------

export interface Campaign {
  /** Identificador único, usado no export (slug) */
  slug: string

  /** Nome da campanha para UI interna */
  name: string

  /** Formato principal da arte */
  format: ArtFormat

  // Conteúdo
  headline: string
  subheadline?: string
  body?: string
  price?: string
  priceSuffix?: string   // ex: "/mês", "por sessão"
  cta: string
  badge?: string         // ex: "PROMOÇÃO", "NOVO"

  // Visual
  backgroundImage?: string
  backgroundColor?: string
  theme?: 'dark' | 'light'

  // Metadados
  tags?: string[]
}

// ----------------------------------------------------------
// CAMPANHAS DE EXEMPLO — Clair de Lune
// ----------------------------------------------------------

export const campaigns: Campaign[] = [
  {
    slug: 'clube-escova',
    name: 'Clube de Escova',
    format: '4:5',
    headline: 'Cabelo perfeito toda semana.',
    subheadline: 'Clube de Escova',
    price: 'R$ 99',
    priceSuffix: '/mês',
    cta: 'Assine agora',
    badge: 'CLUBE',
    theme: 'dark',
    tags: ['clube', 'assinatura', 'cabelo'],
  },
  {
    slug: 'clube-escova-story',
    name: 'Clube de Escova — Story',
    format: '9:16',
    headline: 'Sua melhor fase começa aqui.',
    subheadline: 'Clube de Escova — Assine e transforme',
    price: 'R$ 99',
    priceSuffix: '/mês',
    cta: 'Arraste e assine',
    badge: 'CLUBE',
    theme: 'dark',
    tags: ['clube', 'assinatura', 'story'],
  },
  {
    slug: 'dia-das-maes',
    name: 'Dia das Mães',
    format: '4:5',
    headline: 'Para a mulher que merece tudo.',
    subheadline: 'Presentes especiais de Dia das Mães',
    cta: 'Agende agora',
    badge: 'DIA DAS MÃES',
    theme: 'light',
    tags: ['sazonal', 'presente', 'promocao'],
  },
]

/**
 * Busca campanha por slug.
 */
export function getCampaign(slug: string): Campaign | undefined {
  return campaigns.find((c) => c.slug === slug)
}
