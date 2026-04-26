"use client";

import { useMemo, useState } from "react";

type Result =
  | { ok: true; description: string; source: string; model?: string; warning?: string }
  | { ok: false; error: string; description?: string; source?: string };

export function ProductDescriptionGenerator() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [motorcycle, setMotorcycle] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const disabled = useMemo(() => loading || name.trim().length < 2, [loading, name]);

  async function submit() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/product-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category: category || undefined,
          motorcycle: motorcycle || undefined,
          notes: notes || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        setResult({
          ok: false,
          error: (data.error as string) || "Erro ao gerar descrição.",
          description: typeof data.description === "string" ? data.description : undefined,
          source: typeof data.source === "string" ? data.source : undefined,
        });
        return;
      }
      setResult({
        ok: true,
        description: String(data.description ?? ""),
        source: String(data.source ?? "unknown"),
        model: typeof data.model === "string" ? data.model : undefined,
        warning: typeof data.warning === "string" ? data.warning : undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!result || !("description" in result) || !result.description) return;
    await navigator.clipboard.writeText(result.description);
    alert("Copiado!");
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-base font-semibold tracking-tight">
            Gerador de descrição (IA)
          </h2>
          <p className="text-sm text-black/70">
            Digite o básico e gere uma descrição pronta para o catálogo.
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mm-input w-full"
            placeholder="Nome do produto (ex: Pastilha de freio dianteira)"
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mm-input w-full"
            placeholder="Categoria (opcional)"
          />
          <input
            value={motorcycle}
            onChange={(e) => setMotorcycle(e.target.value)}
            className="mm-input w-full"
            placeholder="Moto/aplicação (opcional — ex: Fan 160 2021)"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mm-input w-full min-h-[110px]"
            placeholder="Observações (opcional — material, marca, compatibilidade, etc.)"
          />

          <button
            type="button"
            disabled={disabled}
            onClick={() => submit().catch(() => {})}
            className="mm-btn mm-btn-primary w-full"
          >
            {loading ? "Gerando..." : "Gerar descrição"}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="text-base font-semibold tracking-tight">Resultado</div>
            <div className="text-sm text-black/70">
              {result?.ok
                ? `Fonte: ${result.source}${result.model ? ` • Modelo: ${result.model}` : ""}`
                : "Pronto para copiar e colar no catálogo."}
            </div>
          </div>
          <button
            type="button"
            onClick={() => copy().catch(() => {})}
            className="mm-btn mm-btn-ghost"
            disabled={!result || !("description" in result) || !result.description}
          >
            Copiar
          </button>
        </div>

        {result?.ok && result.warning ? (
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-black/70">
            {result.warning}
          </div>
        ) : null}

        {!result ? (
          <div className="mt-6 text-sm text-black/60">
            Preencha o formulário e gere uma descrição.
          </div>
        ) : result.ok ? (
          <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-black/10 bg-zinc-50 p-4 text-sm text-black/80">
            {result.description}
          </pre>
        ) : (
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-black/70">
              {result.error}
            </div>
            {result.description ? (
              <pre className="whitespace-pre-wrap rounded-2xl border border-black/10 bg-zinc-50 p-4 text-sm text-black/80">
                {result.description}
              </pre>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

