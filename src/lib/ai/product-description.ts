import { z } from "zod";

export const ProductDescriptionInputSchema = z.object({
  name: z.string().min(2).max(120),
  category: z.string().min(2).max(80).optional(),
  motorcycle: z.string().min(2).max(80).optional(),
  notes: z.string().min(0).max(400).optional(),
  keywords: z.array(z.string().min(2).max(40)).max(12).optional(),
});

export type ProductDescriptionInput = z.infer<typeof ProductDescriptionInputSchema>;

export function buildProductDescriptionPrompt(input: ProductDescriptionInput) {
  const keywords = input.keywords?.length ? input.keywords.join(", ") : "";
  return [
    "Você é um redator técnico de e-commerce de peças e serviços para motos (pt-BR).",
    "",
    "Tarefa: gerar uma descrição curta e profissional para o produto abaixo.",
    "Regras:",
    "- Não invente especificações que não foram informadas.",
    "- Se faltar compatibilidade/medidas, peça confirmação de forma curta.",
    "- Escreva em pt-BR, tom objetivo, confiança e clareza.",
    "- Saída no formato:",
    "  1) 1 parágrafo (até ~360 caracteres)",
    "  2) 3 bullets de benefícios/uso (curtos)",
    "  3) 1 linha final: 'Compatibilidade: confirmar modelo/ano.' (se necessário)",
    "",
    `Produto: ${input.name}`,
    input.category ? `Categoria: ${input.category}` : null,
    input.motorcycle ? `Moto/Aplicação: ${input.motorcycle}` : null,
    keywords ? `Palavras-chave: ${keywords}` : null,
    input.notes ? `Observações do vendedor: ${input.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function templateProductDescription(input: ProductDescriptionInput) {
  const parts: string[] = [];
  parts.push(
    `${input.name}${
      input.category ? ` (${input.category})` : ""
    }: peça com instalação/uso prático para manter sua moto segura e pronta para rodar.`,
  );
  parts.push("");
  parts.push("- Encaixe e uso simples (confirme modelo/ano).");
  parts.push("- Ideal para reposição/manutenção preventiva.");
  parts.push("- Atendimento rápido e orçamento pelo WhatsApp.");
  parts.push("");
  parts.push("Compatibilidade: confirmar modelo/ano.");
  return parts.join("\n");
}

