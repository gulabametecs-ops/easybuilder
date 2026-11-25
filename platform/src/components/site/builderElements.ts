// Element-level editing inside the builder preview (runs in the site iframe, used by BuilderBridge).
// Click any text / image / card in a section → it is matched to the section's content JSON (sent by the
// parent editor) by value, and a small toolbar offers: inline text edit (also double-click), size, bold,
// colour, alignment, replace image, and move / duplicate / delete for cards. Edits are posted to the parent,
// which saves them. Anything that can't be matched (e.g. custom HTML) falls back to selecting the section.
// ponytail: matching is by exact text/URL value — two fields with identical text map to the first one.

type Path = (string | number)[];
type Post = (msg: Record<string, unknown>) => void;
type Match = { kind: "text" | "image"; el: HTMLElement; path: Path; textNode?: Text };

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const STRIP = /[→←✓•▶►→]/g;

function strings(obj: unknown, path: Path = [], out: { path: Path; v: string }[] = []) {
  if (typeof obj === "string") out.push({ path, v: obj });
  else if (Array.isArray(obj)) obj.forEach((x, i) => strings(x, [...path, i], out));
  else if (obj && typeof obj === "object") {
    for (const k of Object.keys(obj)) if (!k.startsWith("__")) strings((obj as Record<string, unknown>)[k], [...path, k], out);
  }
  return out;
}

function imageUrl(el: Element): string {
  let src = "";
  if (el instanceof HTMLImageElement) src = el.currentSrc || el.src;
  else {
    const bg = getComputedStyle(el).backgroundImage;
    const m = bg && bg.match(/url\(["']?(.*?)["']?\)/);
    src = m?.[1] ?? "";
  }
  if (src.includes("/_next/image")) {
    try { src = new URL(src, location.href).searchParams.get("url") ?? src; } catch { /* keep */ }
  }
  try { return decodeURIComponent(src); } catch { return src; }
}

const FONT_STEPS = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"] as const;
const FONT_PX = [14, 16, 18, 20, 24, 30, 36, 48, 60, 72];

export function setupElementEditing(post: Post, selectSection: (id: string) => void) {
  const content = new Map<string, unknown>(); // section id → parsed content
  let cur: (Match & { sid: string; list?: { path: Path; index: number; card: HTMLElement } }) | null = null;
  let editing = false;

  const bar = document.createElement("div");
  bar.className = "builder-elbar";
  bar.style.display = "none";
  document.body.appendChild(bar);

  const ring = document.createElement("div");
  ring.className = "builder-elring";
  ring.style.display = "none";
  document.body.appendChild(ring);
  const cardRing = document.createElement("div");
  cardRing.className = "builder-cardring";
  cardRing.style.display = "none";
  document.body.appendChild(cardRing);

  const place = () => {
    if (!cur || !cur.el.isConnected) { bar.style.display = ring.style.display = cardRing.style.display = "none"; return; }
    const r = cur.el.getBoundingClientRect();
    Object.assign(ring.style, { display: "block", top: r.top - 3 + "px", left: r.left - 3 + "px", width: r.width + 6 + "px", height: r.height + 6 + "px" });
    if (cur.list) {
      const c = cur.list.card.getBoundingClientRect();
      Object.assign(cardRing.style, { display: "block", top: c.top - 4 + "px", left: c.left - 4 + "px", width: c.width + 8 + "px", height: c.height + 8 + "px" });
    } else cardRing.style.display = "none";
    bar.style.display = "flex";
    const top = r.top - 44 > 6 ? r.top - 44 : r.bottom + 8;
    bar.style.top = Math.min(top, window.innerHeight - 44) + "px";
    bar.style.left = Math.min(Math.max(r.left, 8), Math.max(8, window.innerWidth - bar.offsetWidth - 8)) + "px";
  };

  const clear = () => { cur = null; editing = false; place(); };

  const fieldStyle = (sid: string, field: string): Record<string, unknown> => {
    const c = content.get(sid) as { __styles?: Record<string, Record<string, unknown>> } | undefined;
    return c?.__styles?.[field] ?? {};
  };

  const btn = (label: string, title: string, act: string, extra = "") =>
    `<button type="button" data-act="${act}" title="${title}" class="${extra}">${label}</button>`;

  const render = () => {
    if (!cur) return;
    const top = cur.path.length === 1 && typeof cur.path[0] === "string"; // per-field styles live on top-level fields
    const st = top ? fieldStyle(cur.sid, cur.path[0] as string) : {};
    let h = `<span class="el-kind">${cur.kind === "image" ? "Image" : cur.list ? "Card text" : "Text"}</span>`;
    if (cur.kind === "text") {
      h += btn("✎ Edit", "Edit text (or double-click)", "edit", "wide");
      if (top) {
        h += btn("A−", "Smaller", "smaller") + btn("A+", "Bigger", "bigger");
        h += btn("<b>B</b>", "Bold", "bold", st.fontWeight === "bold" || st.fontWeight === "extrabold" ? "on" : "");
        h += btn("<i>I</i>", "Italic", "italic", st.italic ? "on" : "");
        h += `<label class="el-color" title="Text colour"><input type="color" data-act="color" value="${typeof st.color === "string" && /^#[0-9a-f]{6}$/i.test(st.color) ? st.color : "#16191e"}"></label>`;
        h += btn("⟸", "Align left", "al-left") + btn("≡", "Align centre", "al-center") + btn("⟹", "Align right", "al-right");
        h += btn("↺", "Reset style", "reset");
      }
    } else {
      h += btn("🖼 Replace image", "Replace image", "image", "wide");
    }
    if (cur.list) {
      h += `<span class="el-sep"></span>` + btn("◀", "Move card earlier", "left") + btn("▶", "Move card later", "right") + btn("⧉", "Duplicate card", "dup") + btn("🗑", "Delete card", "del", "danger");
    }
    h += `<span class="el-sep"></span>` + btn("▣ Section", "Select whole section", "section", "wide");
    bar.innerHTML = h;
    place();
  };

  // ── match a click to content ──
  const findMatch = (target: Element, sec: HTMLElement, sid: string): Match | null => {
    const data = content.get(sid);
    if (!data) return null;
    const entries = strings(data).filter((e) => e.v.trim() && !e.v.includes("<"));
    // image?
    for (let el: Element | null = target, n = 0; el && el !== sec.parentElement && n < 4; el = el.parentElement, n++) {
      const u = imageUrl(el);
      if (u && !u.startsWith("data:")) {
        const hit = entries.find((e) => e.v.length > 8 && (u === e.v || u.includes(e.v)));
        if (hit) return { kind: "image", el: el as HTMLElement, path: hit.path };
      }
      if (el instanceof HTMLImageElement) break;
    }
    // text: element text, or one of its direct text nodes (title + highlighted span share a heading)
    for (let el: Element | null = target, n = 0; el && el !== sec && n < 5; el = el.parentElement, n++) {
      const t = norm(el.textContent ?? "");
      if (!t || t.length > 600) continue;
      const hit = entries.find((e) => norm(e.v) === t || norm(e.v) === norm(t.replace(STRIP, "")));
      if (hit) return { kind: "text", el: el as HTMLElement, path: hit.path };
      for (const node of Array.from(el.childNodes)) {
        if (node.nodeType !== 3) continue;
        const nt = norm(node.textContent ?? "");
        if (!nt) continue;
        const h2 = entries.find((e) => norm(e.v) === nt);
        if (h2) return { kind: "text", el: el as HTMLElement, path: h2.path, textNode: node as Text };
      }
    }
    return null;
  };

  // The card = highest ancestor of the matched element that doesn't also contain a sibling item's text.
  const findCard = (m: Match, sec: HTMLElement, sid: string) => {
    const idx = m.path.map((p) => typeof p === "number").lastIndexOf(true);
    if (idx < 0) return undefined;
    const listPath = m.path.slice(0, idx);
    const index = m.path[idx] as number;
    let list: unknown = content.get(sid);
    for (const k of listPath) list = (list as Record<string | number, unknown>)?.[k];
    if (!Array.isArray(list) || list.length < 1) return undefined;
    const others = list
      .map((it, i) => (i === index ? "" : norm(strings(it).find((e) => norm(e.v).length > 2 && !e.v.includes("<"))?.v ?? "")))
      .filter(Boolean);
    let card: HTMLElement = m.el;
    for (let p = m.el.parentElement; p && p !== sec; p = p.parentElement) {
      const t = norm(p.textContent ?? "");
      if (others.some((o) => t.includes(o))) break;
      card = p;
    }
    return { path: listPath, index, card };
  };

  // ── inline text editing ──
  const startEdit = () => {
    if (!cur || cur.kind !== "text" || editing) return;
    editing = true;
    let el = cur.el;
    if (cur.textNode) {
      const span = document.createElement("span");
      span.textContent = cur.textNode.textContent ?? "";
      cur.textNode.replaceWith(span);
      el = span;
      cur.el = span;
      cur.textNode = undefined;
    }
    const before = el.textContent ?? "";
    el.setAttribute("contenteditable", "plaintext-only");
    if (el.contentEditable !== "plaintext-only") el.setAttribute("contenteditable", "true");
    el.classList.add("builder-editing");
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    bar.style.display = "none";
    const finish = (save: boolean) => {
      el.removeEventListener("blur", onBlur);
      el.removeEventListener("keydown", onKey);
      el.removeAttribute("contenteditable");
      el.classList.remove("builder-editing");
      editing = false;
      const after = (el.innerText ?? el.textContent ?? "").replace(/ /g, " ").trim();
      if (save && cur && after !== before.trim()) post({ type: "el-text", id: cur.sid, path: cur.path, value: after });
      else el.textContent = before;
      render();
    };
    const onBlur = () => finish(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); finish(false); }
      else if (e.key === "Enter" && !e.shiftKey && el.tagName !== "P") { e.preventDefault(); el.blur(); }
    };
    el.addEventListener("blur", onBlur);
    el.addEventListener("keydown", onKey);
  };

  const styleOp = (patch: Record<string, unknown> | null) => {
    if (!cur) return;
    post({ type: "el-style", id: cur.sid, field: cur.path[0], patch });
  };

  bar.addEventListener("mousedown", (e) => { if (!(e.target as Element).closest("input")) e.preventDefault(); }); // keep text selection
  bar.addEventListener("click", (e) => {
    const b = (e.target as Element).closest("button");
    if (!b || !cur) return;
    e.preventDefault();
    e.stopPropagation();
    const act = b.getAttribute("data-act");
    const field = cur.path[0] as string;
    const st = fieldStyle(cur.sid, field);
    if (act === "edit") return startEdit();
    if (act === "section") { const id = cur.sid; clear(); selectSection(id); return; }
    if (act === "image") return post({ type: "el-image", id: cur.sid, path: cur.path });
    if (act === "bigger" || act === "smaller") {
      const px = parseFloat(getComputedStyle(cur.el).fontSize) || 16;
      let i = FONT_STEPS.indexOf((st.fontSize as (typeof FONT_STEPS)[number]) ?? "md");
      if (!st.fontSize) i = FONT_PX.reduce((best, v, k) => (Math.abs(v - px) < Math.abs(FONT_PX[best] - px) ? k : best), 0);
      i = Math.min(FONT_STEPS.length - 1, Math.max(0, i + (act === "bigger" ? 1 : -1)));
      return styleOp({ fontSize: FONT_STEPS[i] });
    }
    if (act === "bold") return styleOp({ fontWeight: st.fontWeight === "bold" || st.fontWeight === "extrabold" ? "normal" : "bold" });
    if (act === "italic") return styleOp({ italic: !st.italic });
    if (act?.startsWith("al-")) return styleOp({ align: act.slice(3) });
    if (act === "reset") return styleOp(null);
    if (cur.list && (act === "left" || act === "right" || act === "dup" || act === "del")) {
      post({ type: "el-list", id: cur.sid, path: cur.list.path, index: cur.list.index, op: act });
      clear();
    }
  });
  bar.addEventListener("change", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.getAttribute("data-act") === "color") styleOp({ color: t.value });
  });

  return {
    setContent(map: Record<string, string>) {
      content.clear();
      for (const [id, raw] of Object.entries(map)) {
        try { content.set(id, JSON.parse(raw || "{}")); } catch { /* skip */ }
      }
    },
    /** Returns true when the click landed on an editable element (section selection is skipped). */
    handleClick(e: MouseEvent, sec: HTMLElement): boolean {
      if (editing) return true;
      const sid = sec.getAttribute("data-sid");
      if (!sid || !(e.target instanceof Element)) return false;
      const m = findMatch(e.target, sec, sid);
      if (!m) { clear(); return false; }
      cur = { ...m, sid, list: findCard(m, sec, sid) };
      render();
      return true;
    },
    handleDblClick(e: MouseEvent, sec: HTMLElement) {
      if (this.handleClick(e, sec) && cur?.kind === "text") startEdit();
    },
    isEditing: () => editing,
    reposition: place,
    clear,
    cleanup() { bar.remove(); ring.remove(); cardRing.remove(); },
    css: `
      .builder-elring { position: fixed; z-index: 2147483300; pointer-events: none; border: 2px solid #2563eb; border-radius: 6px; box-shadow: 0 0 0 3px rgba(37,99,235,.18); }
      .builder-cardring { position: fixed; z-index: 2147483200; pointer-events: none; border: 2px dashed rgba(37,99,235,.55); border-radius: 10px; }
      .builder-elbar { position: fixed; z-index: 2147483650; display: none; align-items: center; gap: 2px; padding: 4px;
        background: #0f172a; border: 1px solid rgba(255,255,255,.14); border-radius: 10px; box-shadow: 0 12px 30px -8px rgba(0,0,0,.6);
        font: 600 12px system-ui, sans-serif; color: #e2e8f0; white-space: nowrap; }
      .builder-elbar .el-kind { padding: 0 8px 0 6px; color: #93c5fd; font-weight: 800; letter-spacing: .02em; }
      .builder-elbar .el-sep { width: 1px; height: 20px; background: rgba(255,255,255,.15); margin: 0 3px; }
      .builder-elbar button { min-width: 28px; height: 28px; padding: 0 6px; border: 0; border-radius: 6px; background: transparent; color: #cbd5e1; cursor: pointer; font: 700 13px system-ui, sans-serif; }
      .builder-elbar button.wide { padding: 0 9px; font-size: 12px; }
      .builder-elbar button:hover, .builder-elbar button.on { background: rgba(255,255,255,.14); color: #fff; }
      .builder-elbar button.danger:hover { background: #dc2626; }
      .builder-elbar .el-color { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; cursor: pointer; }
      .builder-elbar .el-color input { width: 20px; height: 20px; border: 0; padding: 0; background: none; cursor: pointer; }
      .builder-editing { outline: 2px solid #2563eb !important; outline-offset: 3px; cursor: text !important; background: rgba(37,99,235,.06); border-radius: 4px; }
    `,
  };
}
