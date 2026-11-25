"use client";

import { useEffect } from "react";

// Injected into the live site inside the visual builder's preview iframe. Gives
// an on-canvas editing experience (like Chrome inspect): hover shows a label +
// outline, click selects a section and shows a floating toolbar with actions
// (move, edit, design, duplicate, show/hide, delete) that drive the parent editor.
// Also: drag a section by its grip to reorder (pointer events, so touch works too),
// a "+ Add section here" pill on the edge between sections, and a handle on the
// selected section's bottom edge to drag its bottom space. The parent does the saving.
export function BuilderBridge() {
  useEffect(() => {
    const post = (msg: Record<string, unknown>) => window.parent?.postMessage({ __builder: true, ...msg }, "*");
    let selected: string | null = null;

    const sectionOf = (el: EventTarget | null) =>
      el instanceof Element ? (el.closest("[data-sid]") as HTMLElement | null) : null;
    const allSections = () => Array.from(document.querySelectorAll("[data-sid]")) as HTMLElement[];
    const sectionEl = (id: string | null) => (id ? (document.querySelector(`[data-sid="${id}"]`) as HTMLElement | null) : null);

    // ── floating toolbar ──
    const bar = document.createElement("div");
    bar.className = "builder-toolbar";
    bar.style.display = "none";
    const BTNS = [
      { act: "drag", t: "Drag to move", h: "M9 4a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zM9 10a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zm-6 6a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z" },
      { act: "up", t: "Move up", h: "M12 5l-7 7h4v7h6v-7h4z" },
      { act: "down", t: "Move down", h: "M12 19l7-7h-4V5H9v7H5z" },
      { act: "edit", t: "Edit content", h: "M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.58z" },
      { act: "style", t: "Design / size", h: "M12 3a9 9 0 000 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.39-.61-.39-.99 0-.83.67-1.5 1.5-1.5H16a5 5 0 005-5c0-4.42-4.03-8-9-8zm-5.5 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3.5 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" },
      { act: "duplicate", t: "Duplicate", h: "M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" },
      { act: "toggle", t: "Show / hide", h: "M12 5C6 5 2 12 2 12s4 7 10 7 10-7 10-7-4-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" },
      { act: "delete", t: "Delete", h: "M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" },
    ];
    bar.innerHTML =
      `<span class="bt-label" title="Drag to move"></span>` +
      BTNS.map((b) => `<button data-act="${b.act}" title="${b.t}" class="${b.act === "delete" ? "bt-del" : b.act === "drag" ? "bt-drag" : ""}"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="${b.h}"/></svg></button>`).join("");
    document.body.appendChild(bar);
    const barLabel = bar.querySelector(".bt-label") as HTMLElement;

    // ── bottom-edge spacing handle (selected section) ──
    const grow = document.createElement("div");
    grow.className = "builder-grow";
    grow.title = "Drag up/down to change the space below this section";
    grow.innerHTML = `<span>↕ Space below</span>`;
    grow.style.display = "none";
    document.body.appendChild(grow);
    const growLabel = grow.querySelector("span") as HTMLElement;

    // ── "+ Add section here" pill + drop indicator line ──
    const ins = document.createElement("button");
    ins.type = "button";
    ins.className = "builder-insert";
    ins.innerHTML = `<b>+</b> Add section here`;
    ins.style.display = "none";
    document.body.appendChild(ins);
    let insIndex = -1;

    const line = document.createElement("div");
    line.className = "builder-dropline";
    line.style.display = "none";
    document.body.appendChild(line);

    const position = () => {
      const el = sectionEl(selected);
      if (!el) { bar.style.display = "none"; grow.style.display = "none"; return; }
      const r = el.getBoundingClientRect();
      bar.style.display = "flex";
      bar.style.top = Math.max(8, Math.min(r.top + 8, window.innerHeight - 46)) + "px";
      bar.style.left = Math.min(Math.max(r.left + r.width / 2, 150), window.innerWidth - 150) + "px";
      grow.style.display = r.bottom > 0 && r.bottom < window.innerHeight + 10 ? "flex" : "none";
      grow.style.top = r.bottom + "px";
      grow.style.left = r.left + r.width / 2 + "px";
    };

    const select = (id: string | null, label?: string | null) => {
      selected = id;
      document.querySelectorAll(".builder-selected").forEach((n) => n.classList.remove("builder-selected"));
      if (!id) { position(); return; }
      const el = sectionEl(id);
      el?.classList.add("builder-selected");
      barLabel.textContent = label || el?.getAttribute("data-label") || "Section";
      position();
    };

    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest(".builder-toolbar, .builder-grow, .builder-insert")) return;
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
      if (b.getAttribute("data-act") === "drag") return;
      post({ type: "action", action: b.getAttribute("data-act"), id: selected });
    });

    const onMessage = (e: MessageEvent) => {
      const d = e.data;
      if (!d || !d.__builderCmd) return;
      if (d.type === "highlight" && d.id) {
        const el = sectionEl(d.id);
        if (el) { select(d.id, el.getAttribute("data-label")); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      }
      if (d.type === "deselect") select(null);
      if (d.type === "restore") {
        // After a save the preview reloads — put the scroll + selection back where they were.
        if (typeof d.y === "number") window.scrollTo(0, d.y);
        if (d.id && sectionEl(d.id)) select(d.id);
      }
    };

    // Gap index (0..n) nearest to a y coordinate, and the y of that gap's line.
    const gapAt = (y: number) => {
      const secs = allSections();
      let idx = secs.length;
      for (let i = 0; i < secs.length; i++) {
        const r = secs[i].getBoundingClientRect();
        if (y < r.top + r.height / 2) { idx = i; break; }
      }
      const lineY = secs.length === 0 ? 0 : idx < secs.length ? secs[idx].getBoundingClientRect().top : secs[secs.length - 1].getBoundingClientRect().bottom;
      return { idx, lineY, secs };
    };

    // ── drag a section by the toolbar grip (or its label) ──
    let drag: { id: string; el: HTMLElement; from: number; to: number; y: number } | null = null;
    let growing: { el: HTMLElement; startY: number; start: number; val: number } | null = null;
    let raf = 0;

    const showLine = (y: number) => {
      if (!drag) return;
      const g = gapAt(y);
      drag.to = g.idx;
      const noop = g.idx === drag.from || g.idx === drag.from + 1;
      const first = g.secs[0]?.getBoundingClientRect();
      line.style.display = "block";
      line.classList.toggle("noop", noop);
      line.style.top = g.lineY + "px";
      line.style.left = (first?.left ?? 0) + "px";
      line.style.width = (first?.width ?? window.innerWidth) + "px";
    };
    const autoScroll = () => {
      raf = 0;
      if (!drag) return;
      const zone = 70;
      const dy = drag.y < zone ? -(zone - drag.y) / 3 : drag.y > window.innerHeight - zone ? (drag.y - (window.innerHeight - zone)) / 3 : 0;
      if (dy) { window.scrollBy(0, dy); showLine(drag.y); }
      raf = requestAnimationFrame(autoScroll);
    };
    const startDrag = (e: PointerEvent) => {
      const el = sectionEl(selected);
      if (!el || !selected) return;
      e.preventDefault();
      const from = allSections().indexOf(el);
      drag = { id: selected, el, from, to: from, y: e.clientY };
      (e.target as Element).releasePointerCapture?.(e.pointerId); // let move events reach document
      el.classList.add("builder-dragging");
      document.documentElement.classList.add("builder-is-dragging");
      ins.style.display = "none";
      showLine(e.clientY);
      raf = requestAnimationFrame(autoScroll);
    };
    bar.addEventListener("pointerdown", (e) => {
      const t = e.target as Element;
      if (t.closest(".bt-drag") || t.closest(".bt-label")) startDrag(e);
    });

    // ── bottom-edge spacing handle ──
    grow.addEventListener("pointerdown", (e) => {
      const el = sectionEl(selected);
      if (!el) return;
      e.preventDefault();
      const inner = (el.lastElementChild as HTMLElement | null) ?? el;
      const start = Math.round(parseFloat(getComputedStyle(inner).paddingBottom) || 0);
      growing = { el, startY: e.clientY, start, val: start };
      document.documentElement.classList.add("builder-is-growing");
    });

    // ── hover: "+ Add section here" pill near a section's top/bottom edge ──
    const onHover = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // touch uses the panel's Add button
      if (e.target instanceof Element && e.target.closest(".builder-insert, .builder-toolbar, .builder-grow")) return;
      const sec = sectionOf(e.target);
      if (!sec) { ins.style.display = "none"; return; }
      const r = sec.getBoundingClientRect();
      const edge = Math.min(56, r.height / 3);
      const i = allSections().indexOf(sec);
      let y: number | null = null;
      if (e.clientY - r.top < edge) { insIndex = i; y = r.top; }
      else if (r.bottom - e.clientY < edge) { insIndex = i + 1; y = r.bottom; }
      if (y === null) { ins.style.display = "none"; return; }
      ins.style.display = "inline-flex";
      ins.style.top = Math.max(16, Math.min(y, window.innerHeight - 16)) + "px";
      ins.style.left = r.left + r.width / 2 + "px";
    };
    ins.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (insIndex >= 0) post({ type: "add", index: insIndex });
      ins.style.display = "none";
    });

    const onMove = (e: PointerEvent) => {
      if (drag) { drag.y = e.clientY; showLine(e.clientY); return; }
      if (growing) {
        const val = Math.round(Math.min(400, Math.max(0, growing.start + (e.clientY - growing.startY))) / 4) * 4;
        growing.val = val;
        growing.el.setAttribute("data-pb", "1");
        growing.el.style.setProperty("--sec-pb", val + "px");
        growLabel.textContent = `↕ ${val}px`;
        position();
        return;
      }
      onHover(e);
    };
    const onUp = () => {
      if (drag) {
        const d = drag;
        drag = null;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        line.style.display = "none";
        d.el.classList.remove("builder-dragging");
        document.documentElement.classList.remove("builder-is-dragging");
        if (d.to !== d.from && d.to !== d.from + 1) {
          // Move it in the DOM right away so it feels instant; the parent saves + reloads.
          const secs = allSections();
          if (d.to < secs.length) secs[d.to].before(d.el);
          else secs[secs.length - 1].after(d.el);
          d.el.scrollIntoView({ block: "nearest" });
          post({ type: "reorder", id: d.id, to: d.to });
        }
        position();
      }
      if (growing) {
        const g = growing;
        growing = null;
        document.documentElement.classList.remove("builder-is-growing");
        growLabel.textContent = "↕ Space below";
        if (g.val !== g.start && selected) post({ type: "spacing", id: selected, padBottom: g.val });
      }
    };

    let scrollT = 0;
    const onScroll = () => {
      position();
      if (!drag) ins.style.display = "none";
      clearTimeout(scrollT);
      scrollT = window.setTimeout(() => post({ type: "scroll", y: window.scrollY }), 150);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
    document.addEventListener("click", onClick, true);
    window.addEventListener("message", onMessage);
    window.addEventListener("scroll", onScroll, true);
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
      .builder-toolbar .bt-drag, .builder-toolbar .bt-label { cursor: grab; touch-action: none; }
      .builder-toolbar button.bt-drag { background: #65a30d; color: #fff; }
      .builder-toolbar button.bt-drag:hover { background: #4d7c0f; }
      .builder-is-dragging, .builder-is-dragging * { cursor: grabbing !important; user-select: none !important; }
      .builder-is-growing, .builder-is-growing * { cursor: ns-resize !important; user-select: none !important; }
      .builder-dragging { opacity: .35; }
      .builder-dropline {
        position: fixed; z-index: 2147483500; height: 4px; margin-top: -2px; pointer-events: none;
        background: #65a30d; border-radius: 4px; box-shadow: 0 0 0 3px rgba(101,163,13,.25);
      }
      .builder-dropline::after {
        content: "Drop here"; position: absolute; left: 50%; top: -11px; transform: translateX(-50%);
        background: #65a30d; color: #fff; font: 700 11px system-ui, sans-serif; padding: 4px 10px; border-radius: 999px;
      }
      .builder-dropline.noop { background: #94a3b8; box-shadow: none; }
      .builder-dropline.noop::after { content: "Same place"; background: #94a3b8; }
      .builder-insert {
        position: fixed; z-index: 2147483400; transform: translate(-50%, -50%);
        display: none; align-items: center; gap: 6px; padding: 5px 12px 5px 6px; border: 0; cursor: pointer;
        background: #0f172a; color: #fff; border-radius: 999px; font: 700 12px system-ui, sans-serif;
        box-shadow: 0 0 0 3px rgba(101,163,13,.55), 0 8px 20px -6px rgba(0,0,0,.5);
      }
      .builder-insert b { width: 18px; height: 18px; border-radius: 999px; background: #65a30d; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; line-height: 1; }
      .builder-insert:hover { background: #65a30d; }
      .builder-grow {
        position: fixed; z-index: 2147483550; transform: translate(-50%, -50%);
        display: none; align-items: center; justify-content: center; height: 22px; padding: 0 10px;
        background: #65a30d; color: #fff; border-radius: 999px; cursor: ns-resize; touch-action: none;
        font: 700 11px system-ui, sans-serif; white-space: nowrap; box-shadow: 0 4px 12px -2px rgba(0,0,0,.4);
      }
    `;
    document.head.appendChild(styleEl);

    post({ type: "ready" });

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("message", onMessage);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", position);
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(scrollT);
      bar.remove();
      grow.remove();
      ins.remove();
      line.remove();
      styleEl.remove();
    };
  }, []);

  return null;
}
