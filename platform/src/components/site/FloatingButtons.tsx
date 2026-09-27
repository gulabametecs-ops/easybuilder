import { MessageCircle, Phone } from "lucide-react";
import { safeHref } from "@/lib/sanitizeHtml";

export function FloatingButtons({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  const wa = safeHref(whatsapp || "");
  const tel = (phone || "").replace(/[^\d+]/g, "").slice(0, 20);
  return (
    <div className="fixed right-5 bottom-6 z-40 flex flex-col gap-3 print:hidden">
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
