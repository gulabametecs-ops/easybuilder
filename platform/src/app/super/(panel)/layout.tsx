import { redirect } from "next/navigation";
import { getSuperSession } from "@/lib/superAuth";
import { SuperSidebar } from "@/components/super/SuperSidebar";

export const metadata = { title: "Super Admin" };

export default async function SuperPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await getSuperSession())) redirect("/super/login");
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 lg:flex">
      <SuperSidebar />
      <div className="flex-1 min-w-0 admin-shell">
        <main className="p-5 sm:p-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
