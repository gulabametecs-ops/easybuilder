import { sanitizeHtml, safeHref } from "@/lib/sanitizeHtml";
import type { EventBlock } from "@/lib/eventContent";

export function EventStory({ blocks }: { blocks: EventBlock[] }) {
  if (!blocks.length) return null;
  return (
    <div className="space-y-8">
      {blocks.map((b, i) => {
        if (b.type === "heading" && b.text) {
          return <h2 key={i} className="text-xl font-bold">{b.text}</h2>;
        }
        if (b.type === "text" && b.text) {
          return <p key={i} className="leading-relaxed site-muted whitespace-pre-wrap">{b.text}</p>;
        }
        if (b.type === "html" && b.html) {
          return <div key={i} className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(b.html) }} />;
        }
        if (b.type === "image" && b.url) {
          const href = safeHref(b.url);
          if (!href) return null;
          return (
            <figure key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={href} alt={b.caption || ""} className="w-full rounded-xl ring-1 ring-[var(--site-line)]" />
              {b.caption && <figcaption className="text-sm site-muted mt-2">{b.caption}</figcaption>}
            </figure>
          );
        }
        if (b.type === "gallery" && b.urls.length) {
          return (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {b.urls.filter(Boolean).map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" className="w-full aspect-[4/3] object-cover rounded-xl ring-1 ring-[var(--site-line)]" />
              ))}
            </div>
          );
        }
        if (b.type === "document" && b.url) {
          const href = safeHref(b.url);
          if (!href) return null;
          return (
            <a key={i} href={href} target="_blank" rel="noreferrer" className="btn-primary inline-flex px-4 py-2 text-sm font-semibold">
              {b.label || "Download"}
            </a>
          );
        }
        if (b.type === "qr" && b.image) {
          const href = safeHref(b.image);
          if (!href) return null;
          return (
            <figure key={i} className="flex flex-col items-start gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={href} alt={b.caption || "QR"} className="w-40 h-40 rounded-xl bg-white p-2 ring-1 ring-[var(--site-line)]" />
              {b.caption && <figcaption className="text-sm site-muted">{b.caption}</figcaption>}
            </figure>
          );
        }
        return null;
      })}
    </div>
  );
}
