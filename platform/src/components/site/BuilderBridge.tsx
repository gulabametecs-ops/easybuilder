"use client";

import { useEffect } from "react";

// Injected into the live site when rendered inside the visual builder's preview
// iframe. Bridges clicks/hovers on sections to the parent editor via postMessage,
// and highlights the section the editor asks for.
export function BuilderBridge() {
  useEffect(() => {
    const post = (msg: Record<string, unknown>) => window.parent?.postMessage({ __builder: true, ...msg }, "*");

    const sectionOf = (el: EventTarget | null) =>
      el instanceof Element ? (el.closest("[data-sid]") as HTMLElement | null) : null;

    const onClick = (e: MouseEvent) => {
      const sec = sectionOf(e.target);
      if (!sec) return;
      // let real links/buttons inside forms still not navigate the editor away
      e.preventDefault();
      document.querySelectorAll(".builder-selected").forEach((n) => n.classList.remove("builder-selected"));
      sec.classList.add("builder-selected");
      post({ type: "select", id: sec.getAttribute("data-sid") });
    };

    const onMessage = (e: MessageEvent) => {
      const d = e.data;
      if (!d || !d.__builderCmd) return;
      if (d.type === "highlight" && d.id) {
        const el = document.querySelector(`[data-sid="${d.id}"]`) as HTMLElement | null;
        if (el) {
          document.querySelectorAll(".builder-selected").forEach((n) => n.classList.remove("builder-selected"));
          el.classList.add("builder-selected");
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("message", onMessage);

    // report ready + section list to the parent
    const report = () => {
      const list = Array.from(document.querySelectorAll("[data-sid]")).map((n) => ({
        id: n.getAttribute("data-sid"),
        hidden: n.getAttribute("data-hidden") === "1",
      }));
      post({ type: "ready", sections: list });
    };
    report();

    // styles for hover/selected outlines
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      .builder-section { position: relative; cursor: pointer; transition: outline .1s; }
      .builder-section:hover { outline: 2px dashed rgba(101,163,13,.7); outline-offset: -2px; }
      .builder-selected { outline: 3px solid #65a30d !important; outline-offset: -3px; }
      .builder-section[data-hidden="1"]::after {
        content: "Hidden"; position: absolute; top: 8px; right: 8px; z-index: 40;
        background: #94a3b8; color: #fff; font-size: 11px; font-weight: 600;
        padding: 2px 8px; border-radius: 6px; font-family: system-ui;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("message", onMessage);
      styleEl.remove();
    };
  }, []);

  return null;
}
