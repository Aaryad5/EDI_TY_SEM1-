"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import { validateSignup } from "@/lib/validators";

const LANGUAGES = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Punjabi", "Gujarati"];

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [form, setForm] = React.useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    country: "India",
    state: "",
    district: "",
    preferredLanguage: "English",
    agreed: false,
  });

  const set = (k: keyof typeof form, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const handleGoogle = async () => {
    setBusy(true);
    try {
      await signInWithGoogle();
      toast({ variant: "success", title: "Account created with Google", description: "Welcome to AgriVerse AI!" });
      router.push("/farms/add/location");
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateSignup(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setBusy(true);
    try {
      await signUp({
        fullName: form.fullName,
        username: form.username || form.email.split("@")[0],
        email: form.email,
        phone: form.phone,
        password: form.password,
        country: form.country,
        state: form.state,
        district: form.district,
        preferredLanguage: form.preferredLanguage,
      });
      toast({ variant: "success", title: "Account created", description: "Welcome to AgriVerse AI! Next: Choose your farm parcel." });
      router.push("/farms/add/location");
    } catch (err) {
      toast({ variant: "destructive", title: "Sign up failed", description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-6 lg:hidden"><Logo /></div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark">Create your account</h2>
        <p className="mt-1 text-sm text-dark/55">Set up farm intelligence in minutes. It’s free to start.</p>
      </div>

      <Button variant="outline" className="mb-4 w-full" onClick={handleGoogle} disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (
          <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.84 0 .48 5.36.48 12s5.36 12 12 12c6.16 0 11.093-4.307 11.093-11.88 0-1.04-.08-1.733-.267-2.44l-10.826-.76z" />
          </svg>
        )}
        Continue with Google
      </Button>

      <div className="relative my-5 text-center">
        <span className="absolute inset-0 flex items-center"><span className="w-full border-t border-agri/10" /></span>
        <span className="relative bg-inherit px-3 text-xs text-dark/40">or register with email</span>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Aarya Patil" />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={form.username} onChange={(e) => set("username", e.target.value)} placeholder="aarya" />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="98765 43210" />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>
          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={form.preferredLanguage} onValueChange={(v) => set("preferredLanguage", v)}>
              <SelectTrigger id="language"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Country</Label>
            <Input value={form.country} onChange={(e) => set("country", e.target.value)} />
          </div>
          <div>
            <Label>State</Label>
            <Input value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="Maharashtra" />
            {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
          </div>
        </div>
        <div>
          <Label>District / Village</Label>
          <Input value={form.district} onChange={(e) => set("district", e.target.value)} placeholder="Pune" />
          {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min 8 chars, letters + numbers" />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>
          <div>
            <Label htmlFor="confirm">Confirm</Label>
            <Input id="confirm" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox id="agreed" checked={form.agreed} onCheckedChange={(v) => set("agreed", v === true)} />
          <label htmlFor="agreed" className="text-sm text-dark/60">
            I agree to the <span className="text-agri">Terms</span> and <span className="text-agri">Privacy Policy</span>.
          </label>
        </div>
        {errors.agreed && <p className="text-xs text-red-500">{errors.agreed}</p>}
        <Button type="submit" variant="primary" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="mr-1 h-4 w-4" />}
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-dark/55">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-agri hover:underline">Sign in</Link>
      </p>
    </div>
  );
}