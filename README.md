# Marquinhos Motos (site)

MVP de e-commerce com:
- Catálogo por categorias (abas)
- Carrinho
- Checkout (Stripe) com fallback para pedido via WhatsApp
- Cadastro/Login (sessão via cookie JWT) e página “Conta” com pedidos
- Página da loja física (endereço + mapa)

## Links

- Produção (Vercel): `https://marquinhosmotos-qus9.vercel.app/`

## Rodar localmente

1) Crie um arquivo `.env` baseado em `.env.example` e preencha:
- `DATABASE_URL` (PostgreSQL)
- `AUTH_SECRET` (string longa e aleatória)
- `MM_JWT_ISSUER` e `MM_JWT_AUDIENCE` (opcional; ajuda a endurecer o JWT)
- `NEXT_PUBLIC_*` (nome, WhatsApp, endereço, Instagram)
- `NEXT_PUBLIC_SITE_URL` (URL base do site; em produção deve ser a URL do Vercel)

2) Instale e gere o Prisma Client:

```bash
npm install
npm run prisma:generate
```

3) Rode migrações e seed (precisa do Postgres rodando):

```bash
npm run db:migrate
npm run db:seed
```

4) Suba o dev server:

```bash
npm run dev
```

Abra `http://localhost:3000` (ou a porta exibida no terminal).

## Produtos / conteúdo

- Para gerenciar produtos rapidamente: `npm run prisma:studio`
- As imagens no seed são placeholders; substitua por URLs reais (ou imagens em `public/`).

## Checkout

- Para checkout real por cartão: configure `STRIPE_SECRET_KEY` no `.env`.
- Sem Stripe configurado, o botão “Finalizar compra” redireciona para o WhatsApp com o pedido pré-preenchido.
