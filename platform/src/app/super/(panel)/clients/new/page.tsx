import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader, Card } from "@/components/admin/ui";
import { ClientCreateForm } from "@/components/super/ClientCreateForm";

export const metadata = { title: "Add Client" };

export default function NewClientPage() {
  return (
    <>
      <Link href="/super/clients" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to clients
      </Link>
      <PageHeader title="Add a client" subtitle="Manually create and provision a client website." />
      <Card className="p-6">
        <ClientCreateForm />
      </Card>
    </>
  );
}
