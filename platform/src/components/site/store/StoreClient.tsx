"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Zap, Trash2, CheckCircle2, MessageCircle, Banknote, Smartphone, ArrowLeft, Loader2, Star, BadgeCheck } from "lucide-react";
import { MAX_QTY, findVariant, fromPrice, inr, isSoldOut, maxBuyable, optionText, orderLabel, PAYMENT_LABEL, productHref, shippingFor, variantView, type PaymentMethod, type PublicProduct, type PublicVariant, type StoreSettings } from "@/lib/store";
import type { PublicReview } from "@/lib/storeServer";
import { productsByIds, submitReview } from "@/lib/actions/storeAccount";
import { placeStoreOrder, type PlaceOrderResult } from "@/lib/actions/storefront";
import { qrImageForData, upiPayLink } from "@/lib/payments";
import { addToCart, clearCart, removeFromCart, setQty, useCart } from "./cart";
import { PriceTag, ProductCard, ProductImage, Stars, WishButton } from "../sections/StoreBlocks";
import { recordView, useRecentlyViewed } from "./shopper";

const RADIUS = "rounded-[calc(var(--site-radius)*1.2)]";
const FIELD = `w-full ${RADIUS} bg-[var(--site-surface)] ring-1 ring-inset ring-[var(--site-line)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary`;

function Qty({ value, onChange, small = false }: { value: number; onChange: (n: number) => void; small?: boolean }) {
  const btn = `${small ? "w-8 h-8" : "w-10 h-10"} inline-flex items-center justify-center hover:text-primary disabled:opacity-40`;
  return (
    <div className={`inline-flex items-center ${RADIUS} ring-1 ring-inset ring-[var(--site-line)] bg-[var(--site-surface)]`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity"><Minus className="w-4 h-4" /></button>
      <span className={`${small ? "w-7 text-sm" : "w-9"} text-center font-bold tabular-nums`} aria-live="polite">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity"><Plus className="w-4 h-4" /></button>
    </div>
  );
}

export function ProductGallery({ p, active }: { p: PublicProduct; active?: string }) {
  const [i, setI] = useState(0);
  const imgs = p.images.length ? p.images : [""];
  // A chosen variant's photo wins until the shopper picks a thumbnail again.
  const [shown, setShown] = useState<{ variant: string | undefined; src: string } | null>(null);
  const current = shown && shown.variant === active ? shown.src : active || imgs[i];
  return (
    <div className="space-y-3">
      <div className={`aspect-square overflow-hidden ${RADIUS} bg-light`}>
        <ProductImage p={p} src={current || undefined} />
      </div>
      {imgs.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {imgs.map((src, k) => (
            <button key={src + k} type="button" onClick={() => { setI(k); setShown({ variant: active, src }); }} aria-label={`Photo ${k + 1}`} className={`aspect-square overflow-hidden ${RADIUS} ring-2 ${src === current ? "ring-primary" : "ring-transparent opacity-70 hover:opacity-100"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Product page top: gallery + title/price/variant picker. `children` = server-rendered details under the buy box. */
export function ProductDetail({ p, whatsappUrl, children }: { p: PublicProduct; whatsappUrl: string; children?: React.ReactNode }) {
  // Preselect the first buyable variant so price/stock/photo are concrete from the start.
  const [opts, setOpts] = useState<Record<string, string>>(() => ({ ...p.variants.find((v) => maxBuyable(p, v.stock) > 0)?.options }));
  const variant = p.variants.length && p.options.every((o) => opts[o.name]) ? findVariant(p, opts) : undefined;
  const view = variantView(p, variant);
  useEffect(() => recordView(p.id), [p.id]);
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
      <ProductGallery p={p} active={variant?.image || undefined} />
      <div className="min-w-0">
        {p.badge && <span className="inline-block rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wide px-3 py-1 mb-3">{p.badge}</span>}
        {p.category && <p className="text-xs font-semibold uppercase tracking-wider site-muted">{p.category}</p>}
        <div className="flex items-start gap-3 mt-1">
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight flex-1">{p.name}</h1>
          <WishButton id={p.id} name={p.name} className="ring-1 ring-[var(--site-line)] shrink-0 mt-1" />
        </div>
        {p.reviewCount > 0 && (
          <a href="#reviews" className="inline-flex items-center gap-2 mt-2 text-sm hover:text-primary">
            <Stars rating={p.rating} className="w-4 h-4" /> <span className="font-semibold">{p.rating.toFixed(1)}</span><span className="site-muted">· {p.reviewCount} review{p.reviewCount === 1 ? "" : "s"}</span>
          </a>
        )}
        <div className="mt-4">
          {!variant && fromPrice(p) < p.price ? (
            <p className="text-3xl font-extrabold tabular-nums text-[var(--c-heading)]"><span className="text-base font-semibold site-muted">From </span>{inr(fromPrice(p))}</p>
          ) : <PriceTag p={view} big />}
        </div>
        <p className="text-xs site-muted mt-1">Inclusive of all taxes{view.sku ? ` · SKU ${view.sku}` : ""}</p>
        <div className="mt-6"><BuyBox p={p} opts={opts} setOpts={setOpts} variant={variant} whatsappUrl={whatsappUrl} /></div>
        {children}
      </div>
    </div>
  );
}

function BuyBox({ p, opts, setOpts, variant, whatsappUrl }: {
  p: PublicProduct; opts: Record<string, string>; setOpts: (fn: (x: Record<string, string>) => Record<string, string>) => void; variant: PublicVariant | undefined; whatsappUrl: string;
}) {
  const router = useRouter();
  const [qty, setQ] = useState(1);
  const [msg, setMsg] = useState("");
  const hasVariants = p.variants.length > 0;
  const view = variantView(p, variant);
  const max = maxBuyable(p, view.stock);
  const missing = p.options.find((o) => !opts[o.name]);
  const noCombo = hasVariants && !missing && !variant;
  const soldOut = hasVariants ? (variant ? max <= 0 : isSoldOut(p)) : max <= 0;
  const tracked = p.trackStock && !p.allowBackorder;

  // A value is unavailable when no buyable variant has it together with the other current picks.
  const valueOk = (name: string, value: string) =>
    !hasVariants || p.variants.some((v) => v.options[name] === value && maxBuyable(p, v.stock) > 0
      && p.options.every((o) => o.name === name || !opts[o.name] || v.options[o.name] === opts[o.name]));

  const add = (go: boolean) => {
    if (missing) return setMsg(`Please choose ${missing.name}.`);
    if (noCombo) return setMsg("That combination isn't available.");
    addToCart({ productId: p.id, variantId: variant?.id ?? null, slug: p.slug, name: p.name, price: view.price, image: view.image, options: variant?.options ?? opts }, Math.max(1, Math.min(qty, max)));
    if (go) router.push("/cart");
    else setMsg("Added to cart ✓");
  };

  return (
    <div className="space-y-5">
      {p.options.map((o) => (
        <div key={o.name}>
          <p className="text-sm font-semibold mb-2">{o.name}{opts[o.name] ? <span className="site-muted font-normal"> · {opts[o.name]}</span> : ""}</p>
          <div className="flex flex-wrap gap-2">
            {o.values.map((v) => {
              const ok = valueOk(o.name, v);
              const on = opts[o.name] === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => { setOpts((x) => ({ ...x, [o.name]: v })); setQ(1); setMsg(""); }}
                  aria-pressed={on}
                  aria-label={ok ? v : `${v} (out of stock)`}
                  className={`min-w-11 ${RADIUS} px-3.5 py-2 text-sm font-semibold ring-1 ring-inset transition ${on ? "bg-primary text-white ring-primary" : "bg-[var(--site-surface)] ring-[var(--site-line)] hover:ring-primary"} ${ok ? "" : "opacity-45 line-through decoration-1"}`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!soldOut && !noCombo && (
        <div className="flex items-center gap-3">
          <Qty value={qty} onChange={(n) => setQ(Math.max(1, Math.min(n, max)))} />
          {tracked && (!hasVariants || variant) && view.stock <= 5 && <span className="text-sm font-semibold text-amber-600">Only {view.stock} left</span>}
          {p.trackStock && p.allowBackorder && view.stock <= 0 && <span className="text-sm font-semibold site-muted">Made to order — ships a little later</span>}
        </div>
      )}
      {(noCombo || (variant && soldOut)) && <p className="text-sm font-semibold text-rose-600">This option is out of stock — try another.</p>}

      <div className="grid sm:grid-cols-2 gap-3">
        <button type="button" disabled={soldOut || noCombo} onClick={() => add(false)} className={`inline-flex items-center justify-center gap-2 ${RADIUS} px-5 py-3.5 font-bold ring-2 ring-inset ring-primary text-primary hover:bg-primary hover:text-white transition disabled:opacity-50`}>
          <ShoppingBag className="w-5 h-5" /> {soldOut ? "Sold out" : "Add to cart"}
        </button>
        <button type="button" disabled={soldOut || noCombo} onClick={() => add(true)} className={`btn-primary inline-flex items-center justify-center gap-2 px-5 py-3.5 font-bold disabled:opacity-50`}>
          <Zap className="w-5 h-5" /> Buy now
        </button>
      </div>
      {msg && (
        <p className="text-sm font-semibold" role="status">
          {msg} {msg.startsWith("Added") && <Link href="/cart" className="text-primary underline ml-1">View cart</Link>}
        </p>
      )}
      {whatsappUrl && (
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
          <MessageCircle className="w-4 h-4" /> Ask about this product on WhatsApp
        </a>
      )}
    </div>
  );
}

/** "Recently viewed" strip (ids from localStorage, products fetched from the store). */
export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const ids = useRecentlyViewed().filter((x) => x !== excludeId).slice(0, 8);
  const key = ids.join(",");
  const [items, setItems] = useState<{ key: string; list: PublicProduct[] }>({ key: "", list: [] });
  useEffect(() => {
    if (!key) return;
    let live = true;
    productsByIds(key.split(",")).then((list) => { if (live) setItems({ key, list }); }).catch(() => {});
    return () => { live = false; };
  }, [key]);
  if (!key || items.key !== key || !items.list.length) return null;
  return (
    <section className="mt-16 sm:mt-24">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Recently <span className="text-primary">viewed</span></h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">{items.list.slice(0, 4).map((x) => <ProductCard key={x.id} p={x} />)}</div>
    </section>
  );
}

/** Review summary, list and form on the product page. */
export function ProductReviews({ productId, productName, rating, count, reviews }: { productId: string; productName: string; rating: number; count: number; reviews: PublicReview[] }) {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => r.rating === n).length }));
  const submit = (fd: FormData) => {
    setError("");
    start(async () => {
      const r = await submitReview({
        productId, rating: stars, name: String(fd.get("name") ?? ""), title: String(fd.get("title") ?? ""), body: String(fd.get("body") ?? ""),
        contact: String(fd.get("contact") ?? ""), website: String(fd.get("website") ?? ""),
      }).catch(() => ({ ok: false as const, error: "Could not send your review. Please try again." }));
      if (r.ok) setDone(true);
      else setError(r.error);
    });
  };
  return (
    <section id="reviews" className="mt-16 sm:mt-24 scroll-mt-24">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Customer <span className="text-primary">reviews</span></h2>
      <div className="grid lg:grid-cols-[18rem_1fr] gap-8">
        <div className="space-y-3">
          {count > 0 ? (
            <>
              <p className="text-4xl font-extrabold tabular-nums">{rating.toFixed(1)}<span className="text-lg site-muted font-semibold"> / 5</span></p>
              <Stars rating={rating} className="w-5 h-5" />
              <p className="text-sm site-muted">Based on {count} review{count === 1 ? "" : "s"}</p>
              <ul className="space-y-1.5">
                {dist.map(({ n, c }) => (
                  <li key={n} className="flex items-center gap-2 text-xs">
                    <span className="w-6 tabular-nums">{n}★</span>
                    <span className="flex-1 h-2 rounded-full bg-light overflow-hidden"><span className="block h-full bg-amber-400" style={{ width: `${reviews.length ? (c / reviews.length) * 100 : 0}%` }} /></span>
                    <span className="w-6 text-right tabular-nums site-muted">{c}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : <p className="site-muted text-sm">No reviews yet — be the first to review {productName}.</p>}
          {!open && !done && <button type="button" onClick={() => setOpen(true)} className={`inline-flex items-center gap-2 ${RADIUS} px-5 py-2.5 font-semibold ring-2 ring-inset ring-primary text-primary hover:bg-primary hover:text-white transition`}>Write a review</button>}
          {done && <p className="text-sm font-semibold text-emerald-700" role="status">Thank you! Your review will appear once the store approves it.</p>}
        </div>
        <div className="space-y-4 min-w-0">
          {open && !done && (
            <form action={submit} className="card sec-card p-4 sm:p-6 space-y-3">
              <div>
                <p className="text-sm font-semibold mb-1.5">Your rating *</p>
                <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" role="radio" aria-checked={stars === n} aria-label={`${n} star${n === 1 ? "" : "s"}`} onClick={() => setStars(n)} className="p-0.5">
                      <Star className={`w-8 h-8 ${n <= stars ? "text-amber-500 fill-amber-400" : "text-slate-300"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input name="name" required minLength={2} maxLength={80} placeholder="Your name *" className={FIELD} />
                <input name="contact" maxLength={200} placeholder="Email or phone used to order (private)" className={FIELD} />
                <input name="title" maxLength={120} placeholder="Headline (optional)" className={`${FIELD} sm:col-span-2`} />
                <textarea name="body" required minLength={10} maxLength={3000} rows={4} placeholder="What did you like or dislike? *" className={`${FIELD} sm:col-span-2`} />
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              </div>
              <p className="text-xs site-muted">We match your email/phone with past orders to show a “Verified buyer” badge. It is never shown publicly.</p>
              {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={pending} className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 font-semibold disabled:opacity-60">{pending && <Loader2 className="w-4 h-4 animate-spin" />} Submit review</button>
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2.5 text-sm font-semibold site-muted hover:text-primary">Cancel</button>
              </div>
            </form>
          )}
          {reviews.map((r) => (
            <article key={r.id} className="border-b border-[var(--site-line)] pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <Stars rating={r.rating} />
                {r.title && <h3 className="font-semibold">{r.title}</h3>}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line">{r.body}</p>
              <p className="mt-2 text-xs site-muted flex flex-wrap items-center gap-2">
                <span className="font-semibold">{r.name}</span>
                {r.verified && <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold"><BadgeCheck className="w-3.5 h-3.5" /> Verified buyer</span>}
                <span>{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const METHOD_ICON = { cod: Banknote, upi: Smartphone, whatsapp: MessageCircle } as const;
const METHOD_HINT: Record<PaymentMethod, string> = {
  cod: "Pay in cash or UPI when your order arrives",
  upi: "Pay instantly with any UPI app after placing the order",
  whatsapp: "We'll confirm your order and payment on WhatsApp",
};

export type CheckoutPrefill = { name: string; phone: string; email: string; address: string; city: string; pincode: string };

export function CartCheckout({ settings, methods, bizName, prefill }: { settings: StoreSettings; methods: PaymentMethod[]; bizName: string; prefill?: CheckoutPrefill | null }) {
  const items = useCart();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [done, setDone] = useState<Extract<PlaceOrderResult, { ok: true }> | null>(null);
  const [method, setMethod] = useState<PaymentMethod>(methods[0]);
  const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
  const shipping = shippingFor(subtotal, settings);
  const toFree = settings.freeShippingAbove > 0 ? settings.freeShippingAbove - subtotal : 0;

  if (done) {
    const upi = done.paymentMethod === "upi" && done.upiId ? upiPayLink(done.upiId, bizName, done.total) : "";
    return (
      <div className={`max-w-xl mx-auto text-center card sec-card p-6 sm:p-10`}>
        <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
        <h2 className="text-2xl sm:text-3xl font-bold mt-4">Order {orderLabel(done.orderNo)} placed!</h2>
        <p className="site-muted mt-2">Thank you for shopping with {bizName}. We&apos;ll confirm your order shortly{done.paymentMethod === "cod" ? " — pay when it arrives." : "."}</p>
        <p className="text-lg font-bold mt-4">Total: {inr(done.total)} · {PAYMENT_LABEL[done.paymentMethod]}</p>
        {upi && (
          <div className="mt-6 space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={done.upiQrImage || qrImageForData(upi, 220)} alt="UPI QR code" className="w-48 h-48 mx-auto rounded-xl ring-1 ring-[var(--site-line)] bg-white p-2" />
            <p className="text-sm">Scan with any UPI app or pay to <strong className="select-all">{done.upiId}</strong></p>
            <a href={upi} className="btn-primary inline-flex items-center gap-2 px-5 py-3 font-bold sm:hidden"><Smartphone className="w-4 h-4" /> Pay {inr(done.total)} with UPI</a>
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {done.whatsappUrl && (
            <a href={done.whatsappUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 ${RADIUS} bg-emerald-600 text-white px-5 py-3 font-bold hover:bg-emerald-700`}>
              <MessageCircle className="w-4 h-4" /> {done.paymentMethod === "whatsapp" ? "Send order on WhatsApp" : "Share on WhatsApp"}
            </a>
          )}
          <Link href="/shop" className={`inline-flex items-center gap-2 ${RADIUS} ring-1 ring-inset ring-[var(--site-line)] px-5 py-3 font-semibold hover:text-primary`}>Continue shopping</Link>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-14 h-14 mx-auto text-primary opacity-60" />
        <h2 className="text-2xl font-bold mt-4">Your cart is empty</h2>
        <p className="site-muted mt-1">Browse the shop and add something you love.</p>
        <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-6 py-3 mt-6 font-semibold">Start shopping</Link>
      </div>
    );
  }

  const submit = (fd: FormData) => {
    setError("");
    start(async () => {
      const res = await placeStoreOrder({
        name: String(fd.get("name") ?? ""), phone: String(fd.get("phone") ?? ""), email: String(fd.get("email") ?? ""),
        address: String(fd.get("address") ?? ""), city: String(fd.get("city") ?? ""), pincode: String(fd.get("pincode") ?? ""),
        note: String(fd.get("note") ?? ""), paymentMethod: method,
        lines: items.map((i) => ({ productId: i.productId, variantId: i.variantId ?? null, qty: i.qty, options: i.options })),
      }).catch(() => ({ ok: false as const, error: "Could not place the order. Please try again." }));
      if (!res.ok) return setError(res.error);
      clearCart();
      setDone(res);
      if (res.paymentMethod === "whatsapp" && res.whatsappUrl) window.open(res.whatsappUrl, "_blank", "noopener");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <form action={submit} className="grid lg:grid-cols-[1fr_24rem] gap-8 items-start">
      <div className="space-y-8 min-w-0">
        <div className="card sec-card p-4 sm:p-6">
          <h2 className="text-lg font-bold mb-4">Your cart ({items.reduce((n, i) => n + i.qty, 0)})</h2>
          <ul className="divide-y divide-[var(--site-line)]">
            {items.map((i) => (
              <li key={i.key} className="py-4 flex gap-3 sm:gap-4">
                <Link href={productHref(i.slug)} className={`w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden ${RADIUS} bg-light`}>
                  <ProductImage p={{ name: i.name, images: i.image ? [i.image] : [] }} />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={productHref(i.slug)} className="font-semibold leading-snug line-clamp-2 hover:text-primary">{i.name}</Link>
                  {Object.keys(i.options).length > 0 && <p className="text-xs site-muted mt-0.5">{optionText(i.options)}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <Qty small value={i.qty} onChange={(n) => setQty(i.key, n)} />
                    <button type="button" onClick={() => removeFromCart(i.key)} className="inline-flex items-center gap-1 text-xs font-semibold site-muted hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
                  </div>
                </div>
                <p className="font-bold tabular-nums shrink-0">{inr(i.price * i.qty)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="card sec-card p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-bold">Delivery details</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="name" required minLength={2} autoComplete="name" defaultValue={prefill?.name} placeholder="Full name *" className={FIELD} />
            <input name="phone" required type="tel" autoComplete="tel" defaultValue={prefill?.phone} placeholder="Mobile number *" className={FIELD} />
            <input name="email" type="email" autoComplete="email" defaultValue={prefill?.email} placeholder="Email (for order updates)" className={`${FIELD} sm:col-span-2`} />
            <textarea name="address" required rows={2} autoComplete="street-address" defaultValue={prefill?.address} placeholder="House no., street, area, landmark *" className={`${FIELD} sm:col-span-2`} />
            <input name="city" autoComplete="address-level2" defaultValue={prefill?.city} placeholder="City" className={FIELD} />
            <input name="pincode" required inputMode="numeric" pattern="\d{6}" maxLength={6} autoComplete="postal-code" defaultValue={prefill?.pincode} placeholder="Pincode *" className={FIELD} />
            <input name="note" placeholder="Order note (gift message, delivery time…)" className={`${FIELD} sm:col-span-2`} />
          </div>
        </div>

        <div className="card sec-card p-4 sm:p-6 space-y-3">
          <h2 className="text-lg font-bold">Payment</h2>
          {methods.map((m) => {
            const Ic = METHOD_ICON[m];
            return (
              <label key={m} className={`flex items-center gap-3 ${RADIUS} p-3.5 ring-1 ring-inset cursor-pointer transition ${method === m ? "ring-2 ring-primary bg-light" : "ring-[var(--site-line)] hover:ring-primary"}`}>
                <input type="radio" name="pay" value={m} checked={method === m} onChange={() => setMethod(m)} className="accent-[var(--c-primary)]" />
                <Ic className="w-5 h-5 text-primary shrink-0" />
                <span className="min-w-0">
                  <span className="block font-semibold text-sm">{m === "whatsapp" ? "Order on WhatsApp" : PAYMENT_LABEL[m]}</span>
                  <span className="block text-xs site-muted">{METHOD_HINT[m]}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <aside className="card sec-card p-4 sm:p-6 lg:sticky lg:top-24 space-y-3">
        <h2 className="text-lg font-bold">Order summary</h2>
        <div className="flex justify-between text-sm"><span className="site-muted">Subtotal</span><span className="font-semibold tabular-nums">{inr(subtotal)}</span></div>
        <div className="flex justify-between text-sm"><span className="site-muted">Delivery</span><span className="font-semibold tabular-nums">{shipping ? inr(shipping) : "Free"}</span></div>
        {toFree > 0 && <p className="text-xs rounded-lg bg-light px-3 py-2">Add <strong>{inr(toFree)}</strong> more for free delivery</p>}
        <div className="flex justify-between text-lg font-extrabold border-t border-[var(--site-line)] pt-3"><span>Total</span><span className="tabular-nums">{inr(subtotal + shipping)}</span></div>
        {settings.checkoutNote && <p className="text-xs site-muted">{settings.checkoutNote}</p>}
        {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
        <button type="submit" disabled={pending} className="btn-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 font-bold disabled:opacity-60">
          {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} Place order · {inr(subtotal + shipping)}
        </button>
        <Link href="/shop" className="flex items-center justify-center gap-1 text-sm font-semibold site-muted hover:text-primary"><ArrowLeft className="w-4 h-4" /> Continue shopping</Link>
      </aside>
    </form>
  );
}
