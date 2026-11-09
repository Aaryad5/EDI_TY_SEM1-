"use client";

import * as React from "react";
import Link from "next/link";
import { KeyRound, Send, Loader2, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { validateForgotPassword } from "@/lib/validators";
import { authService } from "@/lib/services/authService";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForgotPassword({ email });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setBusy(true);
    try {
      const res = await authService.forgotPassword(email);
      setSent(true);
      toast({ variant: "success", title: "Reset link sent", description: res.message });
    } catch (err) {
      toast({ variant: "destructive", title: "Request failed", description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-6 lg:hidden"><Logo /></div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark">Reset your password</h2>
        <p className="mt-1 text-sm text-dark/55">
          {sent
            ? "If that email is registered, a reset link is on its way."
            : "Enter your account email and we’ll send a password reset link."}
        </p>
      </div>

      {!sent ? (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="mr-1 h-4 w-4" />}
            Send Reset Link
          </Button>
        </form>
      ) : (
        <div className="rounded-xl border border-fresh/30 bg-fresh/10 p-4 text-sm text-forest">
          <KeyRound className="mb-1 h-5 w-5 text-agri" />
          Check <strong>{email}</strong> for a link to create a new password.
        </div>
      )}

      <Link href="/login" className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-agri hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </div>
  );
}