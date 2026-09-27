import { getAuthedSession } from "@/lib/auth";
import { getCurrentTenant } from "@/lib/tenant";
import { checkAdminAccess } from "@/lib/subscription";
import {
  getActiveDemoSessionForTenant,
  isDemoSubdomain,
  loadDemoOverlay,
  saveDemoOverlay,
  type DemoOverlay,
} from "@/lib/demoSession";

export type Authed = NonNullable<Awaited<ReturnType<typeof getAuthedSession>>>;

/**
 * `demoOk`: the action is sandbox-aware (writes to the demo overlay or tags rows
 * with the demo session). Demo-visitor sessions are refused everywhere else, and
 * even sandbox-aware actions need a still-active demo session.
 */
type GuardOpts = { demoOk?: boolean };

export async function requireAuth(opts: GuardOpts = {}): Promise<Authed> {
  const authed = await getAuthedSession();
  if (!authed) throw new Error("Unauthorized");
  if (authed.session.demo) {
    if (!opts.demoOk) throw new Error("This action is disabled in demo mode.");
    if (!(await getActiveDemoSessionForTenant(authed.tenant))) throw new Error("Demo session expired.");
  } else if (!checkAdminAccess(authed.tenant).allowed) {
    // Same rule as the admin layout — server actions don't pass through the layout.
    throw new Error("Account suspended or subscription expired.");
  }
  return authed;
}

export async function requireTenantId(opts: GuardOpts = {}): Promise<string> {
  return (await requireAuth(opts)).tenant.id;
}

export async function requireRole(roles: Array<string>, opts: GuardOpts = {}): Promise<Authed> {
  const authed = await requireAuth(opts);
  if (!roles.includes(authed.session.role)) throw new Error("Forbidden");
  return authed;
}

/** Demo sandbox write context — mutations go to overlay, not tenant DB. */
export type DemoWriteCtx = {
  sessionId: string;
  overlay: DemoOverlay;
  tenantId: string;
};

/**
 * Returns demo sandbox if visitor has active demo session on a demo tenant.
 * Otherwise returns null (caller should use normal tenant auth).
 */
export async function getDemoWriteContext(): Promise<DemoWriteCtx | null> {
  const tenant = await getCurrentTenant();
  if (!tenant || !isDemoSubdomain(tenant.subdomain)) return null;
  const session = await getActiveDemoSessionForTenant(tenant);
  if (!session) return null;
  const overlay = await loadDemoOverlay(session.id);
  return { sessionId: session.id, overlay, tenantId: tenant.id };
}

/** Demo session id for tagging creates (null when not in a demo sandbox). */
export async function getDemoSessionId(): Promise<string | null> {
  const demo = await getDemoWriteContext();
  return demo?.sessionId ?? null;
}

export async function persistDemoOverlay(sessionId: string, overlay: DemoOverlay) {
  await saveDemoOverlay(sessionId, overlay);
}
