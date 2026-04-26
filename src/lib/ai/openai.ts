type ResponsesCreateBody = {
  model: string;
  input: string;
  max_output_tokens?: number;
};

export function extractOutputText(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const anyData = data as Record<string, unknown>;
  if (typeof anyData.output_text === "string") return anyData.output_text;

  const output = anyData.output;
  if (!Array.isArray(output)) return null;

  const chunks: string[] = [];
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as Record<string, unknown>).content;
    if (!Array.isArray(content)) continue;
    for (const c of content) {
      if (!c || typeof c !== "object") continue;
      const type = (c as Record<string, unknown>).type;
      const text = (c as Record<string, unknown>).text;
      if (
        (type === "output_text" || type === "text" || typeof type !== "string") &&
        typeof text === "string"
      ) {
        chunks.push(text);
      }
    }
  }
  const joined = chunks.join("\n").trim();
  return joined ? joined : null;
}

export async function createResponseText(input: {
  apiKey: string;
  model: string;
  prompt: string;
  maxOutputTokens?: number;
}) {
  const body: ResponsesCreateBody = {
    model: input.model,
    input: input.prompt,
    ...(typeof input.maxOutputTokens === "number"
      ? { max_output_tokens: input.maxOutputTokens }
      : {}),
  };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => null)) as unknown;
  const text = extractOutputText(data);

  if (!res.ok) {
    const message =
      (data &&
        typeof data === "object" &&
        typeof (data as Record<string, unknown>).error === "object" &&
        (data as Record<string, unknown>).error &&
        typeof ((data as Record<string, unknown>).error as Record<string, unknown>).message ===
          "string" &&
        (((data as Record<string, unknown>).error as Record<string, unknown>).message as string)) ||
      "Falha ao gerar texto.";
    return { ok: false as const, error: message };
  }

  if (!text) return { ok: false as const, error: "Resposta vazia do modelo." };
  return { ok: true as const, text };
}

