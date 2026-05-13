# Layout Rules

## Safe Areas

Feed 4:5 (1080x1350):
- top: 80px
- bottom: 80px
- left: 72px
- right: 72px

Story 9:16 (1080x1920):
- top: 160px  ← interface Instagram
- bottom: 200px ← swipe up / botão
- left: 72px
- right: 72px

## Hierarquia de Z-index

```
0: Background (imagem/cor)
1: Overlay (quando há imagem)
2: Decorações (círculos, linhas)
3: SafeArea content
4: Logo (sempre visível)
```

## Regras de composição

- Feed 4:5: layout vertical, 3 zonas (topo / centro / rodapé)
- Story 9:16: layout centralizado, mais padding vertical

## Fontes em px (canvas 1080px)

| Nome | px | Uso |
|------|----|-----|
| xs | 24 | labels, badges |
| sm | 32 | subheadlines, CTAs |
| md | 48 | headline média |
| lg | 64 | headline principal |
| xl | 80 | headline grande |
| xxl | 100 | preço destaque |
| hero | 128 | impacto máximo |
