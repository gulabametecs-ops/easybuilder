"use client";

import { useState, useTransition } from "react";
import { Rocket } from "lucide-react";
import { retryProvisionForOrder } from "@/lib/actions/checkout";

// Recovers a paid-but-not-live order: retries provisioning, prompting for a
// temporary admin password if the order predates password storage.
export function RetryProvisionButton({ orderId }: { orderId: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const run = (tempPassword?: string) => start(async () => {
    const res = await retryProvisionForOrder(orderId, tempPassword);
    if (res.ok) {
      setMsg("✅ Live now");
      alert(`Site is live!\n\n${res.url}\nAdmin: ${res.adminUrl}\nLogin: ${res.email}`);
    } else if (/set password/i.test(res.message)) {
      const pw = prompt("This order has no saved password. Enter a temporary admin password (min 6 chars) to set up the client's site:");
      if (pw && pw.length >= 6) run(pw);
      else if (pw !== null) alert("Password must be at least 6 characters.");
    } else {
      setMsg("⚠ " + res.message);
      alert(res.message);
    }
  });

  return (
    <button onClick={() => run()} disabled={pending} className="inline-flex items-center gap-1 text-indigo-600 hover:underline disabled:opacity-60">
      <Rocket className="w-3.5 h-3.5" /> {pending ? "Setting up…" : msg ?? "Go live"}
    </button>
  );
}
