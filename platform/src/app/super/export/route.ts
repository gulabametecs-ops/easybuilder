import { db } from "@/lib/db";
import { getSuperSession } from "@/lib/superAuth";
import { verticalName } from "@/lib/verticals";
import { formatINR } from "@/lib/plans";

function csv(rows: (string | number)[][]): string {
  return rows
    // Leading = + - @ would run as a formula in Excel — prefix with ' (CSV injection).
    .map((r) => r.map((c) => `"${String(c ?? "").replace(/^([=+\-@])/, "'$1").replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
}
function file(name: string, body: string) {
  return new Response(body, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${name}"` },
  });
}

export async function GET(request: Request) {
  if (!(await getSuperSession())) return new Response("Unauthorized", { status: 401 });
  const params = new URL(request.url).searchParams;
  const type = params.get("type") ?? "clients";

  if (type === "orders") {
    // Same optional filters as the Orders page (q, status) so "Export" matches what's on screen.
    const q = params.get("q")?.trim();
    const status = params.get("status") || undefined;
    const orders = await db.order.findMany({
      where: {
        ...(q ? { OR: [{ customerName: { contains: q } }, { email: { contains: q } }, { subdomain: { contains: q } }] } : {}),
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    const rows: (string | number)[][] = [["Date", "Customer", "Email", "Phone", "Sector", "Plan", "Amount", "Status", "Gateway"]];
    for (const o of orders) rows.push([o.createdAt.toISOString().slice(0, 10), o.customerName, o.email, o.phone, verticalName(o.vertical), o.plan, formatINR(o.amount), o.status, o.gateway]);
    return file("orders.csv", csv(rows));
  }

  if (type === "payouts") {
    const ws = await db.referralWithdrawal.findMany({ orderBy: { createdAt: "desc" }, include: { tenant: { select: { name: true, subdomain: true } } } });
    const rows: (string | number)[][] = [["Requested", "Business", "Subdomain", "Gross (INR)", "TDS (INR)", "Net (INR)", "Method", "UPI", "Account name", "Account no.", "IFSC", "PAN", "Status", "UTR", "Processed"]];
    for (const w of ws) rows.push([w.createdAt.toISOString().slice(0, 10), w.tenant.name, w.tenant.subdomain, (w.amount / 100).toFixed(2), (w.tdsAmount / 100).toFixed(2), (w.netAmount / 100).toFixed(2), w.method, w.upiId, w.accountName, w.accountNumber, w.ifsc, w.pan, w.status, w.reference, w.processedAt ? w.processedAt.toISOString().slice(0, 10) : ""]);
    return file("payouts.csv", csv(rows));
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
