import { isPlaceholderSrc, placeholderImage } from "@/lib/img";

type Props = {
  src?: string;
  alt?: string;
  className?: string;
  w: number;
  h: number;
  /** Extra classes on the inner img */
  imgClassName?: string;
  style?: React.CSSProperties;
  showBadge?: boolean;
};

/** Image or a blank slot with recommended pixel size for Admin upload. */
export function ImageSlot({ src, alt, className = "", w, h, imgClassName = "w-full h-full object-cover", style, showBadge = false }: Props) {
  const url = src?.trim() || placeholderImage(w, h);
  const placeholder = !src?.trim() || isPlaceholderSrc(url);
  const positioned = /\babsolute\b/.test(className) || /\bfixed\b/.test(className);

  return (
    <div className={`${positioned ? "" : "relative "}overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={alt ?? ""} className={imgClassName} style={style} />
      {showBadge && placeholder && (
        <span className="absolute top-2 left-2 z-10 max-w-[calc(100%-1rem)] rounded-md bg-slate-950/75 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 shadow-sm tabular-nums leading-tight">
          {w} × {h} px
          <span className="hidden sm:inline font-medium opacity-80"> · Admin se upload karein</span>
        </span>
      )}
    </div>
  );
}
