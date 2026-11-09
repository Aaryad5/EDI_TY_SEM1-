"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  LogIn,
  UserPlus,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  MapPin,
  Cpu,
  Layers,
  Leaf,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateLogin, validateSignup } from "@/lib/validators";

const LANGUAGES = [
  "English",
  "Hindi (हिंदी)",
  "Marathi (मराठी)",
  "Punjabi (ਪੰਜਾਬੀ)",
  "Gujarati (ગુજરાતી)",
  "Tamil (தமிழ்)",
  "Telugu (తెలుగు)",
];

export default function RootAuthScreen() {
  const { user, activeFarm, signIn, signUp, signInWithGoogle, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [busy, setBusy] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = React.useState("aarya@agriverse.ai");
  const [signInPassword, setSignInPassword] = React.useState("password123");
  const [rememberMe, setRememberMe] = React.useState(true);
  const [signInErrors, setSignInErrors] = React.useState<Record<string, string>>({});

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = React.useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    country: "India",
    state: "Maharashtra",
    district: "Pune",
    preferredLanguage: "English",
    agreed: false,
  });
  const [signUpErrors, setSignUpErrors] = React.useState<Record<string, string>>({});

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLogin({ email: signInEmail, password: signInPassword });
    if (Object.keys(errs).length) {
      setSignInErrors(errs);
      return;
    }
    setSignInErrors({});
    setBusy(true);
    try {
      await signIn(signInEmail, signInPassword);
      toast({
        variant: "success",
        title: "Welcome to AgriVerse AI",
        description: "Authenticated successfully. Loading your farm intelligence.",
      });
      router.push("/dashboard");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: err instanceof Error ? err.message : "Authentication error",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleQuickDemo = async () => {
    setBusy(true);
    try {
      await signIn("aarya@agriverse.ai", "password123");
      toast({
        variant: "success",
        title: "Demo Farmer Access Granted",
        description: "Welcome back, Aarya! Loaded Patil Green Valley Farm (Pune).",
      });
      router.push("/dashboard");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Demo sign in failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      await signInWithGoogle();
      toast({
        variant: "success",
        title: "Signed in with Google",
        description: "Welcome to AgriVerse AI!",
      });
      router.push("/dashboard");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Google sign in failed",
        description: err instanceof Error ? err.message : "OAuth error",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateSignup(signUpForm);
    if (Object.keys(errs).length) {
      setSignUpErrors(errs);
      return;
    }
    setSignUpErrors({});
    setBusy(true);
    try {
      await signUp({
        fullName: signUpForm.fullName,
        username: signUpForm.username || signUpForm.fullName.toLowerCase().replace(/\s+/g, "_"),
        email: signUpForm.email,
        phone: signUpForm.phone,
        password: signUpForm.password,
        country: signUpForm.country,
        state: signUpForm.state,
        district: signUpForm.district,
        preferredLanguage: signUpForm.preferredLanguage,
      });
      toast({
        variant: "success",
        title: "Account Created Successfully",
        description: "Proceeding to Step 2: Select your farm parcel location.",
      });
      // Flow Step 2: SELECT FARM LOCATION
      router.push("/farms/add/location");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err instanceof Error ? err.message : "Sign up error",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-[#0d2818]">
      {/* Background: Agricultural field landscape with soft green atmospheric overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />
      {/* Agricultural green gradients and soft vignette */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0d2818]/90 via-[#1b4332]/85 to-[#081c15]/90 backdrop-blur-[2px]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(82,183,136,0.25),transparent_60%)]" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          
          {/* Left / Center Column: Floating White Auth Card */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="w-full rounded-2xl border border-white/40 bg-white/95 p-6 shadow-2xl backdrop-blur-md sm:p-8">
              
              {/* Brand Header */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#e8f5e9] p-3 text-[#2d6a4f] shadow-inner mb-3">
                  <Sprout className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#1b4332] sm:text-3xl">
                  AgriVerse AI
                </h1>
                <p className="mt-1 text-xs font-semibold text-[#2d6a4f]">
                  AI-Powered Digital Twin for Smart Agriculture
                </p>
                <p className="text-[11px] text-slate-500 italic">
                  &ldquo;From Your Field to a Smarter Future&rdquo;
                </p>
              </div>

              {/* If user is already authenticated */}
              {user && (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2d6a4f] text-white font-bold text-xs">
                      {user.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-emerald-950">Active Session</p>
                      <p className="truncate text-sm font-bold text-[#1b4332]">
                        {user.fullName} <span className="text-xs font-normal text-emerald-700">(@{user.username || "farmer"})</span>
                      </p>
                      {activeFarm && (
                        <p className="mt-0.5 text-xs text-slate-600 truncate">
                          Farm: {activeFarm.name} ({activeFarm.areaValue} {activeFarm.areaUnit})
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button
                      variant="primary"
                      className="w-full justify-between bg-[#2d6a4f] hover:bg-[#1b4332] text-white shadow-sm"
                      onClick={() => router.push("/dashboard")}
                    >
                      <span>Continue to Farm Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <Link
                        href="/farms/add/location"
                        className="font-medium text-[#2d6a4f] hover:underline"
                      >
                        + Add New Farm Location
                      </Link>
                      <button
                        type="button"
                        onClick={() => signOut()}
                        className="font-medium text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <LogOut className="h-3 w-3" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs: Sign In / Sign Up */}
              {!user && (
                <>
                  <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                        mode === "signin"
                          ? "bg-white text-[#1b4332] shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                        mode === "signup"
                          ? "bg-white text-[#1b4332] shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Create Account
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {mode === "signin" ? (
                      /* SIGN IN FORM */
                      <motion.div
                        key="signin"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="mt-5 space-y-4"
                      >
                        {/* 1-Click Instant Demo Button */}
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5">
                          <button
                            type="button"
                            onClick={handleQuickDemo}
                            disabled={busy}
                            className="flex w-full items-center justify-between text-left text-xs text-emerald-950 hover:opacity-90"
                          >
                            <div>
                              <span className="font-bold text-[#2d6a4f] flex items-center gap-1">
                                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                Instant Demo Access
                              </span>
                              <span className="text-[11px] text-slate-600 block">
                                Aarya Patil • Pune (2.3 ac Wheat)
                              </span>
                            </div>
                            <span className="rounded-md bg-[#2d6a4f] px-2 py-1 text-[10px] font-bold text-white shrink-0">
                              Quick Enter →
                            </span>
                          </button>
                        </div>

                        {/* Google OAuth Button */}
                        <Button
                          variant="outline"
                          className="w-full border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          onClick={handleGoogle}
                          disabled={busy}
                        >
                          {busy ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="currentColor" aria-hidden>
                              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.84 0 .48 5.36.48 12s5.36 12 12 12c6.16 0 11.093-4.307 11.093-11.88 0-1.04-.08-1.733-.267-2.44l-10.826-.76z" />
                            </svg>
                          )}
                          Continue with Google
                        </Button>

                        <div className="relative text-center my-2">
                          <span className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                          </span>
                          <span className="relative bg-white px-2 text-[11px] text-slate-400">
                            or with credentials
                          </span>
                        </div>

                        <form onSubmit={handleSignIn} className="space-y-3">
                          <div>
                            <Label htmlFor="signin-email" className="text-xs text-slate-700">
                              Email or Mobile Number
                            </Label>
                            <Input
                              id="signin-email"
                              type="text"
                              value={signInEmail}
                              onChange={(e) => setSignInEmail(e.target.value)}
                              placeholder="aarya@agriverse.ai"
                              className="mt-1 h-9 text-xs"
                              required
                            />
                            {signInErrors.email && (
                              <p className="mt-1 text-[11px] text-rose-500">{signInErrors.email}</p>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="signin-password" className="text-xs text-slate-700">
                                Password
                              </Label>
                              <Link
                                href="/forgot-password"
                                className="text-[11px] font-medium text-[#2d6a4f] hover:underline"
                              >
                                Forgot password?
                              </Link>
                            </div>
                            <div className="relative mt-1">
                              <Input
                                id="signin-password"
                                type={showPassword ? "text" : "password"}
                                value={signInPassword}
                                onChange={(e) => setSignInPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-9 pr-9 text-xs"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              >
                                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                            {signInErrors.password && (
                              <p className="mt-1 text-[11px] text-rose-500">{signInErrors.password}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <Checkbox
                              id="remember-me"
                              checked={rememberMe}
                              onCheckedChange={(v) => setRememberMe(v === true)}
                            />
                            <label htmlFor="remember-me" className="text-xs text-slate-600 cursor-pointer">
                              Remember me for 30 days
                            </label>
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-10 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold text-xs shadow-md transition-all mt-2"
                            disabled={busy}
                          >
                            {busy ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <LogIn className="mr-2 h-4 w-4" />
                            )}
                            Sign In to Farm Intelligence
                          </Button>
                        </form>

                        <p className="text-center text-xs text-slate-500 pt-1">
                          Don&apos;t have an account?{" "}
                          <button
                            type="button"
                            onClick={() => setMode("signup")}
                            className="font-semibold text-[#2d6a4f] hover:underline"
                          >
                            Sign Up
                          </button>
                        </p>
                      </motion.div>
                    ) : (
                      /* SIGN UP FORM */
                      <motion.div
                        key="signup"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="mt-5 space-y-3"
                      >
                        <form onSubmit={handleSignUp} className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs text-slate-700">Full Name</Label>
                              <Input
                                value={signUpForm.fullName}
                                onChange={(e) =>
                                  setSignUpForm((p) => ({ ...p, fullName: e.target.value }))
                                }
                                placeholder="Aarya Patil"
                                className="mt-1 h-8 text-xs"
                                required
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-slate-700">Username</Label>
                              <Input
                                value={signUpForm.username}
                                onChange={(e) =>
                                  setSignUpForm((p) => ({ ...p, username: e.target.value }))
                                }
                                placeholder="aarya"
                                className="mt-1 h-8 text-xs"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs text-slate-700">Email Address</Label>
                              <Input
                                type="email"
                                value={signUpForm.email}
                                onChange={(e) =>
                                  setSignUpForm((p) => ({ ...p, email: e.target.value }))
                                }
                                placeholder="aarya@agriverse.ai"
                                className="mt-1 h-8 text-xs"
                                required
                              />
                              {signUpErrors.email && (
                                <p className="mt-0.5 text-[10px] text-rose-500">{signUpErrors.email}</p>
                              )}
                            </div>
                            <div>
                              <Label className="text-xs text-slate-700">Phone Number</Label>
                              <Input
                                type="tel"
                                value={signUpForm.phone}
                                onChange={(e) =>
                                  setSignUpForm((p) => ({ ...p, phone: e.target.value }))
                                }
                                placeholder="+91 98230 12345"
                                className="mt-1 h-8 text-xs"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs text-slate-700">Password</Label>
                              <Input
                                type="password"
                                value={signUpForm.password}
                                onChange={(e) =>
                                  setSignUpForm((p) => ({ ...p, password: e.target.value }))
                                }
                                placeholder="••••••••"
                                className="mt-1 h-8 text-xs"
                                required
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-slate-700">Confirm Password</Label>
                              <Input
                                type="password"
                                value={signUpForm.confirmPassword}
                                onChange={(e) =>
                                  setSignUpForm((p) => ({ ...p, confirmPassword: e.target.value }))
                                }
                                placeholder="••••••••"
                                className="mt-1 h-8 text-xs"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-slate-700">Preferred Language</Label>
                            <Select
                              value={signUpForm.preferredLanguage}
                              onValueChange={(v) =>
                                setSignUpForm((p) => ({ ...p, preferredLanguage: v }))
                              }
                            >
                              <SelectTrigger className="mt-1 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {LANGUAGES.map((lang) => (
                                  <SelectItem key={lang} value={lang.split(" ")[0]} className="text-xs">
                                    {lang}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-start gap-2 pt-1">
                            <Checkbox
                              id="agree"
                              checked={signUpForm.agreed}
                              onCheckedChange={(v) =>
                                setSignUpForm((p) => ({ ...p, agreed: v === true }))
                              }
                              className="mt-0.5"
                            />
                            <label htmlFor="agree" className="text-[11px] text-slate-600 leading-tight">
                              I agree to the Terms of Service & Privacy Policy for precision farm data processing.
                            </label>
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-10 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold text-xs shadow-md transition-all"
                            disabled={busy}
                          >
                            {busy ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <ArrowRight className="mr-2 h-4 w-4" />
                            )}
                            Create Account & Select Farm Location
                          </Button>
                        </form>

                        <p className="text-center text-xs text-slate-500">
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => setMode("signin")}
                            className="font-semibold text-[#2d6a4f] hover:underline"
                          >
                            Sign In
                          </button>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* Bottom security footnote */}
              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                <ShieldCheck className="h-3.5 w-3.5 text-[#2d6a4f]" />
                <span>Protected with 256-bit encrypted agronomic telemetry</span>
              </div>
            </div>
          </div>

          {/* Right Column: Platform Flow & Capabilities Showcase */}
          <div className="hidden lg:col-span-6 xl:col-span-7 lg:block text-white space-y-6 pl-4">
            
            <div className="space-y-3">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 px-3 py-1 text-xs">
                🌾 End-to-End Smart Agriculture Flow
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
                AI-Powered Digital Twin for Next-Generation Farming
              </h2>
              <p className="text-sm text-emerald-100/80 leading-relaxed max-w-xl">
                From boundary polygon mapping to real-time micro-climate simulations,
                AgriVerse AI brings satellite telemetry and autonomous agents to your exact parcel.
              </p>
            </div>

            {/* Visual Step-by-Step Flow Badges */}
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-md border border-white/10">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                  1
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white">Select Farm Location</p>
                  <p className="text-[11px] text-emerald-100/70">
                    Interactive Leaflet parcel map picker with auto-acreage computation
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-emerald-300/60" />
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-md border border-white/10">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                  2
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white">7-Section Farm Intelligence</p>
                  <p className="text-[11px] text-emerald-100/70">
                    Soil NPK, 5-day weather forecast, irrigation method, crop stages, and field photos
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-emerald-300/60" />
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-md border border-white/10">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                  3
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white">Digital Twin What-If Simulator</p>
                  <p className="text-[11px] text-emerald-100/70">
                    2D visual parcel twin comparing No Irrigation, Partial, and Full schedules
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-emerald-300/60" />
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-md border border-white/10">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                  4
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white">Audit Trail & Past Snapshots</p>
                  <p className="text-[11px] text-emerald-100/70">
                    Searchable timeline with date, day, and time stamps — history is never overwritten
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-emerald-300/60" />
              </div>
            </div>

            {/* Agro-climatic Zone Badge */}
            <div className="flex items-center gap-4 text-xs text-emerald-200/80 pt-2">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                Pune Agro-Climatic Zone
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                6 Autonomous AI Agents
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Leaf className="h-3.5 w-3.5 text-emerald-400" />
                ICAR & Sentinel-2 Calibrated
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}