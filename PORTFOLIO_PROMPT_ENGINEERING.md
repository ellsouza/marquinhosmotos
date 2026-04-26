# Portfólio — Prompt Engineering (case study)

## Resumo (30 segundos)

Eu uso **prompt engineering como ferramenta de engenharia de software** para acelerar entregas em produto real, com rastreabilidade (commits pequenos), requisitos objetivos e validação (`lint`/`build`) antes de enviar.

- Projeto: **Marquinhos Motos (site)** — MVP de e-commerce (catálogo, carrinho, checkout/WhatsApp, conta/pedidos)
- Origem: inspirado em uma **loja real** (dos meus tios), com autorização para uso como referência
- Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Prisma/Postgres + Stripe (opcional)
- Produção (Vercel): `https://marquinhosmotos-qus9.vercel.app/`

> Importante: não há LLM rodando em produção. “Prompt engineering” aqui é o processo de orientar um copiloto de IA a produzir mudanças de código com qualidade (escopo, restrições, critérios de aceitação, revisão e validação).

## O problema (por que isso importa)

O app estava “funcionando”, mas tinha atritos que derrubam conversão e confiança em mobile:

- Legibilidade/contraste inconsistente (texto e botões com baixa visibilidade em alguns cenários).
- Layout com rolagem horizontal indesejada em chips de categoria.
- Pequenas quebras visuais (ícones/elementos deformando em tamanhos específicos).
- Documentação incompleta para validação por terceiros (deploy/URLs).

Meu foco foi converter feedback subjetivo (“tá ruim”) em **tarefas verificáveis** com diagnóstico e aceitação explícita.

## Entregas (com evidência)

### 1) Contraste e foco no mobile (UI/A11y pragmático)

- O que fiz: ajuste do baseline visual para evitar combinações de “texto claro em fundo claro”, e padronização de `:focus-visible` e utilitários (botões/inputs) para consistência.
- Onde: `app/globals.css`, `app/layout.tsx`, páginas de UI relacionadas.
- Evidência: commit `c5f361c`.

### 2) Categorias sem “scroll lateral” (UX em telas pequenas)

- O que fiz: removi o padrão que empurrava o layout para rolagem horizontal e reorganizei os chips para quebrar linha (`flex-wrap`) mantendo clique/legibilidade.
- Onde: `app/produtos/page.tsx`.
- Evidência: commit `c5f361c`.

### 3) Ícone do WhatsApp sem deformar (consistência visual)

- O que fiz: ajustes no SVG para manter proporção e traço consistente em diferentes containers.
- Onde: `src/components/icons/icons.tsx`.
- Evidência: commit `167c38c`.

### 4) README pronto para review (onboarding/validação)

- O que fiz: documentação do link de produção e variáveis relevantes (incluindo `NEXT_PUBLIC_SITE_URL`) para revisão rápida e reproduzibilidade.
- Onde: `README.md`.
- Evidência: commit `1bf3586`.

## Como eu aplico Prompt Engineering (método técnico)

### 1) “Especificação antes do código” (prompt como PRD curto)

Eu formato o prompt como um mini-PRD para reduzir ambiguidade:

- **Objetivo** (1 frase): o que muda e por quê
- **Escopo**: arquivos/rotas alvo
- **Restrições**: não refatorar fora do necessário; manter Tailwind; não quebrar desktop
- **Critérios de aceitação**: verificáveis (ex.: “sem overflow-x”, “foco visível no teclado”, “lint/build ok”)
- **Plano de validação**: comandos e checagens

Template:

```text
Objetivo: corrigir legibilidade e foco em mobile sem mudar layout desktop.
Escopo: app/globals.css, app/layout.tsx, app/produtos/page.tsx.
Restrições: manter Tailwind v4; evitar refator grande; não mudar API.
Aceitação: (1) sem rolagem horizontal em /produtos; (2) botões/links com foco visível; (3) npm run lint + npm run build sem erros.
Entregável: patch focado + explicação do diagnóstico (causa raiz).
```

### 2) “Prompt para diagnóstico” (causa raiz > sintomas)

Antes de aceitar uma sugestão de mudança, eu forço o copiloto a:

- levantar hipóteses de causa (CSS global, variáveis de cor, preferências do SO);
- indicar **onde** a causa se manifesta (arquivos/classes);
- propor uma correção mínima, reversível e testável.

Isso evita “pintar por cima” sem entender por que quebrou.

### 3) “Prompt para revisão” (checklist de qualidade)

Depois do patch, eu uso um prompt de revisão para:

- detectar regressões de UI/UX e acessibilidade (foco/contraste/scroll);
- garantir consistência de classes utilitárias;
- checar se a mudança não espalhou responsabilidades.

## Como eu valido (engenharia de entrega)

- Validação local: `npm run lint` e `npm run build`
- Mudanças pequenas e rastreáveis (um problema por commit quando possível)
- Mensagens de commit orientadas a valor (“fix/docs” + resultado)

## Mapa rápido para quem avalia

- UI (App Router): `app/page.tsx`, `app/produtos/*`, `app/layout.tsx`, `app/globals.css`
- API: `app/api/*/route.ts` (auth, catálogo, checkout, pedidos, etc.)
- Dados: `prisma/schema.prisma`, `prisma/seed.ts`
- Componentes: `src/components/*` (header, footer, cart, ícones)

## Próximos passos (o que eu faria com mais tempo)

- A11y: `aria-current` em navegação/categorias, e refinamento do foco no menu mobile.
- Observabilidade: logs mínimos + IDs de correlação nas rotas API.
- Pagamento: completar fluxo de webhook Stripe para status de pedido.
- Design system: extrair tokens/componentes para reduzir repetição e acelerar manutenção.
