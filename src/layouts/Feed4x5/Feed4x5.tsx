// ============================================================
// LAYOUT — Feed 4:5 (1080x1350)
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

interface Feed4x5Props {
  campaign: Campaign
}

export function Feed4x5({ campaign }: Feed4x5Props) {
  return (
    <>
      {/* Fundo */}
      {campaign.backgroundImage ? (
        <Background variant="image" src={campaign.backgroundImage} />
      ) : (
        <Background variant={campaign.theme === 'dark' ? 'dark-gradient' : 'light'} />
      )}

      {/* Decoração: linha dourada lateral */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: `linear-gradient(to bottom, transparent, ${theme.colors.gold}, transparent)`,
          opacity: 0.7,
        }}
      />

      {/* Decoração: círculo de luz no canto superior direito */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Safe Area com conteúdo */}
      <SafeArea format="4:5">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Topo: Logo + Badge */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Logo size="md" />

            {campaign.badge && (
              <div
                style={{
                  fontFamily: theme.typography.fontDisplay,
                  fontSize: 20,
                  fontWeight: theme.typography.weights.semibold,
                  letterSpacing: theme.typography.letterSpacings.wider,
                  color: theme.colors.primary,
                  background: theme.colors.gold,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 24,
                  paddingRight: 24,
                  borderRadius: theme.radii.pill,
                }}
              >
                {campaign.badge}
              </div>
            )}
          </div>

          {/* Centro: Conteúdo principal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            {campaign.subheadline && (
              <Subheadline color="gold">
                {campaign.subheadline}
              </Subheadline>
            )}

            <Headline size="xl" color="dark">
              {campaign.headline}
            </Headline>

            {campaign.price && (
              <PriceBlock
                price={campaign.price}
                suffix={campaign.priceSuffix}
                label="por apenas"
                variant="light"
                size="lg"
              />
            )}
          </div>

          {/* Rodapé: CTA + Slogan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            <CTA variant="gold" size="lg">
              {campaign.cta}
            </CTA>

            <span
              style={{
                fontFamily: theme.typography.fontDisplay,
                fontSize: theme.typography.sizes.xs,
                fontStyle: 'italic',
                color: theme.colors.muted,
                opacity: 0.8,
                letterSpacing: '0.02em',
              }}
            >
              Viva sua melhor fase.
            </span>
          </div>
        </div>
      </SafeArea>
    </>
  )
}
