import { slugifyProduct, type ProductOption, type PublicProduct } from "./store";

// Product CSV import/export format (client-safe, shared by the admin preview and the server import).
// One row per variant; products without options use one row. Rows sharing a handle (or SKU) are one product.

export const PRODUCT_CSV_HEADER = [
  "handle", "name", "sku", "category", "price", "mrp", "stock", "description", "images", "tags", "badge", "published", "featured",
  "track_stock", "allow_backorder", "weight_grams", "hsn", "gst_rate", "seo_title", "seo_description",
  "option1_name", "option1_value", "option2_name", "option2_value", "option3_name", "option3_value",
  "variant_sku", "variant_price", "variant_mrp", "variant_stock", "variant_image",
];

export function productCsvRows(products: (PublicProduct & { published: boolean })[]): unknown[][] {
  const out: unknown[][] = [];
  for (const p of products) {
    const base = [
      p.slug, p.name, p.sku, p.category, p.price, p.mrp || "", p.stock, p.description, p.images.join(" | "), p.tags.join(", "), p.badge,
      p.published ? "yes" : "no", p.featured ? "yes" : "no", p.trackStock ? "yes" : "no", p.allowBackorder ? "yes" : "no",
      p.weightGrams || "", p.hsn, p.gstRate || "", p.seoTitle, p.seoDescription,
    ];
    if (!p.variants.length) {
      out.push([...base, ...optionCells(p.options.map((o) => [o.name, o.values.join(" | ")])), "", "", "", "", ""]);
      continue;
    }
    for (const v of p.variants) {
      out.push([...base, ...optionCells(Object.entries(v.options)), v.sku, v.price || "", v.mrp || "", v.stock, v.image]);
    }
  }
  return out;
}

const optionCells = (pairs: string[][]) => [0, 1, 2].flatMap((i) => pairs[i] ?? ["", ""]);

export type ImportVariant = { options: Record<string, string>; sku: string; price: number; mrp: number; stock: number; image: string };
export type ImportDraft = {
  row: number;
  handle: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  description: string;
  images: string[];
  tags: string[];
  badge: string;
  published: boolean;
  featured: boolean;
  trackStock: boolean;
  allowBackorder: boolean;
  weightGrams: number;
  hsn: string;
  gstRate: number;
  seoTitle: string;
  seoDescription: string;
  options: ProductOption[];
  variants: ImportVariant[];
};

const int = (v: string | undefined) => {
  const n = Math.round(Number(String(v ?? "").replace(/[₹,\s]/g, "")));
  return Number.isFinite(n) && n > 0 ? n : 0;
};
const yes = (v: string | undefined, dflt: boolean) => (v ? /^(y|yes|true|1|live|published)$/i.test(v.trim()) : dflt);
const list = (v: string | undefined, sep: RegExp) => (v ?? "").split(sep).map((x) => x.trim()).filter(Boolean);

/** Group CSV rows (from csvObjects) into products. Errors name the CSV line (header = line 1). */
export function csvToProducts(rows: Record<string, string>[]): { drafts: ImportDraft[]; errors: string[] } {
  const groups = new Map<string, { row: number; r: Record<string, string> }[]>();
  const errors: string[] = [];
  rows.forEach((r, i) => {
    const key = (r.handle && slugifyProduct(r.handle)) || (r.sku && `sku:${r.sku}`) || (r.name && slugifyProduct(r.name));
    if (!key) return errors.push(`Line ${i + 2}: needs a handle, SKU or name.`);
    groups.set(key, [...(groups.get(key) ?? []), { row: i + 2, r }]);
  });
  const drafts: ImportDraft[] = [];
  for (const [key, g] of groups) {
    const { row, r } = g[0];
    const options: ProductOption[] = [];
    const variants: ImportVariant[] = [];
    for (const { r: x } of g) {
      const opts: Record<string, string> = {};
      for (const n of [1, 2, 3]) {
        const name = (x[`option${n}_name`] || r[`option${n}_name`] || "").trim();
        const value = (x[`option${n}_value`] ?? "").trim();
        if (!name || !value) continue;
        // "S | M | L" on a single row = option values without per-variant data.
        const values = list(value, /\s*\|\s*/);
        let o = options.find((y) => y.name === name);
        if (!o) options.push((o = { name, values: [] }));
        for (const v of values) if (!o.values.includes(v)) o.values.push(v);
        if (values.length === 1) opts[name] = value;
      }
      const isVariant = Object.keys(opts).length > 0 && (x.variant_sku || x.variant_price || x.variant_stock || x.variant_mrp || x.variant_image || g.length > 1);
      if (isVariant) variants.push({ options: opts, sku: x.variant_sku ?? "", price: int(x.variant_price), mrp: int(x.variant_mrp), stock: int(x.variant_stock), image: x.variant_image ?? "" });
    }
    const name = r.name || g.find((x) => x.r.name)?.r.name || "";
    const price = int(r.price) || Math.min(...variants.map((v) => v.price).filter(Boolean), Infinity);
    if (!name) { errors.push(`Line ${row}: product name is required.`); continue; }
    if (!Number.isFinite(price) || price <= 0) { errors.push(`Line ${row} (${name}): price is required.`); continue; }
    // Variant rows must cover every option (a full Size × Colour matrix is not required).
    const partial = variants.find((v) => Object.keys(v.options).length !== options.length);
    if (partial) { errors.push(`Line ${row} (${name}): every variant row needs a value for each option.`); continue; }
    drafts.push({
      row, handle: r.handle ? slugifyProduct(r.handle) : key.startsWith("sku:") ? "" : key, name, sku: r.sku ?? "", category: r.category ?? "",
      price, mrp: int(r.mrp), stock: int(r.stock), description: r.description ?? "", images: list(r.images, /\s*\|\s*/).slice(0, 8),
      tags: list(r.tags, /\s*,\s*/).slice(0, 30), badge: r.badge ?? "", published: yes(r.published, true), featured: yes(r.featured, false),
      trackStock: yes(r.track_stock, true), allowBackorder: yes(r.allow_backorder, false), weightGrams: int(r.weight_grams), hsn: (r.hsn ?? "").replace(/\D/g, ""),
      gstRate: int(r.gst_rate), seoTitle: r.seo_title ?? "", seoDescription: r.seo_description ?? "", options: options.slice(0, 3), variants,
    });
  }
  return { drafts, errors };
}
