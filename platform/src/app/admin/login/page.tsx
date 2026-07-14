import { redirect } from "next/navigation";
import { getCurrentTenant } from "@/lib/tenant";
import { getAuthedSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  const tenant = await getCurrentTenant();
  // Already logged in? go to dashboard.
  const authed = await getAuthedSession();
  if (authed) redirect("/admin");

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
            <p className="text-sm text-slate-500 mt-1">Sign in to manage your website</p>
          </div>
          <LoginForm />
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">Powered by Standard SaaS</p>
      </div>
    </div>
  );
}
