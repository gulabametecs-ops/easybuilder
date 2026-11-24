import { notFound } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { getCurrentTenant } from "@/lib/tenant";
import { TrackLookup } from "@/components/site/TrackClient";

export const metadata = { title: "Track your order", robots: { index: false } };

export default async function TrackPage() {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  return (
    <section className="py-14 sm:py-20 bg-light min-h-[60vh]">
      <div className="mx-auto max-w-md px-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4"><PackageSearch className="w-7 h-7" /></div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-heading">Track your order</h1>
          <p className="text-slate-500 mt-2">Enter your order number and the phone number you used at checkout.</p>
        </div>
        <TrackLookup />
      </div>
    </section>
  );
}
