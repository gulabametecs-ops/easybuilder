// Plain placeholder while a route loads — the page intro (components/PageIntro) is the
// one brand animation, so nothing animates here (avoids a double animation).
export default function Loading() {
  return <div data-route-loading className="min-h-[60vh]" aria-busy="true" />;
}
