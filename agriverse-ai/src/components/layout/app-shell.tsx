"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AppHeader } from "@/components/layout/app-header";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

const REQUIRE_AUTH = (process.env.NEXT_PUBLIC_REQUIRE_AUTH ?? "false") === "true";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isGuest = REQUIRE_AUTH && !user;

  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <AppHeader />
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
          {isGuest ? (
            <GuestGate />
          ) : (
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

function GuestGate() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-dark">Authentication required</h2>
      <p className="max-w-md text-sm text-dark/60">
        Protected route. Sign in to your AgriVerse AI account to continue.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/signup">Create Account</Link>
        </Button>
      </div>
    </div>
  );
}