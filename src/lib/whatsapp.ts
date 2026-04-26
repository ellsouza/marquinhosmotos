function toWhatsAppDigits(phoneE164: string) {
  const digits = phoneE164.replace(/\D/g, "");
  return digits;
}

export function buildWhatsAppLink(phoneE164: string, message?: string) {
  const phone = toWhatsAppDigits(phoneE164);
  const base = `https://wa.me/${phone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

