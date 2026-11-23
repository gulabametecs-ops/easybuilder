/** Demo site URL with a design preview; works for plain URLs and /api/demo/establish links. Shared by server + client. */
export function previewUrl(siteUrl: string, designId: string) {
  try {
    const u = new URL(siteUrl);
    if (u.pathname.includes("/api/demo/establish")) {
      const to = u.searchParams.get("to") || "/";
      const dest = new URL(to, u.origin);
      dest.searchParams.set("design", designId);
      u.searchParams.set("to", `${dest.pathname}${dest.search}`);
      return u.toString();
    }
    u.searchParams.set("design", designId);
    return u.toString();
  } catch {
    return `${siteUrl}${siteUrl.includes("?") ? "&" : "?"}design=${designId}`;
  }
}
