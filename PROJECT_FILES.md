# Arquivos Atuais

```text
site/
├─ app/
│  ├─ api/
│  │  ├─ auth/
│  │  ├─ categories/
│  │  ├─ checkout/
│  │  ├─ me/
│  │  ├─ orders/
│  │  ├─ placeholder/
│  │  ├─ products/
│  │  └─ webhooks/stripe/
│  ├─ carrinho/
│  ├─ conta/
│  ├─ favoritos/
│  ├─ loja/
│  ├─ produtos/
│  ├─ servicos/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ public/img/
│  ├─ banner.png
│  ├─ cartaovisita.png
│  ├─ elements.png
│  ├─ favicon-32.png
│  ├─ favicon-192.png
│  ├─ favicon-512.png
│  ├─ logo.png
│  ├─ logo-cutout.png
│  ├─ logodiversificada.png
│  ├─ logopng.png
│  ├─ servicos.png
│  ├─ sitebg.png
│  └─ whatsapp_icon_no_bg.png
├─ scripts/
│  ├─ make-favicons.mjs
│  └─ make-logo-cutout.mjs
├─ src/
│  ├─ components/
│  │  ├─ cart/
│  │  ├─ favorites/
│  │  ├─ icons/
│  │  ├─ layout/
│  │  └─ store/
│  └─ lib/
├─ docker-compose.yml
├─ next.config.ts
├─ package.json
├─ README.md
└─ tsconfig.json
```

Arquivos gerados como `.next/`, `node_modules/` e `prisma/generated/` não entram aqui
porque são recriados por build, instalação ou `prisma generate`.
