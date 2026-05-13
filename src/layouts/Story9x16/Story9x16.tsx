// ============================================================
// LAYOUT — Story / Reels 9:16 (1080x1920)
// ============================================================

import React from 'react'
import type { Campaign } from '@/campaigns/campaigns'
import { clairDeLune as theme } from '@/themes/clairDeLune'
import { Background } from '@/components/Background'
import { SafeArea } from '@/components/SafeArea'
import { Logo } from '@/components/Logo'
import { Headline, Subheadline } from '@/components/Headline'
import { PriceBlock } from '@/components/PriceBlock'
import { CTA } from '@/components/CTA'

interface Story9x16Props {
  campaign: Campaign
}

export function Story9x16({ campaign }: Story9x16Props) {
  const isDark = campaign.theme !== 'light'

  return (
    <>
      {/* Fundo */}
      <Background variant={isDark ? 'gold-gradient' : 'light'} />

      {/* Decoração: grade de pontos sutil */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(201,169,110,0.15) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }}
      />

      {/* Decoração: arco no rodapé */}
      <div
        style={{
          position: 'absolute',
          bottom: -300,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1400,
          height: 700,
          borderRadius: '50%',
          background: `rgba(26, 26, 46, 0.3)`,
          pointerEvents: 'none',
        }}
      />

      <SafeArea format="9:16">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Topo: Logo centralizada */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Logo size="lg" />

            {campaign.badge && (
              <div
                style={{
                  fontFamily: theme.typography.fontDisplay,
                  fontSize: 22,
                  fontWeight: theme.typography.weights.semibold,
                  letterSpacing: theme.typography.letterSpacings.wider,
                  color: theme.colors.primary,
                  background: theme.colors.gold,
                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 32,
                  paddingRight: 32,
                  borderRadius: theme.radii.pill,
                }}
              >
                {campaign.badge}
              </div>
            )}
          </div>

          {/* Centro: Conteúdo */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: theme.spacing.lg,
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {campaign.subheadline && (
              <Subheadline color="gold" align="center">
                {campaign.subheadline}
              </Subheadline>
            )}

            <Headline size="xl" color="white" align="center" italic>
              {campaign.headline}
            </Headline>

            {/* Divisor dourado */}
            <div
              style={{
                width: 80,
                height: 2,
                background: theme.colors.gold,
                opacity: 0.6,
              }}
            />

            {campaign.price && (
              <PriceBlock
                price={campaign.price}
                suffix={campaign.priceSuffix}
                label="por apenas"
                variant="gold"
                size="lg"
                style={{ alignItems: 'center' }}
              />
            )}
          </div>

          {/* Rodapé: CTA + Swipe hint */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: theme.spacing.md,
            }}
          >
            <CTA variant="primary" size="lg">
              {campaign.cta}
            </CTA>

            {/* Indicador de swipe */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                opacity: 0.6,
              }}
            >
              <div
                style={{
                  width: 2,
                  height: 32,
                  background: theme.colors.white,
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontFamily: theme.typography.fontDisplay,
                  fontSize: 18,
                  letterSpacing: theme.typography.letterSpacings.wider,
                  color: theme.colors.white,
                  textTransform: 'uppercase',
                }}
              >
                Arraste para cima
              </span>
            </div>
          </div>
        </div>
      </SafeArea>
    </>
  )
}
