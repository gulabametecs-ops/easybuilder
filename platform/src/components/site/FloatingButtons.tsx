import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { safeHref } from "@/lib/sanitizeHtml";

export function FloatingButtons({
  phone,
  whatsapp,
  booking,
}: {
  phone?: string;
  whatsapp?: string;
  booking?: { url: string; label: string } | null; // validated Calendly / Cal.com URL
}) {
  const wa = safeHref(whatsapp || "");
  const tel = (phone || "").replace(/[^\d+]/g, "").slice(0, 20);
  return (
    <div className="fixed right-5 bottom-6 z-40 flex flex-col items-end gap-3 print:hidden">
      {booking && (
        <a
          href={booking.url}
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 pl-4 pr-5 rounded-full bg-primary hover:opacity-90 shadow-lg flex items-center gap-2 text-white text-sm font-semibold"
        >
          <CalendarCheck className="w-5 h-5" />
          {booking.label}
        </a>
      )}
      {wa && (
        <a
          href={wa}
          aria-label="WhatsApp"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center text-white transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      )}
      {tel && (
        <a
          href={`tel:${tel}`}
          aria-label="Call"
          className="w-12 h-12 rounded-full bg-secondary shadow-lg flex items-center justify-center text-white"
        >
          <Phone className="w-6 h-6" />
        </a>
      )}
    </div>
  );
}
