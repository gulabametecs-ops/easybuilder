import { redirect } from "next/navigation";
import { getSuperSession } from "@/lib/superAuth";
import { SuperLoginForm } from "@/components/super/SuperLoginForm";

export const metadata = { title: "Super Admin Login" };

export default async function SuperLoginPage() {
  if (await getSuperSession()) redirect("/super");
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <SuperLoginForm />
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">Platform control panel</p>
      </div>
    </div>
  );
}
