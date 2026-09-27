import { redirect } from "next/navigation";
import { getCurrentTenant } from "@/lib/tenant";
import { getAuthedSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { getActiveDemoSessionForTenant, isDemoSubdomain } from "@/lib/demoSession";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  const tenant = await getCurrentTenant();
  const authed = await getAuthedSession();
  if (authed) redirect("/admin");

  const isDemo = !!(tenant && isDemoSubdomain(tenant.subdomain));
  const demoSession = isDemo ? await getActiveDemoSessionForTenant(tenant!) : null;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-lime-400 font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
              {(tenant?.name ?? "SS")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <h1 className="text-xl font-bold text-slate-900">{tenant?.name ?? "Admin"}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {demoSession
                ? "Temporary demo login — expires with your 10-min session"
                : isDemo
                  ? "Verify OTP on /demos first to get temporary credentials"
                  : "Sign in to manage your website"}
            </p>
          </div>

          {demoSession && demoSession.adminUsername && demoSession.adminPassword ? (
            <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-950 space-y-1.5">
              <p className="font-semibold">Your temporary credentials</p>
              <p>
                Username: <span className="font-mono font-bold">{demoSession.adminUsername}</span>
              </p>
              <p>
                Password: <span className="font-mono font-bold">{demoSession.adminPassword}</span>
              </p>
              <p className="text-xs text-amber-800 pt-1">
                Unique to you. After 10 minutes these expire and all demo changes (leads, notices, etc.) are deleted.
              </p>
            </div>
          ) : null}

          <LoginForm
            isDemo={isDemo}
            defaultUsername={demoSession?.adminUsername || undefined}
            defaultPassword={demoSession?.adminPassword || undefined}
          />
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">Powered by Standard SaaS</p>
      </div>
    </div>
  );
}
