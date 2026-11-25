"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, Search, Plus, Check, ArrowRight, Heart, Star, UserRound } from "lucide-react";
import type { SectionContentMap } from "@/lib/config";
import { headingStylesFrom, readContentStyles, textStyleProps } from "@/lib/fieldStyle";
import { discountPct, fromPrice, inr, isSoldOut, productHref, type PublicProduct } from "@/lib/store";
import type { PublicCollection } from "@/lib/storeServer";
import { addToCart, useCart } from "../store/cart";
import { toggleWish, useWishlist } from "../store/shopper";

const RADIUS = "rounded-[calc(var(--site-radius)*1.2)]";

/** Product photo, or a soft branded tile when the owner hasn't uploaded one yet. */
export function ProductImage({ p, className = "", src }: { p: Pick<PublicProduct, "name" | "images">; className?: string; src?: string }) {
  const url = src ?? p.images[0];
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={p.name} className={`w-full h-full object-cover ${className}`} loading="lazy" />;
  }
  return (
    <div className={`w-full h-full bg-light flex flex-col items-center justify-center gap-2 text-primary ${className}`}>
      <ShoppingBag className="w-10 h-10 opacity-60" />
      <span className="text-xs font-semibold opacity-70 px-3 text-center line-clamp-1">{p.name}</span>
    </div>
  );
}

export function PriceTag({ p, big = false }: { p: Pick<PublicProduct, "price" | "mrp">; big?: boolean }) {
  const off = discountPct(p);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={`${big ? "text-3xl" : "text-lg"} font-extrabold tabular-nums text-[var(--c-heading)]`}>{inr(p.price)}</span>
      {off > 0 && (
        <>
          <span className={`${big ? "text-base" : "text-sm"} site-muted line-through tabular-nums`}>{inr(p.mrp)}</span>
          <span className={`${big ? "text-base" : "text-xs"} font-bold text-emerald-600`}>{off}% off</span>
        </>
      )}
    </div>
  );
}

export function Stars({ rating, count, className = "w-3.5 h-3.5" }: { rating: number; count?: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${rating} out of 5${count != null ? `, ${count} reviews` : ""}`}>
      <span className="inline-flex">
        {[1, 2, 3, 4, 5].map((i) => <Star key={i} aria-hidden className={`${className} ${i <= Math.round(rating) ? "text-amber-500 fill-amber-400" : "text-slate-300"}`} />)}
      </span>
      {count != null && <span className="text-xs site-muted tabular-nums">({count})</span>}
    </span>
  );
}

export function WishButton({ id, name, className = "" }: { id: string; name: string; className?: string }) {
  const on = useWishlist().includes(id);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); toggleWish(id); }}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      title={on ? "Saved to wishlist" : "Save to wishlist"}
      className={`inline-flex items-center justify-center rounded-full bg-white/95 shadow w-9 h-9 transition hover:scale-110 ${on ? "text-rose-500" : "text-slate-500 hover:text-rose-500"} ${className}`}
    >
      <Heart className={`w-[18px] h-[18px] ${on ? "fill-rose-500" : ""}`} />
    </button>
  );
}

export function ProductCard({ p }: { p: PublicProduct }) {
  const [added, setAdded] = useState(false);
  const soldOut = isSoldOut(p);
  const from = fromPrice(p);
  const off = discountPct(p);
  const quickAdd = () => {
    addToCart({ productId: p.id, slug: p.slug, name: p.name, price: p.price, image: p.images[0] ?? "", options: {} });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };
  return (
    <div className={`card sec-card group relative flex flex-col h-full overflow-hidden ${soldOut ? "opacity-75" : ""}`}>
      <Link href={productHref(p.slug)} className="relative block aspect-square overflow-hidden bg-light">
        <ProductImage p={p} className="transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {p.badge && <span className="rounded-full bg-primary text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 shadow">{p.badge}</span>}
          {off >= 10 && <span className="rounded-full bg-white/95 text-emerald-700 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 shadow">{off}% OFF</span>}
        </div>
        {soldOut && <span className="absolute inset-x-0 bottom-0 bg-slate-900/80 text-white text-xs font-bold text-center py-1.5 uppercase tracking-wider">Sold out</span>}
      </Link>
      <WishButton id={p.id} name={p.name} className="absolute top-2.5 right-2.5" />
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-1">
        {p.category && <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider site-muted">{p.category}</p>}
        <Link href={productHref(p.slug)} className="font-semibold text-sm sm:text-base leading-snug line-clamp-2 hover:text-primary transition-colors">{p.name}</Link>
        {p.reviewCount > 0 && <Stars rating={p.rating} count={p.reviewCount} />}
        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          {from < p.price ? (
            <div className="flex items-baseline gap-1"><span className="text-xs site-muted">From</span><span className="text-lg font-extrabold tabular-nums text-[var(--c-heading)]">{inr(from)}</span></div>
          ) : <PriceTag p={p} />}
          {!soldOut && (p.options.length ? (
            <Link href={productHref(p.slug)} aria-label={`Choose options for ${p.name}`} className={`shrink-0 inline-flex items-center justify-center w-9 h-9 ${RADIUS} bg-primary text-white hover:opacity-90`}>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button type="button" onClick={quickAdd} aria-label={`Add ${p.name} to cart`} className={`shrink-0 inline-flex items-center justify-center w-9 h-9 ${RADIUS} bg-primary text-white hover:opacity-90 transition`}>
              {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Heading({ c }: { c: { eyebrow: string; title: string; titleHighlight: string } }) {
  const hs = headingStylesFrom(c);
  if (!c.eyebrow && !c.title && !c.titleHighlight) return null;
  return (
    <div className="sec-heading">
      {c.eyebrow && <p className="site-eyebrow mb-5" {...textStyleProps(hs.eyebrow)}>{c.eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold" {...textStyleProps(hs.title)}>
        {c.title} {c.titleHighlight && <span className="text-primary" {...textStyleProps(hs.titleHighlight)}>{c.titleHighlight}</span>}
      </h2>
    </div>
  );
}

export function ProductGridBlock({ c, products, collections }: { c: SectionContentMap["productGrid"]; products?: PublicProduct[]; collections?: PublicCollection[] }) {
  const fs = readContentStyles(c);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const fixed = c.category && c.category !== "all" ? c.category : "";
  const collection = c.collection ? collections?.find((x) => x.slug === c.collection.trim()) : undefined;
  const base = useMemo(() => {
    const all = products ?? [];
    // A collection keeps the owner's hand-picked order.
    const pool = collection ? collection.productIds.map((id) => all.find((p) => p.id === id)).filter((p): p is PublicProduct => !!p) : all;
    return pool.filter((p) => (!fixed || p.category === fixed) && (!c.featuredOnly || p.featured));
  }, [products, collection, fixed, c.featuredOnly]);
  const categories = [...new Set(base.map((p) => p.category).filter(Boolean))];
  const tags = useMemo(() => {
    const n = new Map<string, number>();
    for (const p of base) for (const t of p.tags) n.set(t, (n.get(t) ?? 0) + 1);
    return [...n].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => t);
  }, [base]);
  // The chosen category lives in the URL (?c=…) so header/footer category links land filtered.
  const urlCat = c.showFilters ? params.get("c") ?? "" : "";
  const cat = categories.includes(urlCat) ? urlCat : "";
  const [q, setQ] = useState(() => (c.showFilters ? params.get("q") ?? "" : ""));
  const [tag, setTag] = useState(() => (c.showFilters ? params.get("tag") ?? "" : ""));
  const [sort, setSort] = useState("featured");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const lo = Number(min) || 0;
    const hi = Number(max) || Infinity;
    const out = base.filter((p) => {
      const price = fromPrice(p);
      return (!cat || p.category === cat) && (!tag || p.tags.includes(tag)) && price >= lo && price <= hi
        && (!needle || [p.name, p.category, p.description, p.sku, ...p.tags, ...p.variants.map((v) => `${v.sku} ${v.title}`)].join(" ").toLowerCase().includes(needle));
    });
    if (sort === "low") out.sort((a, b) => fromPrice(a) - fromPrice(b));
    if (sort === "high") out.sort((a, b) => fromPrice(b) - fromPrice(a));
    if (sort === "off") out.sort((a, b) => discountPct(b) - discountPct(a));
    if (sort === "rating") out.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    if (sort === "az") out.sort((a, b) => a.name.localeCompare(b.name));
    return c.limit > 0 ? out.slice(0, c.limit) : out;
  }, [base, cat, tag, q, sort, min, max, c.limit]);

  const pickCat = (v: string) => {
    const sp = new URLSearchParams(params.toString());
    if (v) sp.set("c", v);
    else sp.delete("c");
    router.replace(`${pathname}${sp.size ? `?${sp}` : ""}`, { scroll: false });
  };
  const filtered = !!(q || cat || tag || min || max);
  const pill = (on: boolean) => `shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${on ? "bg-primary text-white" : "bg-[var(--site-surface)] ring-1 ring-inset ring-[var(--site-line)] hover:text-primary"}`;
  const input = `${RADIUS} bg-[var(--site-surface)] ring-1 ring-inset ring-[var(--site-line)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary`;
  const digits = (v: string) => v.replace(/\D/g, "").slice(0, 7);

  return (
    <section className="site-sec py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Heading c={c} />
        {c.subtitle && <p className="text-center site-muted -mt-8 mb-12 max-w-2xl mx-auto" {...textStyleProps(fs.subtitle)}>{c.subtitle}</p>}

        {c.showFilters && base.length > 0 && (
          <div className="mb-8 space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              {!fixed && categories.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 lg:flex-1">
                  <button type="button" className={pill(!cat)} onClick={() => pickCat("")}>All</button>
                  {categories.map((x) => <button key={x} type="button" className={pill(cat === x)} onClick={() => pickCat(x)}>{x}</button>)}
                </div>
              )}
              <div className="flex gap-2 lg:ml-auto min-w-0">
                <label className="relative flex-1 min-w-0 lg:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 site-muted" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" aria-label="Search products" className={`${input} w-full pl-9`} />
                </label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className={`${input} max-w-[45%]`}>
                  <option value="featured">Featured</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  <option value="off">Biggest discount</option>
                  <option value="rating">Top rated</option>
                  <option value="az">Name A–Z</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm">
                <span className="site-muted">Price ₹</span>
                <input value={min} onChange={(e) => setMin(digits(e.target.value))} inputMode="numeric" placeholder="Min" aria-label="Minimum price" className={`${input} w-20 py-2`} />
                <span className="site-muted">–</span>
                <input value={max} onChange={(e) => setMax(digits(e.target.value))} inputMode="numeric" placeholder="Max" aria-label="Maximum price" className={`${input} w-20 py-2`} />
              </span>
              {tags.map((t) => (
                <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(tag === t ? "" : t)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${tag === t ? "bg-primary text-white" : "bg-light hover:text-primary"}`}>#{t}</button>
              ))}
              {filtered && <button type="button" onClick={() => { setQ(""); setTag(""); setMin(""); setMax(""); if (cat) pickCat(""); }} className="text-xs font-semibold site-muted hover:text-primary underline">Clear filters</button>}
              <span className="ml-auto text-xs site-muted">{list.length} product{list.length === 1 ? "" : "s"}</span>
            </div>
          </div>
        )}

        {list.length ? (
          <div className="sec-cols grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {list.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <p className="text-center site-muted py-10">{filtered ? "No products match — try another search or filter." : c.emptyText}</p>
        )}

        {c.buttonLabel && c.buttonHref && base.length > list.length && (
          <div className="text-center mt-10">
            <Link href={c.buttonHref} className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold">
              {c.buttonLabel} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function ProductCategoriesBlock({ c, products }: { c: SectionContentMap["productCategories"]; products?: PublicProduct[] }) {
  const cats = new Map<string, { image: string; count: number; sample: PublicProduct }>();
  for (const p of products ?? []) {
    if (!p.category) continue;
    const prev = cats.get(p.category);
    cats.set(p.category, { image: prev?.image || p.images[0] || "", count: (prev?.count ?? 0) + 1, sample: prev?.sample ?? p });
  }
  if (!cats.size) return null;
  return (
    <section className="site-sec py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Heading c={c} />
        <div className="sec-cols grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[...cats].slice(0, 8).map(([name, x]) => (
            <Link key={name} href={`/shop?c=${encodeURIComponent(name)}`} className={`group relative block aspect-[4/5] overflow-hidden ${RADIUS} bg-light`}>
              <ProductImage p={x.sample} src={x.image || undefined} className="transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
                <p className="font-bold text-lg sm:text-xl leading-tight">{name}</p>
                <p className="text-xs sm:text-sm text-white/80 mt-0.5 inline-flex items-center gap-1">
                  {x.count} product{x.count === 1 ? "" : "s"} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Floating store buttons (store sites only): account, plus the cart once something is in it. */
export function CartFab() {
  const items = useCart();
  const pathname = usePathname();
  const count = items.reduce((n, i) => n + i.qty, 0);
  if (/\/(cart|checkout|account)$|\/order\//.test(pathname ?? "")) return null;
  const total = items.reduce((n, i) => n + i.qty * i.price, 0);
  return (
    <div className="fixed z-40 left-4 bottom-4 sm:left-6 sm:bottom-6 flex items-center gap-2">
      <Link href="/account" aria-label="My account and wishlist" title="My account" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-primary ring-1 ring-black/5 shadow-[0_12px_30px_-8px_rgb(0_0_0/0.35)] hover:-translate-y-0.5 transition-transform">
        <UserRound className="w-5 h-5" />
      </Link>
      {count > 0 && (
        <Link href="/cart" className="inline-flex items-center gap-3 rounded-full bg-primary text-white pl-4 pr-5 py-3 shadow-[0_12px_30px_-8px_rgb(0_0_0/0.45)] hover:-translate-y-0.5 transition-transform">
          <span className="relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -right-2.5 min-w-[1.15rem] h-[1.15rem] px-1 rounded-full bg-white text-primary text-[10px] font-extrabold flex items-center justify-center">{count}</span>
          </span>
          <span className="text-sm font-bold">View cart · {inr(total)}</span>
        </Link>
      )}
    </div>
  );
}
