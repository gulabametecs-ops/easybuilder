// SitePixl brand — built from the client-supplied artwork, split into live layers so each
// part can animate on its own:
//   • body   public/brand/sitepixl-mark-body.png (the 3D "P" browser window)
//   • pixels 4 squares rebuilt as elements at their exact spots/colours on the artwork
//   • cursor an arrow inside the window
// + the client's "sitepiXl.com" lettering. No hooks → works in server & client components.
// Animations: globals.css (.spx-*).

const MARK = "/brand/sitepixl-mark.png"; // full artwork (mono mask / favicon)
const BODY = "/brand/sitepixl-mark-body.png";
const RATIO = 426 / 328; // mark width / height
// Cursor tip position inside the mark's browser window (measured on the artwork), in %.
const TIP = { left: 33, top: 40 };
// The 4 pixels, measured on the 426×328 artwork (% of the mark box) + their burst direction.
const PIX = [
  { l: 80.75, t: 0.3, w: 8.2, h: 10.7, c: "#0e97fa", bx: 0.9, by: -1.2 },
  { l: 71.1, t: 11.6, w: 6.9, h: 8.9, c: "#2747e5", bx: -1.1, by: -0.7 },
  { l: 91.5, t: 11.6, w: 8.2, h: 10.7, c: "#6928f8", bx: 1.3, by: -0.2 },
  { l: 80.75, t: 22.3, w: 8.2, h: 11, c: "#5222f4", bx: 0.6, by: 0.9 },
];

function Cursor() {
  return (
    <span aria-hidden className="spx-cursor pointer-events-none absolute" style={{ left: `${TIP.left}%`, top: `${TIP.top}%`, height: "27%" }}>
      <span className="spx-ripple absolute rounded-full" />
      <svg viewBox="-1.6 -1.6 18.4 23.4" className="spx-cursor-arrow relative block h-full w-auto overflow-visible drop-shadow-[0_2px_3px_rgba(11,16,32,0.35)]">
        <path d="M0 0V18L5 13 8.5 20 11.5 18.5 8 11.5H15Z" fill="#0b1020" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const maskOf = (src: string) => ({ WebkitMask: `url(${src}) center / contain no-repeat`, mask: `url(${src}) center / contain no-repeat` });

/**
 * The mark alone; `size` is its height. `mono` paints it in currentColor (buttons / spinners).
 */
export function BrandMark({
  size = 32,
  className = "",
  mono = false,
  cursor = true,
}: {
  size?: number;
  /** kept for older call sites; the images need no unique ids */
  id?: string;
  className?: string;
  mono?: boolean;
  /** the arrow cursor inside the window (hidden automatically when mono) */
  cursor?: boolean;
}) {
  const w = Math.round(size * RATIO);
  if (mono) {
    return (
      <span
        aria-hidden
        className={`spx-mark inline-block shrink-0 ${className}`}
        style={{ width: w, height: size, background: "currentColor", ...maskOf(MARK) }}
      />
    );
  }
  return (
    <span aria-hidden className={`spx-mark relative inline-block shrink-0 ${className}`} style={{ width: w, height: size }}>
      <span className="spx-body absolute inset-0">
        {/* faint grey "blueprint" the colour fills into */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BODY} alt="" width={w} height={size} draggable={false} className="spx-ghost absolute inset-0 h-full w-full select-none object-contain" />
        {/* colour layer, revealed bottom→top while it "builds" */}
        <span className="spx-build absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BODY} alt="" width={w} height={size} draggable={false} className="h-full w-full select-none object-contain" />
          <span className="spx-sheen pointer-events-none absolute inset-0" style={maskOf(BODY)} />
        </span>
        {/* glowing scan line riding the build edge */}
        <span className="spx-scan pointer-events-none absolute inset-x-[4%] h-[3%] rounded-full" />
      </span>
      {/* light burst on the cursor click */}
      <span className="spx-flash pointer-events-none absolute rounded-full" style={{ left: "33%", top: "40%", width: "70%", aspectRatio: "1" }} />
      {PIX.map((p, i) => (
        <span
          key={i}
          className="spx-pix absolute"
          style={
            {
              left: `${p.l}%`,
              top: `${p.t}%`,
              width: `${p.w}%`,
              height: `${p.h}%`,
              borderRadius: "14%",
              background: `linear-gradient(135deg, color-mix(in srgb, ${p.c} 55%, #fff), ${p.c} 55%)`,
              boxShadow: `0 0 ${size * 0.12}px ${p.c}66`,
              "--bx": `${p.bx * size * 0.45}px`,
              "--by": `${p.by * size * 0.45}px`,
              "--i": i,
            } as React.CSSProperties
          }
        />
      ))}
      {cursor && <Cursor />}
    </span>
  );
}

/**
 * The client's own "sitepiXl.com" lettering (cut from their logo, public/brand/*).
 * `full` adds their "Build • Design • Grow" line + swoosh. Light ink normally, white ink
 * when `onDark` or in dark mode.
 */
function Wordmark({ height, onDark = false, full = false, className = "" }: { height: number; onDark?: boolean; full?: boolean; className?: string }) {
  const base = `/brand/sitepixl-wordmark${full ? "-full" : ""}`;
  const w = Math.round(height * (full ? 800 / 331 : 800 / 217));
  const img = (src: string, cls: string) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={w} height={height} draggable={false} className={`h-full w-full select-none object-contain ${cls}`} />
  );
  return (
    <span role="img" aria-label="sitepixl.com" className={`relative inline-block shrink-0 ${className}`} style={{ width: w, height }}>
      {onDark ? (
        img(`${base}-dark.png`, "")
      ) : (
        <>
          {img(`${base}.png`, "dark:hidden")}
          {img(`${base}-dark.png`, "hidden dark:block")}
        </>
      )}
    </span>
  );
}

/**
 * Full lock-up: mark │ sitepiXl.com, optional Build • Design • Grow line.
 * `onDark` switches the ink to white.
 */
export function BrandLogo({
  size = 30,
  onDark = false,
  tagline = false,
  className = "",
}: {
  size?: number;
  onDark?: boolean;
  tagline?: boolean;
  id?: string;
  className?: string;
}) {
  // wordmark letters ≈ size tall; the tagline version is taller (tagline + swoosh below)
  const h = tagline ? size * 1.42 : size * 0.94;
  return (
    <span className={`spx-logo inline-flex items-center ${className}`} style={{ gap: size * 0.32 }}>
      <BrandMark size={size * 1.08} />
      <span aria-hidden className={`w-px self-stretch ${onDark ? "bg-white/25" : "bg-[#2563ff]/25"}`} style={{ margin: `${size * 0.1}px 0` }} />
      <Wordmark height={h} onDark={onDark} full={tagline} />
    </span>
  );
}

/** Small looping mark for buttons / inline "working…" states (inherits text colour). */
export function BrandSpinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span role="status" aria-label="Working" className={`spx-spinner inline-flex shrink-0 items-center justify-center ${className}`}>
      <BrandMark size={12} mono className="h-full w-full" />
    </span>
  );
}
