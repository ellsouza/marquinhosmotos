# Portfólio — Engenharia de Prompt (case study)

Projeto: **Marquinhos Motos (site)**  
Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Prisma/Postgres + Stripe (opcional)  
Produção (Vercel): `https://marquinhosmotos-qus9.vercel.app/`

## Contexto

O objetivo foi acelerar entregas de produto usando IA como “copiloto” para:
- Diagnosticar problemas reais de UI/UX em mobile (contraste, legibilidade, botões “sumindo”, overflow).
- Converter feedback subjetivo (“tá terrível”) em **tarefas verificáveis**.
- Manter qualidade de engenharia (lint/build passando, mudanças focadas, sem regressão).

> Observação: o app **não** integra LLM/IA no runtime. A “engenharia de prompt” aqui é o processo de orientar a IA a produzir mudanças de código com qualidade e rastreabilidade.

## Tarefas e resultados (o que foi entregue)

### 1) Legibilidade no mobile (contraste / cores)

**Problema observado**
- No mobile, textos/botões ficavam com **texto claro em fundo claro** e só “apareciam” ao tocar.

**Causa raiz (diagnóstico)**
- CSS global alternava variáveis para “dark mode” via `prefers-color-scheme: dark`, mas várias telas usam fundos claros (`bg-zinc-50`, `bg-white`).  
  Resultado: `--foreground` claro + fundo claro = baixa visibilidade.

**Correção implementada**
- Removi a troca automática para dark em `app/globals.css` e forcei `color-scheme: light`.
- Padronizei estados de foco (`:focus-visible`) em botões/links e criei estilos reutilizáveis:
  - `.mm-btn-ghost` (classe era usada, mas não existia)
  - `.mm-input` (inputs mais consistentes e legíveis)

**Evidência**
- Commit: `c5f361c`
- Verificação: `npm run lint` + `npm run build` (passando no ambiente local)

### 2) UX no mobile (chips de categoria sem “scroll lateral”)

**Problema observado**
- Lista de categorias em `/produtos` criava rolagem lateral e “deformava” o layout.

**Correção implementada**
- Troquei a barra com `overflow-x-auto` por `flex-wrap` (chips quebram linha e ficam dentro da tela).
- Ajustei tipografia no mobile (tamanho menor e `leading-tight`) para nomes longos.

**Evidência**
- Alteração: `app/produtos/page.tsx`

### 3) Ícone do WhatsApp deformado

**Problema observado**
- Em alguns tamanhos/containers, o ícone do WhatsApp parecia “torto”/deformado.

**Correção implementada**
- Ajustei o SVG para manter proporção e traço consistente:
  - `preserveAspectRatio="xMidYMid meet"`
  - `vectorEffect="non-scaling-stroke"`

**Evidência**
- Commit: `167c38c`
- Arquivo: `src/components/icons/icons.tsx`

### 4) Documentação (README apontando a URL correta)

**Problema observado**
- README não trazia a URL de produção (Vercel), o que atrapalha validação por terceiros.

**Correção implementada**
- Adicionei seção “Links” com a URL do deploy.
- Documentei `NEXT_PUBLIC_SITE_URL` e ajustei instruções do checkout para refletir o estado atual.

**Evidência**
- Commit: `1bf3586`
- Arquivo: `README.md`

## Como eu usei Engenharia de Prompt (método)

### A) Transformar feedback em requisitos objetivos

Exemplos de “tradução”:
- “Não aparece a escrita do botão no mobile” → “Garantir contraste AA para texto/botões em telas claras e em devices com `prefers-color-scheme: dark`”.
- “Rolagem de itens não é legal” → “Remover overflow horizontal e manter categorias clicáveis dentro da viewport”.

### B) Propor prompts com restrições claras

Estrutura de prompt que funcionou bem:
- **Objetivo**: o que precisa mudar
- **Restrições**: não quebrar desktop, manter Tailwind, evitar refator grande
- **Critério de aceitação**: comportamento observável (sem scroll-x; texto legível; foco visível; lint/build ok)
- **Escopo**: arquivos/componentes alvo

### C) Validar e versionar (rastreabilidade)

Checklist aplicado:
- Lint: `npm run lint`
- Build: `npm run build`
- Commits pequenos e descritivos (cada problema com um commit quando possível)
- Mensagens de commit focadas em “valor entregue” (fix/docs)

## Mapa do projeto (para reviewers)

**UI (App Router)**
- `app/page.tsx` (home)
- `app/produtos/page.tsx` e `app/produtos/[slug]/page.tsx`
- `app/carrinho/page.tsx`
- `app/loja/page.tsx`
- `app/conta/page.tsx`
- `app/layout.tsx` e `app/globals.css`

**API**
- `app/api/*/route.ts` (auth, catálogo, checkout, pedidos, placeholder SVG)

**Domínio/infra**
- `prisma/schema.prisma` + `prisma/seed.ts`
- `src/lib/*` (auth/JWT, catálogo demo vs DB, db/prisma, rate-limit, whatsapp link)

## Próximos passos (ideias para evolução)

- A11y: adicionar estados `aria-current` nas categorias e refinamento de foco no menu mobile.
- Observabilidade: logs mínimos e IDs de correlação nas rotas API.
- Stripe: implementar webhook e atualizar status do pedido (`PAID`) automaticamente.
- Design system: extrair tokens e componentes UI (botões/inputs/cards) para reduzir repetição.

