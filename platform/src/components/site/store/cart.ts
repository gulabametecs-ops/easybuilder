"use client";

import { useSyncExternalStore } from "react";
import { MAX_QTY, type CartLine } from "@/lib/store";

// Shopper cart in localStorage (per site origin). Prices here are display-only —
// checkout re-prices everything from the database (lib/store priceOrder).

export type CartItem = CartLine & { key: string; slug: string; name: string; price: number; image: string };

const KEY = "sp_cart_v1";
const EVENT = "sp-cart";
const EMPTY: CartItem[] = [];
let lastRaw: string | null = null;
let lastItems: CartItem[] = EMPTY;

function readRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function snapshot(): CartItem[] {
  const raw = readRaw();
  if (raw !== lastRaw) {
    lastRaw = raw;
    try {
      const v = JSON.parse(raw);
      lastItems = Array.isArray(v) ? (v as CartItem[]) : EMPTY;
    } catch {
      lastItems = EMPTY;
    }
  }
  return lastItems;
}

function write(items: CartItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* private mode — cart lives for this page only */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}

export const lineKey = (productId: string, options: Record<string, string>) =>
  `${productId}|${Object.entries(options).sort().map(([k, v]) => `${k}=${v}`).join("&")}`;

export function addToCart(item: Omit<CartItem, "key" | "qty">, qty = 1) {
  const key = lineKey(item.productId, item.options);
  const items = [...snapshot()];
  const i = items.findIndex((x) => x.key === key);
  if (i >= 0) items[i] = { ...items[i], ...item, qty: Math.min(MAX_QTY, items[i].qty + qty) };
  else items.push({ ...item, key, qty: Math.min(MAX_QTY, qty) });
  write(items);
}

export function setQty(key: string, qty: number) {
  write(snapshot().map((x) => (x.key === key ? { ...x, qty: Math.max(1, Math.min(MAX_QTY, qty)) } : x)));
}

export function removeFromCart(key: string) {
  write(snapshot().filter((x) => x.key !== key));
}

export function clearCart() {
  write([]);
}
