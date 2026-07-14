// Host parsing — decides whether an incoming request is for the marketing site
// (root domain) or a tenant site (subdomain / custom domain).

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

// Header names used to pass the resolved tenant from the proxy to the app.
export const TENANT_HEADER = "x-tenant-key"; // subdomain OR custom domain hostname
export const TENANT_KIND_HEADER = "x-tenant-kind"; // "subdomain" | "custom"

export type HostInfo =
  | { kind: "marketing" }
  | { kind: "subdomain"; key: string }
  | { kind: "custom"; key: string };

function stripPort(host: string): string {
  return host.split(":")[0];
}

// The root domain without port, e.g. "localhost" or "myplatform.com".
function rootHostname(): string {
  return stripPort(ROOT_DOMAIN);
}

export function parseHost(rawHost: string | null | undefined): HostInfo {
  if (!rawHost) return { kind: "marketing" };
  const host = stripPort(rawHost).toLowerCase();
  const root = rootHostname();

  // Root domain or www -> marketing site
  if (host === root || host === `www.${root}`) {
    return { kind: "marketing" };
  }

  // Subdomain of the root domain -> tenant by subdomain
  if (host.endsWith(`.${root}`)) {
    const key = host.slice(0, host.length - root.length - 1);
    // guard against nested like a.b.root -> take the left-most label group
    if (key && key !== "www") return { kind: "subdomain", key };
    return { kind: "marketing" };
  }

  // Anything else is a connected custom domain -> tenant by custom domain
  return { kind: "custom", key: host };
}
