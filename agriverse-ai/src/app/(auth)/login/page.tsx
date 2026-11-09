"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, LogIn, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import { validateLogin } from "@/lib/validators";

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLogin({ email, password });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setBusy(true);
    try {
      await signIn(email, password);
      toast({ variant: "success", title: "Welcome back", description: "Signed in successfully." });
      router.push("/dashboard");
    } catch (err) {
      toast({ variant: "destructive", title: "Sign in failed", description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    try {
      await signInWithGoogle();
      toast({ variant: "success", title: "Signed in with Google", description: "Demo OAuth — real provider is wired in production." });
      router.push("/dashboard");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-6 lg:hidden"><Logo /></div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark">Welcome back</h2>
        <p className="mt-1 text-sm text-dark/55">Sign in to your AgriVerse AI account to manage your farms.</p>
      </div>

      <Button variant="outline" className="mb-4 w-full" onClick={google} disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (
          <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.84 0 .48 5.36.48 12s5.36 12 12 12c6.16 0 11.093-4.307 11.093-11.88 0-1.04-.08-1.733-.267-2.44l-10.826-.76z" />
          </svg>
        )}
        Continue with Google
      </Button>

      <div className="relative my-5 text-center">
        <span className="absolute inset-0 flex items-center"><span className="w-full border-t border-agri/10" /></span>
        <span className="relative bg-inherit px-3 text-xs text-dark/40">or with email</span>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-agri hover:underline">Forgot password?</Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
          <label htmlFor="remember" className="text-sm text-dark/60">Remember me</label>
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="mr-1 h-4 w-4" />}
          Sign In
        </Button>
      </form>

      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-dark/55">
        <Lock className="h-3.5 w-3.5 text-agri" />
        <span>Mock auth</span>
        <Badge variant="soft">demo</Badge>
      </div>

      <p className="mt-6 text-center text-sm text-dark/55">
        New to AgriVerse?{" "}
        <Link href="/signup" className="font-semibold text-agri hover:underline">Create an account</Link>
      </p>
    </div>
  );
}