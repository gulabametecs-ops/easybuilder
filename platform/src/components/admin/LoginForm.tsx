"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/lib/actions/auth";
import { LogIn } from "lucide-react";

const initial: AuthState = { error: "" };

export function LoginForm({
  isDemo,
  defaultUsername,
  defaultPassword,
}: {
  isDemo?: boolean;
  defaultUsername?: string;
  defaultPassword?: string;
} = {}) {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          {isDemo ? "Username" : "Email"}
        </label>
        <input
          name="email"
          type={isDemo ? "text" : "email"}
          required
          defaultValue={defaultUsername}
          autoComplete="username"
          placeholder={isDemo ? "demo_xxxxxx" : "you@business.com"}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
        <input
          name="password"
          type="password"
          required
          defaultValue={defaultPassword}
          autoComplete={isDemo ? "current-password" : "current-password"}
          placeholder="••••••••"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white font-semibold px-4 py-2.5 text-sm hover:bg-slate-800 disabled:opacity-60"
      >
        <LogIn className="w-4 h-4" />
        {pending ? "Signing in..." : "Sign in"}
      </button>
      {!isDemo && (
        <p className="text-center text-sm text-slate-500">
          <a href="/admin/forgot-password" className="text-lime-700 font-medium hover:underline">Forgot password?</a>
        </p>
      )}
    </form>
  );
}
