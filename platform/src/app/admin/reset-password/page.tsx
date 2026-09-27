import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";

export const metadata = { title: "Reset password" };

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-900">Choose a new password</h1>
          <p className="text-sm text-slate-500 mt-1">Your reset link is valid for 1 hour.</p>
        </div>
        {!token ? (
          <p className="text-sm text-red-600 text-center">Missing or invalid reset token.</p>
        ) : (
          <ResetPasswordForm token={token} />
        )}
      </div>
    </div>
  );
}
