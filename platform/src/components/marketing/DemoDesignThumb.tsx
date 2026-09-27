import type { DemoDesign } from "./DemosExplorer";

/** CSS-drawn mini website in a design's palette — header style + hero layout + cards. */
export function DemoDesignThumb({ design }: { design: DemoDesign }) {
  const c = design.colors;
  const dark = design.header === "bold";
  const centered = design.header === "centered";
  const bar = (w: string, color: string, h = 3) => (
    <span className="block rounded-full" style={{ width: w, height: h, background: color }} />
  );
  const links = (color: string) => (
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="block h-[3px] w-3 rounded-full" style={{ background: color, opacity: 0.55 }} />
      ))}
    </span>
  );

  const header = (() => {
    switch (design.header) {
      case "bold":
        return (
          <div className="flex items-center justify-between px-2.5 py-2" style={{ background: c.dark }}>
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.primary }} />
            {links("#fff")}
            <span className="h-2.5 w-6 rounded" style={{ background: c.primary }} />
          </div>
        );
      case "modern":
        return (
          <div className="px-2 pt-2">
            <div className="flex items-center justify-between rounded-full bg-white px-2 py-1.5 shadow-sm ring-1 ring-black/5">
              <span className="h-2 w-2 rounded-full" style={{ background: c.primary }} />
              {links(c.heading)}
              <span className="h-2 w-5 rounded-full" style={{ background: c.primary }} />
            </div>
          </div>
        );
      case "centered":
        return (
          <div className="flex flex-col items-center gap-1 border-b py-1.5" style={{ borderColor: `color-mix(in srgb, ${c.heading} 14%, transparent)` }}>
            {bar("28%", c.heading, 4)}
            {links(c.heading)}
          </div>
        );
      case "minimal":
        return (
          <div className="flex items-center justify-between px-2.5 py-2">
            {bar("20%", c.heading)}
            {links(c.text)}
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-between bg-white px-2.5 py-2 shadow-sm">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.primary }} />
              {bar("1.25rem", c.heading)}
            </span>
            {links(c.heading)}
            <span className="h-2.5 w-6 rounded" style={{ background: c.secondary }} />
          </div>
        );
    }
  })();

  const heroBg =
    design.hero === "gradient"
      ? `linear-gradient(135deg, ${c.dark}, ${c.primary})`
      : design.hero === "minimal" || design.hero === "centered"
        ? c.light
        : design.hero === "split"
          ? c.light
          : `linear-gradient(120deg, ${c.secondary}, ${c.primaryDark})`;
  const heroOnDark = design.hero === "gradient" || !design.hero;
  const ink = heroOnDark ? "#ffffff" : c.heading;
  const align = design.hero === "centered" || design.hero === "minimal" || centered ? "items-center" : "items-start";

  return (
    <div
      aria-hidden
      className="relative aspect-[4/3] w-full overflow-hidden rounded-lg ring-1 ring-black/10"
      style={{ background: dark ? c.light : "#ffffff" }}
    >
      {header}
      <div className="flex gap-2 px-2.5 py-3" style={{ background: heroBg }}>
        <div className={`flex flex-1 flex-col gap-1 ${align}`}>
          {bar(design.hero === "minimal" ? "55%" : "70%", ink, 5)}
          {bar("50%", ink, 5)}
          <span className="mt-0.5 block h-[3px] w-2/3 rounded-full" style={{ background: ink, opacity: 0.4 }} />
          <span className="mt-1 flex gap-1">
            <span className="h-2.5 w-7 rounded" style={{ background: c.primary }} />
            {design.hero !== "minimal" && (
              <span className="h-2.5 w-7 rounded border" style={{ borderColor: ink, opacity: 0.6 }} />
            )}
          </span>
        </div>
        {design.hero === "split" && <div className="w-2/5 rounded-md" style={{ background: c.primary, opacity: 0.35 }} />}
      </div>
      <div className="grid grid-cols-3 gap-1.5 px-2.5 py-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-1 rounded p-1.5"
            style={{
              background: design.header === "minimal" || centered ? "transparent" : c.light,
              border: design.header === "minimal" || centered ? `1px solid color-mix(in srgb, ${c.heading} 12%, transparent)` : undefined,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: i === 1 ? c.accent : c.primary }} />
            {bar("80%", c.heading, 2)}
            {bar("60%", c.text, 2)}
          </div>
        ))}
      </div>
      {dark && <div className="absolute inset-x-0 bottom-0 h-2" style={{ background: c.dark }} />}
    </div>
  );
}
