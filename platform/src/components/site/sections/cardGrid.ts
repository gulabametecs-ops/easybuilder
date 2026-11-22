// Shared card-row sizing for service / property / cause grids (flex-wrap + justify-center).
// Desktop columns are chosen so no card is ever left alone on a row:
//   1–4 cards → one row of that many · 5 → 3+2 · 6 → 3+3 · 7 → 4+3 · 8 → 4+4 · 10 → 4+4+2 …
// Tablet shows 2 per row, phone 1. Use with a row of `flex flex-wrap justify-center gap-*`.

export function desktopCols(n: number): number {
  if (n <= 4) return Math.max(1, n);
  return n === 8 || n % 3 === 1 ? 4 : 3;
}

/** Class + style for each card. `gapPx` must match the row's gap (gap-5 = 20, gap-6 = 24). */
export function cardSize(n: number, gapPx: number): { className: string; style: React.CSSProperties } {
  const cols = desktopCols(n);
  const w = (k: number) => (k === 1 ? "100%" : `calc((100% - ${(k - 1) * gapPx}px) / ${k})`);
  return {
    className: "w-full sm:w-[var(--card-w-sm)] lg:w-[var(--card-w-lg)]",
    style: {
      "--card-w-sm": w(Math.min(2, cols)),
      // a lone card / pair shouldn't stretch across the whole page
      "--card-w-lg": cols <= 2 ? `min(${w(Math.max(cols, 2))}, 26rem)` : w(cols),
    } as React.CSSProperties,
  };
}
