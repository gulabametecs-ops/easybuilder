"use client";

import { useSyncExternalStore } from "react";
import { toggleWishlist } from "@/lib/actions/storeAccount";

// Per-browser shopper lists in localStorage: wishlist (merged into the account on sign-in)
// and recently viewed products. Both hold product ids only.

const EVENT = "sp-shopper";
const EMPTY: string[] = [];
const cache = new Map<string, { raw: string; ids: string[] }>();

function read(key: string): string[] {
  let raw = "[]";
  try {
    raw = localStorage.getItem(key) ?? "[]";
  } catch {
    /* private mode */
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.ids;
  let ids: string[] = EMPTY;
  try {
    const v = JSON.parse(raw);
    ids = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : EMPTY;
  } catch {
    /* corrupt — start over */
  }
  cache.set(key, { raw, ids });
  return ids;
}

function write(key: string, ids: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    /* private mode */
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

const WISH = "sp_wish_v1";
const RECENT = "sp_recent_v1";

export const useWishlist = () => useSyncExternalStore(subscribe, () => read(WISH), () => EMPTY);
export const useRecentlyViewed = () => useSyncExternalStore(subscribe, () => read(RECENT), () => EMPTY);

export function setWishlist(ids: string[]) {
  write(WISH, [...new Set(ids)].slice(-200));
}

export function toggleWish(productId: string) {
  const ids = read(WISH);
  const on = !ids.includes(productId);
  setWishlist(on ? [...ids, productId] : ids.filter((x) => x !== productId));
  // Signed-in shoppers: mirror to the account (no-op for guests).
  void toggleWishlist(productId, on).catch(() => {});
}

export function recordView(productId: string) {
  write(RECENT, [productId, ...read(RECENT).filter((x) => x !== productId)].slice(0, 12));
}
