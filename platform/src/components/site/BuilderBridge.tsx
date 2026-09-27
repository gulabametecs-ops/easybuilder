"use client";

import { useEffect } from "react";

// Injected into the live site inside the visual builder's preview iframe. Gives
// an on-canvas editing experience (like Chrome inspect): hover shows a label +
// outline, click selects a section and shows a floating toolbar with actions
// (move, edit, design, duplicate, show/hide, delete) that drive the parent editor.
export function BuilderBridge() {
  useEffect(() => {
    const post = (msg: Record<string, unknown>) => window.parent?.postMessage({ __builder: true, ...msg }, "*");
    let selected: string | null = null;

    const sectionOf = (el: EventTarget | null) =>
      el instanceof Element ? (el.closest("[data-sid]") as HTMLElement | null) : null;

    // ── floating toolbar ──
    const bar = document.createElement("div");
    bar.className = "builder-toolbar";
    bar.style.display = "none";
    const BTNS = [
      { act: "up", t: "Move up", h: "M12 5l-7 7h4v7h6v-7h4z" },
      { act: "down", t: "Move down", h: "M12 19l7-7h-4V5H9v7H5z" },
      { act: "edit", t: "Edit content", h: "M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.58z" },
      { act: "style", t: "Design / colours", h: "M12 3a9 9 0 000 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.39-.61-.39-.99 0-.83.67-1.5 1.5-1.5H16a5 5 0 005-5c0-4.42-4.03-8-9-8zm-5.5 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3.5 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" },
      { act: "duplicate", t: "Duplicate", h: "M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" },
      { act: "toggle", t: "Show / hide", h: "M12 5C6 5 2 12 2 12s4 7 10 7 10-7 10-7-4-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" },
      { act: "delete", t: "Delete", h: "M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" },
    ];
    bar.innerHTML =
      `<span class="bt-label"></span>` +
      BTNS.map((b) => `<button data-act="${b.act}" title="${b.t}" class="${b.act === "delete" ? "bt-del" : ""}"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="${b.h}"/></svg></button>`).join("");
    document.body.appendChild(bar);

    const barLabel = bar.querySelector(".bt-label") as HTMLElement;

    const position = () => {
      if (!selected) { bar.style.display = "none"; return; }
      const el = document.querySelector(`[data-sid="${selected}"]`) as HTMLElement | null;
      if (!el) { bar.style.display = "none"; return; }
      const r = el.getBoundingClientRect();
      bar.style.display = "flex";
      bar.style.top = Math.max(8, Math.min(r.top + 8, window.innerHeight - 46)) + "px";
      bar.style.left = Math.min(Math.max(r.left + r.width / 2, 130), window.innerWidth - 130) + "px";
    };

    const select = (id: string | null, label?: string | null) => {
      selected = id;
      document.querySelectorAll(".builder-selected").forEach((n) => n.classList.remove("builder-selected"));
      if (!id) { bar.style.display = "none"; return; }
      const el = document.querySelector(`[data-sid="${id}"]`) as HTMLElement | null;
      el?.classList.add("builder-selected");
      barLabel.textContent = label || el?.getAttribute("data-label") || "Section";
      position();
    };

    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest(".builder-toolbar")) return;
      const sec = sectionOf(e.target);
      if (!sec) return;
      e.preventDefault();
      e.stopPropagation();
      const id = sec.getAttribute("data-sid");
      select(id, sec.getAttribute("data-label"));
      post({ type: "select", id });
    };

    bar.addEventListener("click", (e) => {
      const b = (e.target as Element).closest("button");
      if (!b || !selected) return;
      e.preventDefault();
      post({ type: "action", action: b.getAttribute("data-act"), id: selected });
    });

    const onMessage = (e: MessageEvent) => {
      const d = e.data;
      if (!d || !d.__builderCmd) return;
      if (d.type === "highlight" && d.id) {
        const el = document.querySelector(`[data-sid="${d.id}"]`) as HTMLElement | null;
        if (el) { select(d.id, el.getAttribute("data-label")); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      }
      if (d.type === "deselect") select(null);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("message", onMessage);
    window.addEventListener("scroll", position, true);
    window.addEventListener("resize", position);

    const styleEl = document.createElement("style");
    styleEl.textContent = `
      .builder-section { position: relative; cursor: pointer; }
      .builder-section:hover { outline: 2px dashed rgba(101,163,13,.7); outline-offset: -2px; }
      .builder-section:hover::before {
        content: attr(data-label); position: absolute; top: 0; left: 0; z-index: 2147483000;
        background: #65a30d; color: #fff; font: 700 11px system-ui, sans-serif;
        padding: 2px 8px; border-radius: 0 0 6px 0; pointer-events: none; letter-spacing: .02em;
      }
      .builder-selected { outline: 3px solid #65a30d !important; outline-offset: -3px; }
      .builder-section[data-hidden="1"] { opacity: .45; }
      .builder-toolbar {
        position: fixed; z-index: 2147483600; transform: translateX(-50%);
        display: none; align-items: center; gap: 2px; padding: 4px;
        background: #0f172a; border: 1px solid rgba(255,255,255,.12); border-radius: 10px;
        box-shadow: 0 10px 30px -8px rgba(0,0,0,.6); font-family: system-ui, sans-serif;
      }
      .builder-toolbar .bt-label {
        color: #e2e8f0; font-size: 12px; font-weight: 700; padding: 0 8px 0 6px;
        max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        border-right: 1px solid rgba(255,255,255,.12); margin-right: 2px; line-height: 28px;
      }
      .builder-toolbar button {
        width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;
        border: 0; background: transparent; color: #cbd5e1; border-radius: 6px; cursor: pointer;
      }
      .builder-toolbar button:hover { background: rgba(255,255,255,.12); color: #fff; }
      .builder-toolbar button.bt-del:hover { background: #dc2626; color: #fff; }
    `;
    document.head.appendChild(styleEl);

    post({ type: "ready" });

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("message", onMessage);
      window.removeEventListener("scroll", position, true);
      window.removeEventListener("resize", position);
      bar.remove();
      styleEl.remove();
    };
  }, []);

  return null;
}
