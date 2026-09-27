// Lightweight HTML sanitizer for tenant-authored rich text / custom HTML.
// Strips script/style/iframe/object/embed and inline event handlers.
// Not a full XSS firewall — paired with auth so only the site owner can set HTML.

const BLOCKED_TAGS = /<\/?(?:script|iframe|object|embed|link|meta|base|form|input|button|textarea|select|option|svg|math)(?:\s[^>]*)?>/gi;
const EVENT_ATTRS = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_URLS = /\s+(href|src|action|formaction)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*'|\s*javascript:[^\s>]+)/gi;
const DATA_SCRIPT = /\s+(href|src)\s*=\s*(?:"\s*data:text\/html[^"]*"|'\s*data:text\/html[^']*')/gi;

export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(BLOCKED_TAGS, "")
    .replace(EVENT_ATTRS, "")
    .replace(JS_URLS, "")
    .replace(DATA_SCRIPT, "");
}

/** Escape text for safe insertion into HTML email / templates. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Allow only http(s), mailto, tel, hash anchors, or same-site relative paths.
 * Blocks javascript:, data:, vbscript:, protocol-relative //evil.com, etc.
 */
export function safeHref(url: string, maxLen = 2000): string {
  const u = (url || "").trim().slice(0, maxLen);
  if (!u) return "";
  if (u === "#") return u;
  if (u.startsWith("#") && !/[\s\\]/.test(u) && !/^#.*javascript:/i.test(u)) return u;
  if (u.startsWith("/") && !u.startsWith("//")) return u;
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
  return "";
}

/** Strip anything that could break out of a <style> tag. */
export function sanitizeCss(css: string): string {
  if (!css) return "";
  return css.replace(/<\/?style/gi, "").replace(/</g, "");
}
