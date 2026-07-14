"use client";

import { useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { recordRefund } from "@/lib/actions/superAdmin";

export function RefundButton({ orderId }: { orderId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => {
        const reason = prompt("Refund reason? (optional)");
        if (reason === null) return; // cancelled
        const fd = new FormData();
        fd.set("orderId", orderId);
        fd.set("reason", reason);
        start(() => recordRefund(fd));
      }}
      className="inline-flex items-center gap-1 text-amber-600 hover:underline disabled:opacity-50"
      title="Record refund"
    >
      <RotateCcw className="w-3.5 h-3.5" /> Refund
    </button>
  );
}
