# Marquinhos Motos

Site de e-commerce para venda de peças de moto, com catálogo, carrinho,
favoritos, conta do cliente, pedidos e checkout online opcional.

## O que existe hoje

- Catálogo por categorias com paginação.
- Carrinho persistido no navegador.
- Favoritos persistidos no navegador.
- Checkout com validação no backend.
- Pagamento por cartão via Stripe Checkout quando `STRIPE_SECRET_KEY` está configurada.
- Fallback por Pix/WhatsApp, sem gateway, com confirmação manual pela loja.
- Webhook Stripe em `/api/webhooks/stripe` para marcar pedido como pago e baixar estoque.
- Cadastro/login com cookie HTTP-only assinado por JWT.
- Rate limit básico nas rotas sensíveis.
- Headers de segurança configurados no Next.js.

## Pagamentos

Não existe gateway online 100% gratuito para cartão: normalmente não há mensalidade,
mas há taxa por transação. A opção sem gateway no projeto é Pix/WhatsApp, em que o
cliente envia o pedido e a loja confirma o pagamento manualmente.

Para cartão online:

1. Crie uma conta Stripe.
2. Preencha `STRIPE_SECRET_KEY`.
3. Configure o webhook apontando para `/api/webhooks/stripe`.
4. Preencha `STRIPE_WEBHOOK_SECRET`.

## Rodar localmente

1. Crie um `.env` baseado em `.env.example`.
2. Instale dependências:

```bash
npm install
```

3. Gere o Prisma Client:

```bash
npm run prisma:generate
```

4. Suba o banco, aplique schema e seed:

```bash
npm run db:up
npm run db:push
npm run db:seed
```

5. Rode o site:

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Arquivos principais

- `app/page.tsx`: home.
- `app/produtos/page.tsx`: catálogo.
- `app/produtos/[slug]/page.tsx`: detalhe do produto.
- `app/carrinho/page.tsx`: carrinho e checkout.
- `app/favoritos/page.tsx`: favoritos.
- `app/conta/page.tsx`: login, cadastro e pedidos.
- `app/api/checkout/route.ts`: criação de pedido e checkout.
- `app/api/webhooks/stripe/route.ts`: confirmação de pagamento Stripe.
- `prisma/schema.prisma`: modelo do banco.
