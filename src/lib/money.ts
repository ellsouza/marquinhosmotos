export function formatBRL(valueCents: number) {
  const value = valueCents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

