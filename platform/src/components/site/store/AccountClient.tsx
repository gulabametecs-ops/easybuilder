"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Loader2, LogOut, Package, MapPin, Heart, UserRound, Plus, Trash2, Pencil, ShoppingBag } from "lucide-react";
import { inr, optionText, orderLabel, PAYMENT_LABEL, productHref, type OrderItem, type PublicProduct } from "@/lib/store";
import type { CustomerAddress } from "@/lib/storeCustomer";
import {
  mergeWishlist, productsByIds, requestCustomerOtp, saveCustomerAddresses, signOutCustomer, updateCustomerProfile, verifyCustomerOtp, type AddressInput,
} from "@/lib/actions/storeAccount";
import { ProductCard, ProductImage } from "../sections/StoreBlocks";
import { setWishlist, useWishlist } from "./shopper";

const RADIUS = "rounded-[calc(var(--site-radius)*1.2)]";
const FIELD = `w-full ${RADIUS} bg-[var(--site-surface)] ring-1 ring-inset ring-[var(--site-line)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary`;
const BTN = "btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 font-bold disabled:opacity-60";

export function AccountLogin({ bizName, blocked }: { bizName: string; blocked: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [demoCode, setDemoCode] = useState("");
  const [error, setError] = useState(blocked ? "This account has been disabled. Please contact the store." : "");
  const wish = useWishlist();

  const send = () => start(async () => {
    setError("");
    const r = await requestCustomerOtp(email).catch((e: unknown) => ({ ok: false as const, error: e instanceof Error ? e.message : "Could not send the code." }));
    if (!r.ok) return setError(r.error);
    setSent(true);
    setDemoCode(r.demoCode ?? "");
  });
  const verify = (fd: FormData) => start(async () => {
    setError("");
    const r = await verifyCustomerOtp(email, String(fd.get("code") ?? "")).catch(() => ({ ok: false as const, error: "Could not sign in. Please try again." }));
    if (!r.ok) return setError(r.error);
    router.refresh();
  });

  return (
    <div className="max-w-md mx-auto">
      <div className="card sec-card p-6 sm:p-8">
        <span className="inline-flex w-12 h-12 rounded-full bg-primary text-white items-center justify-center"><UserRound className="w-6 h-6" /></span>
        <h1 className="text-2xl sm:text-3xl font-bold mt-4">{sent ? "Check your email" : "Sign in"}</h1>
        <p className="site-muted mt-1 text-sm">
          {sent ? <>We sent a 6-digit code to <strong>{email}</strong>.</> : <>Track orders, save addresses and keep your wishlist at {bizName}. No password needed.</>}
        </p>
        {!sent ? (
          <form action={send} className="mt-6 space-y-3">
            <label className="relative block">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 site-muted" />
              <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email" className={`${FIELD} pl-10`} />
            </label>
            {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
            <button type="submit" disabled={pending} className={`${BTN} w-full`}>{pending && <Loader2 className="w-4 h-4 animate-spin" />} Email me a code</button>
          </form>
        ) : (
          <form action={verify} className="mt-6 space-y-3">
            {demoCode && <p className="rounded-xl bg-amber-50 text-amber-800 text-sm px-3 py-2">Demo store: your code is <strong className="tracking-widest">{demoCode}</strong></p>}
            <input name="code" required inputMode="numeric" pattern="\d{6}" maxLength={6} autoComplete="one-time-code" autoFocus placeholder="6-digit code" aria-label="Sign-in code" className={`${FIELD} text-center text-xl tracking-[0.5em] font-bold`} />
            {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
            <button type="submit" disabled={pending} className={`${BTN} w-full`}>{pending && <Loader2 className="w-4 h-4 animate-spin" />} Sign in</button>
            <button type="button" onClick={() => { setSent(false); setError(""); }} className="w-full text-sm font-semibold site-muted hover:text-primary">Use a different email</button>
          </form>
        )}
      </div>
      <GuestWishlist ids={wish} />
    </div>
  );
}

function useProducts(ids: string[]) {
  const key = ids.join(",");
  const [state, setState] = useState<{ key: string; list: PublicProduct[] }>({ key: "", list: [] });
  useEffect(() => {
    if (!key) return;
    let live = true;
    productsByIds(key.split(",")).then((list) => { if (live) setState({ key, list }); }).catch(() => {});
    return () => { live = false; };
  }, [key]);
  return key && state.key === key ? state.list : key ? null : [];
}

function GuestWishlist({ ids }: { ids: string[] }) {
  const list = useProducts(ids);
  if (!list?.length) return null;
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Heart className="w-5 h-5 text-rose-500" /> Saved on this device</h2>
      <p className="text-sm site-muted mb-4">Sign in to keep your wishlist across devices.</p>
      <div className="grid grid-cols-2 gap-3">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </section>
  );
}

type AccountOrder = { id: string; orderNo: number; createdAt: string; status: string; paymentMethod: string; paymentStatus: string; total: number; items: OrderItem[]; address: string };
type Me = { email: string; name: string; phone: string; marketingOptIn: boolean; addresses: CustomerAddress[]; wishlist: string[] };

const TABS = [
  { id: "orders", label: "Orders", Icon: Package },
  { id: "wishlist", label: "Wishlist", Icon: Heart },
  { id: "addresses", label: "Addresses", Icon: MapPin },
  { id: "profile", label: "Profile", Icon: UserRound },
] as const;

const STATUS_TONE: Record<string, string> = {
  delivered: "bg-emerald-100 text-emerald-800", cancelled: "bg-rose-100 text-rose-700", shipped: "bg-sky-100 text-sky-800", new: "bg-amber-100 text-amber-800",
};

export function AccountView({ bizName, me, orders }: { bizName: string; me: Me; orders: AccountOrder[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("orders");
  const [pending, start] = useTransition();
  const local = useWishlist();
  // Merge the guest (device) wishlist into the account once, then mirror the account back to the device.
  useEffect(() => {
    let live = true;
    mergeWishlist(local).then((ids) => { if (live && ids) setWishlist(ids); }).catch(() => {});
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm site-muted">{bizName}</p>
          <h1 className="text-3xl sm:text-4xl font-bold">Hi{me.name ? `, ${me.name.split(" ")[0]}` : ""} <span className="text-primary">👋</span></h1>
          <p className="text-sm site-muted mt-1">{me.email}</p>
        </div>
        <button type="button" disabled={pending} onClick={() => start(async () => { await signOutCustomer(); router.refresh(); })} className="inline-flex items-center gap-2 text-sm font-semibold site-muted hover:text-primary">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0" role="tablist">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${tab === id ? "bg-primary text-white" : "bg-[var(--site-surface)] ring-1 ring-inset ring-[var(--site-line)] hover:text-primary"}`}>
            <Icon className="w-4 h-4" /> {label}{id === "orders" && orders.length ? ` (${orders.length})` : id === "wishlist" && local.length ? ` (${local.length})` : ""}
          </button>
        ))}
      </div>
      {tab === "orders" && <Orders orders={orders} />}
      {tab === "wishlist" && <Wishlist ids={local} />}
      {tab === "addresses" && <Addresses initial={me.addresses} defaultName={me.name} defaultPhone={me.phone} />}
      {tab === "profile" && <Profile me={me} />}
    </div>
  );
}

function Orders({ orders }: { orders: AccountOrder[] }) {
  if (!orders.length) {
    return (
      <div className="card sec-card p-8 text-center">
        <ShoppingBag className="w-12 h-12 mx-auto text-primary opacity-60" />
        <p className="font-bold mt-3">No orders yet</p>
        <p className="text-sm site-muted mt-1">Orders placed with this email show up here.</p>
        <Link href="/shop" className={`${BTN} mt-5`}>Start shopping</Link>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id} className="card sec-card p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="font-bold">Order {orderLabel(o.orderNo)}</p>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_TONE[o.status] ?? "bg-slate-100 text-slate-700"}`}>{o.status}</span>
            <span className="text-xs site-muted">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span className="ml-auto font-extrabold tabular-nums">{inr(o.total)}</span>
          </div>
          <ul className="mt-3 space-y-2">
            {o.items.map((i, k) => (
              <li key={k} className="flex items-center gap-3">
                <Link href={productHref(i.slug)} className={`w-12 h-12 shrink-0 overflow-hidden ${RADIUS} bg-light`}><ProductImage p={{ name: i.name, images: i.image ? [i.image] : [] }} /></Link>
                <div className="min-w-0 flex-1">
                  <Link href={productHref(i.slug)} className="text-sm font-semibold line-clamp-1 hover:text-primary">{i.name}</Link>
                  <p className="text-xs site-muted">{Object.keys(i.options ?? {}).length ? `${optionText(i.options)} · ` : ""}Qty {i.qty}</p>
                </div>
                <span className="text-sm tabular-nums">{inr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs site-muted">{PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod} · {o.paymentStatus} · {o.address}</p>
        </li>
      ))}
    </ul>
  );
}

function Wishlist({ ids }: { ids: string[] }) {
  const list = useProducts([...ids].reverse());
  if (list === null) return <p className="site-muted text-sm"><Loader2 className="w-4 h-4 animate-spin inline" /> Loading…</p>;
  if (!list.length) {
    return (
      <div className="card sec-card p-8 text-center">
        <Heart className="w-12 h-12 mx-auto text-rose-400" />
        <p className="font-bold mt-3">Your wishlist is empty</p>
        <p className="text-sm site-muted mt-1">Tap the heart on any product to save it here.</p>
        <Link href="/shop" className={`${BTN} mt-5`}>Browse products</Link>
      </div>
    );
  }
  return <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>;
}

const blankAddress = (name: string, phone: string): AddressInput => ({ id: "", name, phone, line1: "", line2: "", city: "", state: "", pincode: "", isDefault: false });

function Addresses({ initial, defaultName, defaultPhone }: { initial: CustomerAddress[]; defaultName: string; defaultPhone: string }) {
  const [list, setList] = useState<AddressInput[]>(initial);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<AddressInput>(blankAddress(defaultName, defaultPhone));
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const persist = (next: AddressInput[]) => start(async () => {
    setError("");
    const r = await saveCustomerAddresses(next).catch(() => ({ ok: false as const, error: "Could not save. Please try again." }));
    if (!r.ok) return setError(r.error);
    setList(r.addresses);
    setEditing(null);
  });
  const field = (k: keyof AddressInput, ph: string, extra = "") => (
    <input value={String(draft[k] ?? "")} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} placeholder={ph} aria-label={ph} className={`${FIELD} ${extra}`} />
  );

  return (
    <div className="space-y-3">
      {list.map((a, i) => (
        <div key={a.id || i} className="card sec-card p-4 flex gap-3 items-start">
          <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0 text-sm">
            <p className="font-semibold">{a.name} · {a.phone} {a.isDefault && <span className="ml-1 rounded-full bg-primary text-white text-[10px] font-bold px-2 py-0.5 uppercase">Default</span>}</p>
            <p className="site-muted">{[a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(", ")}</p>
            {!a.isDefault && <button type="button" onClick={() => persist(list.map((x, j) => ({ ...x, isDefault: j === i })))} className="text-xs font-semibold text-primary hover:underline mt-1">Make default</button>}
          </div>
          <button type="button" aria-label="Edit address" onClick={() => { setDraft(a); setEditing(i); }} className="p-2 site-muted hover:text-primary"><Pencil className="w-4 h-4" /></button>
          <button type="button" aria-label="Delete address" onClick={() => { if (confirm("Delete this address?")) persist(list.filter((_, j) => j !== i)); }} className="p-2 site-muted hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      {editing === null ? (
        list.length < 10 && <button type="button" onClick={() => { setDraft(blankAddress(defaultName, defaultPhone)); setEditing(-1); }} className={`w-full ${RADIUS} border-2 border-dashed border-[var(--site-line)] py-5 text-sm font-semibold site-muted hover:text-primary hover:border-primary inline-flex items-center justify-center gap-2`}><Plus className="w-4 h-4" /> Add an address</button>
      ) : (
        <form action={() => persist(editing >= 0 ? list.map((x, j) => (j === editing ? draft : x)) : [...list, draft])} className="card sec-card p-4 sm:p-6 grid sm:grid-cols-2 gap-3">
          {field("name", "Full name *")}
          {field("phone", "Mobile number *")}
          {field("line1", "House no., street, area *", "sm:col-span-2")}
          {field("line2", "Landmark (optional)", "sm:col-span-2")}
          {field("city", "City")}
          {field("state", "State")}
          {field("pincode", "Pincode *")}
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!draft.isDefault} onChange={(e) => setDraft({ ...draft, isDefault: e.target.checked })} /> Default address</label>
          {error && <p className="sm:col-span-2 text-sm font-semibold text-rose-600" role="alert">{error}</p>}
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" disabled={pending} className={BTN}>{pending && <Loader2 className="w-4 h-4 animate-spin" />} Save address</button>
            <button type="button" onClick={() => { setEditing(null); setError(""); }} className="px-4 text-sm font-semibold site-muted hover:text-primary">Cancel</button>
          </div>
        </form>
      )}
      {error && editing === null && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
    </div>
  );
}

function Profile({ me }: { me: Me }) {
  const [f, setF] = useState({ name: me.name, phone: me.phone, marketingOptIn: me.marketingOptIn });
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  return (
    <form
      action={() => start(async () => {
        const r = await updateCustomerProfile(f).catch(() => ({ ok: false as const, error: "Could not save." }));
        setMsg(r.ok ? "Saved ✓" : r.error);
      })}
      className="card sec-card p-4 sm:p-6 grid sm:grid-cols-2 gap-3 max-w-2xl"
    >
      <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Full name" aria-label="Full name" autoComplete="name" className={FIELD} />
      <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="Mobile number" aria-label="Mobile number" type="tel" autoComplete="tel" className={FIELD} />
      <input value={me.email} disabled aria-label="Email" className={`${FIELD} sm:col-span-2 opacity-70`} />
      <label className="sm:col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={f.marketingOptIn} onChange={(e) => setF({ ...f, marketingOptIn: e.target.checked })} /> Email me offers and new arrivals</label>
      <div className="sm:col-span-2 flex items-center gap-3">
        <button type="submit" disabled={pending} className={BTN}>{pending && <Loader2 className="w-4 h-4 animate-spin" />} Save profile</button>
        {msg && <span className="text-sm font-semibold" role="status">{msg}</span>}
      </div>
    </form>
  );
}
