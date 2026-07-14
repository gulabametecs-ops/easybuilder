import { db } from "@/lib/db";
import { getSuperSession } from "@/lib/superAuth";
import { verticalName } from "@/lib/verticals";
import { formatINR } from "@/lib/plans";

function csv(rows: (string | number)[][]): string {
  return rows
    .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
}
function file(name: string, body: string) {
  return new Response(body, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${name}"` },
  });
}

export async function GET(request: Request) {
  if (!(await getSuperSession())) return new Response("Unauthorized", { status: 401 });
  const type = new URL(request.url).searchParams.get("type") ?? "clients";

  if (type === "orders") {
    const orders = await db.order.findMany({ orderBy: { createdAt: "desc" } });
    const rows: (string | number)[][] = [["Date", "Customer", "Email", "Phone", "Sector", "Plan", "Amount", "Status", "Gateway"]];
    for (const o of orders) rows.push([o.createdAt.toISOString().slice(0, 10), o.customerName, o.email, o.phone, verticalName(o.vertical), o.plan, formatINR(o.amount), o.status, o.gateway]);
    return file("orders.csv", csv(rows));
  }

  if (type === "leads") {
    const leads = await db.platformLead.findMany({ orderBy: { createdAt: "desc" } });
    const rows: (string | number)[][] = [["Date", "Name", "Email", "Phone", "Company", "Sector", "Type"]];
    for (const l of leads) rows.push([l.createdAt.toISOString().slice(0, 10), l.name, l.email, l.phone, l.company, l.vertical ? verticalName(l.vertical) : "", l.type]);
    return file("enquiries.csv", csv(rows));
  }

  const clients = await db.tenant.findMany({ orderBy: { createdAt: "desc" }, include: { users: { take: 1 }, _count: { select: { leads: true } } } });
  const rows: (string | number)[][] = [["Created", "Business", "Subdomain", "Sector", "Plan", "Status", "License ends", "Owner email", "Leads"]];
  for (const c of clients) rows.push([c.createdAt.toISOString().slice(0, 10), c.name, c.subdomain, verticalName(c.vertical), c.plan, c.status, c.subscriptionEndsAt ? new Date(c.subscriptionEndsAt).toISOString().slice(0, 10) : "Lifetime", c.users[0]?.email ?? "", c._count.leads]);
  return file("clients.csv", csv(rows));
}
