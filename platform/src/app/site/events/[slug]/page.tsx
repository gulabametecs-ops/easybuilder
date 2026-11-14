import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentTenant, getSiteEventBySlug, getTenantConfig } from "@/lib/tenant";
import { Icon } from "@/components/site/Icon";
import { img } from "@/lib/img";
import { formatEventDate, mapsHref } from "@/lib/eventContent";
import { EventStory } from "@/components/site/EventStory";
import { DonateBox } from "@/components/site/DonateBox";
import { qrImageForData, upiPayLink } from "@/lib/payments";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  if (!tenant) return {};
  const { slug } = await params;
  const event = await getSiteEventBySlug(tenant.id, slug);
  if (!event) return {};
  return {
    title: `${event.title} — ${tenant.name}`,
    description: event.shortDescription || event.programDescription || event.title,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const { slug } = await params;
  const event = await getSiteEventBySlug(tenant.id, slug);
  if (!event) notFound();
  const config = await getTenantConfig(tenant.id, tenant.name);

  const cover = event.coverImage || img(`${event.title}-cover`, 1400, 800);
  const dateLabel = formatEventDate(event.date);
  const upcoming = event.status === "upcoming";
  const map = mapsHref(event.location, event.mapUrl);
  const qrSrc = event.qrImage
    || (event.showQr && config.payments.upiQrImage)
    || (event.showQr && config.payments.upiId
      ? qrImageForData(upiPayLink(config.payments.upiId, tenant.name, event.donateAmount || undefined))
      : "");

  return (
    <article>
      <section className="relative bg-secondary text-white overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--c-dark)] via-[var(--c-dark)]/90 to-[var(--c-dark)]/55" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Icon name="arrow" className="w-3.5 h-3.5" />
            <Link href="/events" className="hover:text-primary">Events</Link>
            <Icon name="arrow" className="w-3.5 h-3.5" />
            <span className="text-primary">{event.title}</span>
          </div>
          <span className="inline-flex rounded-full bg-white/15 text-xs font-semibold px-3 py-1 mb-4">
            {upcoming ? "Upcoming" : "Completed"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold max-w-3xl">{event.title}</h1>
          {dateLabel && (
            <p className="mt-4 text-white/75">
              {dateLabel}
              {event.location ? ` · ${event.location}` : ""}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 space-y-10">
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          {event.activityName && <Info label="Activity" value={event.activityName} />}
          {event.location && (
            <Info
              label="Location"
              value={event.location}
              href={map}
              extra={event.venueNote}
            />
          )}
          {dateLabel && <Info label="Date" value={dateLabel} />}
          {event.organizedBy && <Info label="Organised by" value={event.organizedBy} />}
        </dl>

        {event.objectives.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3">Objectives of the Program</h2>
            <ul className="space-y-2">
              {event.objectives.map((o) => (
                <li key={o} className="flex gap-2 text-[var(--c-text)]">
                  <Icon name="check" className="w-4 h-4 text-primary mt-1 shrink-0" /> {o}
                </li>
              ))}
            </ul>
          </section>
        )}

        {event.programDescription && (
          <section>
            <h2 className="text-xl font-bold mb-3">{upcoming ? "About this event" : "Program Description"}</h2>
            <p className="leading-relaxed site-muted whitespace-pre-wrap">{event.programDescription}</p>
          </section>
        )}

        {event.dignitaries && (
          <section>
            <h2 className="text-xl font-bold mb-3">Dignitaries & Participants</h2>
            <p className="leading-relaxed site-muted">{event.dignitaries}</p>
          </section>
        )}

        {event.impact && (
          <section>
            <h2 className="text-xl font-bold mb-3">Impact of the Program</h2>
            <p className="leading-relaxed site-muted">{event.impact}</p>
          </section>
        )}

        <EventStory blocks={event.blocks} />

        {event.documents.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3">Documents</h2>
            <div className="flex flex-wrap gap-3">
              {event.documents.map((d) => (
                <a key={d.url} href={d.url} target="_blank" rel="noreferrer" className="btn-primary inline-flex px-4 py-2 text-sm font-semibold">
                  {d.label}
                </a>
              ))}
            </div>
          </section>
        )}

        {event.gallery.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">{upcoming ? "Photos" : "Event Gallery"}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {event.gallery.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" className="w-full aspect-[4/3] object-cover rounded-xl ring-1 ring-[var(--site-line)]" />
              ))}
            </div>
          </section>
        )}

        {(event.showQr || qrSrc) && qrSrc && (
          <section className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrSrc} alt="" className="w-36 h-36 rounded-xl bg-white p-2 ring-1 ring-[var(--site-line)]" />
            <p className="text-sm font-medium">{event.qrCaption || "Scan this QR"}</p>
          </section>
        )}

        {event.enableDonate && (
          <DonateBox
            payments={config.payments}
            orgName={tenant.name}
            eventId={event.id}
            suggested={event.donateAmount || 500}
            label={event.donateLabel || (upcoming ? "Support this event" : "Support this program")}
          />
        )}

        <p>
          <Link href="/events" className="text-primary font-semibold inline-flex items-center gap-1">
            ← All events
          </Link>
        </p>
      </div>
    </article>
  );
}

function Info({ label, value, href, extra }: { label: string; value: string; href?: string; extra?: string }) {
  return (
    <div className="rounded-xl bg-[var(--site-surface)] ring-1 ring-[var(--site-line)] p-4">
      <dt className="text-xs uppercase tracking-wider site-muted font-semibold">{label}</dt>
      <dd className="font-medium mt-1">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="hover:text-primary">{value}</a>
        ) : value}
      </dd>
      {extra && <p className="text-xs site-muted mt-1">{extra}</p>}
    </div>
  );
}
