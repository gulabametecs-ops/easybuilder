import { MessageCircle, Phone } from "lucide-react";

export function FloatingButtons({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  return (
    <div className="fixed right-5 bottom-6 z-40 flex flex-col gap-3">
      {whatsapp && (
        <a
          href={whatsapp}
          aria-label="WhatsApp"
          className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center text-white transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      )}
      {phone && (
        <a
          href={`tel:${phone}`}
          aria-label="Call"
          className="w-12 h-12 rounded-full bg-secondary shadow-lg flex items-center justify-center text-white"
        >
          <Phone className="w-6 h-6" />
        </a>
      )}
    </div>
  );
}
