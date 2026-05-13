// ============================================================
// IMAGE — Helpers de imagem
// ============================================================

/**
 * Retorna estilos CSS para imagem de fundo com object-fit: cover.
 * NUNCA distorcer imagens — regra fundamental do projeto.
 */
export function coverStyle(src: string): React.CSSProperties {
  return {
    backgroundImage: `url(${src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }
}

/**
 * Retorna estilos para imagem contida (sem corte).
 */
export function containStyle(src: string): React.CSSProperties {
  return {
    backgroundImage: `url(${src})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }
}

/**
 * Preload de imagem — garante que a imagem está carregada
 * antes do screenshot do Playwright.
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}
