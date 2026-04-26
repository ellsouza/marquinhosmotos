import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case — Prompt Engineering | Marquinhos Motos",
  description:
    "Case study: como eu usei prompt engineering (IA como copiloto) para acelerar melhorias reais de UI/UX e entrega com qualidade.",
};

export default function PortfolioPromptEngineeringPage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-black/10 bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />
        <div className="relative space-y-5 p-6 sm:p-8">
          <div className="text-xs font-semibold tracking-wide text-white/70">
            CASE STUDY • PROMPT ENGINEERING
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Prompt engineering aplicado à engenharia de software
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-white/80">
            Eu uso IA como copiloto para transformar feedback subjetivo em
            tarefas verificáveis, fazer diagnóstico (causa raiz) e entregar
            patches pequenos, rastreáveis e validados por lint/build.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="https://github.com/ellsouza/marquinhosmotos"
              target="_blank"
              rel="noreferrer"
              className="mm-btn mm-btn-primary"
            >
              Ver repositório
            </a>
            <a
              href="https://marquinhosmotos-qus9.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="mm-btn mm-btn-ghost-light"
            >
              Ver demo
            </a>
            <a
              href="https://github.com/ellsouza/marquinhosmotos/blob/main/PORTFOLIO_PROMPT_ENGINEERING.md"
              target="_blank"
              rel="noreferrer"
              className="mm-btn mm-btn-ghost-light"
            >
              Ler case completo
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold tracking-tight">
            Entregas (evidência em commits)
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-black/70">
            <li>
              <span className="font-semibold text-black">UI mobile:</span>{" "}
              contraste + foco visível + utilitários de botão/input (commit{" "}
              <code className="font-mono text-xs">c5f361c</code>)
            </li>
            <li>
              <span className="font-semibold text-black">UX:</span> chips de
              categoria sem rolagem horizontal (commit{" "}
              <code className="font-mono text-xs">c5f361c</code>)
            </li>
            <li>
              <span className="font-semibold text-black">Iconografia:</span>{" "}
              WhatsApp SVG consistente (commit{" "}
              <code className="font-mono text-xs">167c38c</code>)
            </li>
            <li>
              <span className="font-semibold text-black">Docs:</span> README com
              link de produção e env vars (commit{" "}
              <code className="font-mono text-xs">1bf3586</code>)
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold tracking-tight">
            Como eu “prompto” (framework)
          </h2>
          <div className="mt-3 space-y-3 text-sm text-black/70">
            <p>
              Prompt ≈ mini-PRD: objetivo, escopo, restrições, critérios de
              aceitação e validação.
            </p>
            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4 font-mono text-xs text-black/80">
              <div>Objetivo: corrigir bug + explicar causa raiz.</div>
              <div>Escopo: arquivos/rotas alvo.</div>
              <div>Restrições: mudança mínima, sem refator grande.</div>
              <div>Aceitação: comportamento observável + lint/build.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="text-base font-semibold tracking-tight">
            Checklist de entrega (qualidade)
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-black/70">
            <li>Patch mínimo e reversível (evita refator fora do escopo).</li>
            <li>
              Critério de aceitação observável (ex.: sem scroll-x, foco visível).
            </li>
            <li>
              Validação: <code className="font-mono text-xs">npm run lint</code>{" "}
              e <code className="font-mono text-xs">npm run build</code>.
            </li>
            <li>Commit pequeno e descritivo (rastreabilidade para review).</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold tracking-tight">
            Skills evidenciadas
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-black/70">
            <li>Debug de CSS (variáveis, contraste, estados).</li>
            <li>Next.js App Router + React 19.</li>
            <li>UX mobile (layout, overflow, legibilidade).</li>
            <li>Prompt engineering (spec → patch → review).</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold tracking-tight">Navegação</h2>
        <p className="mt-2 text-sm text-black/70">
          Este case faz parte do site do projeto. Se quiser ver o produto em
          contexto:
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/" className="mm-btn mm-btn-ghost">
            Ir para o site
          </Link>
          <Link href="/produtos" className="mm-btn mm-btn-ghost">
            Ver produtos
          </Link>
          <Link href="/ai/descricao" className="mm-btn mm-btn-ghost">
            Ver feature IA
          </Link>
        </div>
      </section>
    </div>
  );
}
