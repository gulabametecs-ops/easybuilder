import { redirect } from "next/navigation";
import { getCurrentTenant } from "@/lib/tenant";
import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";
import { isDemoSubdomain } from "@/lib/demoSession";

export const metadata = { title: "Forgot password" };

export default async function ForgotPasswordPage() {
  const tenant = await getCurrentTenant();
  if (tenant && isDemoSubdomain(tenant.subdomain)) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-900">Forgot password</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter your email for {tenant?.name ?? "this site"} and we&apos;ll send a reset link.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
