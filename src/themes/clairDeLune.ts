// ============================================================
// TEMA — Clair de Lune
// "Viva sua melhor fase"
// ============================================================

export const clairDeLune = {
  // ----------------------------------------------------------
  // PALETA
  // ----------------------------------------------------------
  colors: {
    // Primárias
    primary: '#FFFFFF',        // branco clean
    cream: '#FAF6F0',          // fundo claro / off-white quente

    // Acentos
    gold: '#C9A96E',           // dourado suave (sofisticação)
    rose: '#D4A5A5',           // rosa antigo (feminino, não infantil)

    // Neutros
    creamDark: '#EDE7DC',      // bege mais escuro
    white: '#FFFFFF',
    black: '#000000',          // texto base sobre fundo claro
    muted: '#8A8A8A',          // texto secundário

    // Overlay / transparências
    overlay: 'rgba(255, 252, 244, 0.55)',
    overlayHeavy: 'rgba(255, 212, 187, 0.8)',
  },

  // ----------------------------------------------------------
  // TIPOGRAFIA
  // ----------------------------------------------------------
  typography: {
    // Família principal — display/headlines, corpo, CTAs, labels
    // Usar via Google Fonts: Albert Sans
    fontDisplay: '"Albert Sans", sans-serif',

    // Família secundária - textos de destaques/apoio
    // Usar via Google Fonts: Updock
    fontAccent: '"Updock", cursive',

    // Escala — valores em px para o canvas 1080px
    sizes: {
      xs: 24,
      sm: 32,
      md: 48,
      lg: 64,
      xl: 80,
      xxl: 100,
      hero: 128,
    },

    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeights: {
      tight: 1.1,
      snug: 1.25,
      normal: 1.5,
    },

    letterSpacings: {
      tight: '-0.02em',
      normal: '0em',
      wide: '0.08em',
      wider: '0.16em',
    },
  },

  // ----------------------------------------------------------
  // ESPAÇAMENTO
  // Sistema de 8pt escalado para canvas 1080px
  // ----------------------------------------------------------
  spacing: {
    xs: 8,
    sm: 16,
    md: 32,
    lg: 48,
    xl: 64,
    xxl: 96,
    xxxl: 128,
  },

  // ----------------------------------------------------------
  // SAFE AREAS (px no canvas 1080px)
  // ----------------------------------------------------------
  safeArea: {
    feed: {          // 4:5 — 1080x1350
      top: 80,
      bottom: 80,
      left: 72,
      right: 72,
    },
    story: {         // 9:16 — 1080x1920
      top: 160,      // espaço para interface do Instagram
      bottom: 200,   // espaço para swipe up / botão
      left: 72,
      right: 72,
    },
  },

  // ----------------------------------------------------------
  // BORDAS & RAIOS
  // ----------------------------------------------------------
  radii: {
    sm: 4,
    md: 12,
    lg: 24,
    pill: 999,
  },

  // ----------------------------------------------------------
  // SOMBRAS
  // ----------------------------------------------------------
  shadows: {
    soft: '0 4px 24px rgba(26, 26, 46, 0.12)',
    medium: '0 8px 40px rgba(26, 26, 46, 0.24)',
    strong: '0 16px 64px rgba(26, 26, 46, 0.40)',
    gold: '0 4px 24px rgba(201, 169, 110, 0.30)',
  },
} as const

export type ClairTheme = typeof clairDeLune
