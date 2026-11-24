import { db } from "./db";
import type { Prisma } from "../generated/prisma/client";
import { mapProduct, resolveCartLines, type CartLine, type CatalogLine, type OrderItem } from "./store";

// Checkout contract: authoritative cart lines + stock moves, variant-aware.
// Prices/stock always come from the DB, never from the browser cart.

export type CatalogLineInput = { productId: string; variantId?: string | null; options?: Record<string, string>; qty: number };
type Tx = Prisma.TransactionClient;

/**
 * Price + check `lines` for one tenant. Only published products are visible; `demoSessionId`
 * (a demo sandbox) also sees that sandbox's own products, otherwise only real rows (demoSessionId null).
 * Returns one CatalogLine per input line, in order; check `available` / `error` on each.
 */
export async function catalogLines(tenantId: string, lines: CatalogLineInput[], opts: { demoSessionId?: string | null } = {}): Promise<CatalogLine[]> {
  const ids = [...new Set(lines.map((l) => l.productId))].slice(0, 100);
  const rows = ids.length
    ? await db.product.findMany({
        where: { tenantId, published: true, id: { in: ids }, ...(opts.demoSessionId ? { OR: [{ demoSessionId: null }, { demoSessionId: opts.demoSessionId }] } : { demoSessionId: null }) },
        include: { variants: { orderBy: { order: "asc" } } },
      })
    : [];
  const cart: CartLine[] = lines.map((l) => ({ productId: l.productId, variantId: l.variantId ?? null, qty: l.qty, options: l.options ?? {} }));
  return resolveCartLines(cart, rows.map((r) => mapProduct(r)));
}

export class OutOfStockError extends Error {}

/**
 * Take stock for an order inside a transaction. Tracked lines without backorder only decrement
 * when enough stock is left (guards against two shoppers buying the last unit) — otherwise throws
 * OutOfStockError so the caller's transaction rolls back.
 */
export async function decrementStock(tx: Tx, lines: Pick<CatalogLine, "productId" | "variantId" | "qty" | "trackStock" | "allowBackorder" | "name">[]) {
  for (const l of lines) {
    if (!l.trackStock) continue;
    const guard = l.allowBackorder ? {} : { stock: { gte: l.qty } };
    const res = l.variantId
      ? await tx.productVariant.updateMany({ where: { id: l.variantId, productId: l.productId, ...guard }, data: { stock: { decrement: l.qty } } })
      : await tx.product.updateMany({ where: { id: l.productId, ...guard }, data: { stock: { decrement: l.qty } } });
    if (!res.count) throw new OutOfStockError(`${l.name || "An item"} just sold out. Please update your cart.`);
  }
}

/** Put stock back (order cancelled / restored). Works from stored order items; skips untracked products. */
export async function restoreStock(tx: Tx, items: Pick<OrderItem, "productId" | "variantId" | "qty">[], sign: 1 | -1 = 1) {
  const ids = [...new Set(items.map((i) => i.productId))];
  if (!ids.length) return;
  const tracked = new Set((await tx.product.findMany({ where: { id: { in: ids }, trackStock: true }, select: { id: true } })).map((r) => r.id));
  for (const i of items) {
    if (!tracked.has(i.productId)) continue;
    const data = { stock: { increment: sign * i.qty } };
    if (i.variantId) await tx.productVariant.updateMany({ where: { id: i.variantId, productId: i.productId }, data });
    else await tx.product.updateMany({ where: { id: i.productId }, data });
  }
}
