# Export Rules

## Processo

1. `npm run dev` → Vite na porta 5173
2. `npm run export` → Playwright abre cada arte em 1:1

## URLs de preview

```
/preview?format=4:5&campaign=clube-escova
/preview?format=9:16&campaign=clube-escova-story
```

## Pixel-perfect

- Viewport = dimensão exata da arte
- `window.devicePixelRatio` deve ser 1
- Aguardar `document.fonts.ready` antes do screenshot
- Aguardar 500ms de "render extra" para garantir GPUs

## Saída

```
exports/
├── 4x5/
│   └── clube-escova.png    (1080x1350px)
└── 9x16/
    └── clube-escova.png    (1080x1920px)
```

## Naming convention

`{campaign-slug}.png`

Para variações:
`{campaign-slug}--v2.png`
`{campaign-slug}--black-friday.png`
