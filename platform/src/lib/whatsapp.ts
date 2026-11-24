// WhatsApp click-to-chat helpers (client-safe).

/** Digits of the number in a wa.me / api.whatsapp.com link ("" when none). */
export function waNumber(link?: string | null): string {
  const m = (link ?? "").match(/(?:wa\.me\/|phone=)\+?(\d{10,15})/);
  return m?.[1] ?? "";
}

export function waLink(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
