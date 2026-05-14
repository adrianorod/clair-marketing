// ============================================================
// PREVIEW — Interface de preview das artes
// ============================================================

import { useState } from 'react'
import { Artboard } from '@/components/Artboard'
import { Feed4x5 } from '@/layouts/Feed4x5'
import { Story9x16 } from '@/layouts/Story9x16'
import { campaigns } from '@/campaigns/campaigns'
import type { ArtFormat } from '@/utils/dimensions'
import { FORMATS } from '@/utils/dimensions'
import { clairDeLune as theme } from '@/themes/clairDeLune'

export function Preview() {
  const searchParams = new URLSearchParams(window.location.search)
  const exportMode = searchParams.get('export') === 'true'
  const defaultCampaign = searchParams.get('campaign') || campaigns[0].slug
  const defaultFormat = (searchParams.get('format') as ArtFormat) || '4:5'

  const [selectedCampaign, setSelectedCampaign] = useState(defaultCampaign)
  const [previewFormat, setPreviewFormat] = useState<ArtFormat>(defaultFormat)
  const [debug, setDebug] = useState(false)

  const campaign = campaigns.find((c) => c.slug === selectedCampaign) ?? campaigns[0]

  const renderLayout = () => {
    if (previewFormat === '4:5') {
      return <Feed4x5 campaign={campaign} />
    }
    return <Story9x16 campaign={campaign} />
  }

  // Dimensões da arte para exibir no UI
  const dims = FORMATS[previewFormat]

  if (exportMode) {
    return (
      <div style={{ margin: 0, padding: 0, overflow: 'hidden', width: dims.width, height: dims.height }}>
        <Artboard format={previewFormat} fullResolution>
          {renderLayout()}
        </Artboard>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0F0F1A',
        color: '#fff',
        fontFamily: theme.typography.fontDisplay,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid rgba(201,169,110,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Ícone lua */}
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path
              d="M18 6C12.477 6 8 10.477 8 16C8 21.523 12.477 26 18 26C21.5 26 24.59 24.27 26.45 21.6C25.09 22.17 23.59 22.5 22 22.5C16.753 22.5 12.5 18.247 12.5 13C12.5 10.47 13.49 8.17 15.1 6.46C16.05 6.16 17.01 6 18 6Z"
              fill={theme.colors.gold}
            />
          </svg>
          <span
            style={{
              fontFamily: theme.typography.fontDisplay,
              fontSize: 20,
              fontWeight: 700,
              color: theme.colors.white,
              fontStyle: 'italic',
            }}
          >
            Marketing Art Generator
          </span>
          <span
            style={{
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: theme.colors.gold,
              opacity: 0.7,
              paddingTop: 2,
            }}
          >
            Clair de Lune
          </span>
        </div>

        {/* Controles */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Seletor de campanha */}
          <select
            value={selectedCampaign}
            onChange={(e) => {
              const c = campaigns.find((x) => x.slug === e.target.value)
              if (c) {
                setSelectedCampaign(c.slug)
                setPreviewFormat(c.format)
              }
            }}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(201,169,110,0.3)',
              color: '#fff',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {campaigns.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Toggle de formato */}
          <div style={{ display: 'flex', gap: 4 }}>
            {(['4:5', '9:16'] as ArtFormat[]).map((f) => (
              <button
                key={f}
                onClick={() => setPreviewFormat(f)}
                style={{
                  background: previewFormat === f ? theme.colors.gold : 'rgba(255,255,255,0.08)',
                  color: previewFormat === f ? theme.colors.black : '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Debug toggle */}
          <button
            onClick={() => setDebug(!debug)}
            style={{
              background: debug ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.05)',
              color: debug ? theme.colors.gold : theme.colors.muted,
              border: `1px solid ${debug ? theme.colors.gold : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {debug ? '● Safe Areas' : '○ Safe Areas'}
          </button>
        </div>
      </header>

      {/* Canvas area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          gap: 24,
          flexDirection: 'column',
        }}
      >
        {/* Info do formato */}
        <div
          style={{
            fontSize: 12,
            color: theme.colors.muted,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {FORMATS[previewFormat].label} — {dims.width} × {dims.height}px
        </div>

        {/* Arte */}
        <div
          style={{
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <Artboard format={previewFormat}>
            {renderLayout()}
          </Artboard>
        </div>
      </main>
    </div>
  )
}
