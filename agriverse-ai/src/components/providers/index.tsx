"use client";

import * as React from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { FarmDataProvider } from "@/components/providers/farm-data-provider";
import { Toaster } from "@/components/ui/use-toast";

// Optional-only providers so the public (non-route-guarded) pages
// render instantly. Everything below the AppShell is auth + farm data.
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <FarmDataProvider>{children}</FarmDataProvider>
      </AuthProvider>
      <Toaster />
    </>
  );
}