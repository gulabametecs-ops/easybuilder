export type TenantPayments = {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayWebhookSecret: string; // store webhooks (/api/store/razorpay-webhook); server-only
  upiId: string;
  upiQrImage: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  paymentNote: string;
};

export type PublicPayments = Omit<TenantPayments, "razorpayKeySecret" | "razorpayWebhookSecret"> & {
  razorpayReady: boolean;
};

export const DEFAULT_PAYMENTS: TenantPayments = {
  razorpayKeyId: "",
  razorpayKeySecret: "",
  razorpayWebhookSecret: "",
  upiId: "",
  upiQrImage: "",
  accountName: "",
  accountNumber: "",
  ifsc: "",
  bankName: "",
  paymentNote: "",
};

export function parsePayments(raw: string | null | undefined): TenantPayments {
  try {
    return { ...DEFAULT_PAYMENTS, ...(JSON.parse(raw || "{}") as object) };
  } catch {
    return { ...DEFAULT_PAYMENTS };
  }
}

export function toPublicPayments(p: TenantPayments): PublicPayments {
  return {
    razorpayKeyId: p.razorpayKeyId,
    upiId: p.upiId,
    upiQrImage: p.upiQrImage,
    accountName: p.accountName,
    accountNumber: p.accountNumber,
    ifsc: p.ifsc,
    bankName: p.bankName,
    paymentNote: p.paymentNote,
    razorpayReady: Boolean(p.razorpayKeyId && p.razorpayKeySecret),
  };
}

export function upiPayLink(upiId: string, name: string, amountInr?: number): string {
  const parts = [`upi://pay?pa=${encodeURIComponent(upiId)}`, `pn=${encodeURIComponent(name || "Donate")}`, "cu=INR"];
  if (amountInr && amountInr > 0) parts.push(`am=${amountInr}`);
  return parts.join("&");
}

export function qrImageForData(data: string, size = 240): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}
