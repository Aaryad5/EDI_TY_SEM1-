"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, LayoutDashboard, Radio } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export const PUBLIC_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/live-telemetry", label: "Live Telemetry", isHighlight: true },
  { href: "/contact", label: "Contact" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-agri/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="transition-opacity hover:opacity-95">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 xl:gap-2 lg:flex">
          {PUBLIC_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "font-semibold text-agri bg-agri/8"
                    : "text-dark/70 hover:bg-agri/5 hover:text-agri",
                  link.isHighlight && !isActive && "text-forest font-semibold"
                )}
              >
                <span className="flex items-center gap-1.5">
                  {link.isHighlight && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fresh opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-agri" />
                    </span>
                  )}
                  {link.label}
                </span>
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-agri" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden items-center gap-2.5 lg:flex">
          {user ? (
            <Button asChild variant="primary" size="sm">
              <Link href="/dashboard">
                <LayoutDashboard className="mr-1.5 h-4 w-4" /> Go to Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild variant="primary" size="sm">
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-agri/10 bg-cream px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1.5">
            {PUBLIC_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-agri/10 font-bold text-agri"
                      : "text-dark/70 hover:bg-agri/5 hover:text-agri"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {link.isHighlight && <Radio className="h-3.5 w-3.5 text-fresh animate-pulse" />}
                    {link.label}
                  </span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-agri" />}
                </Link>
              );
            })}

            <div className="mt-3 flex gap-2 border-t border-agri/10 pt-3">
              {user ? (
                <Button asChild variant="primary" className="w-full">
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard className="mr-1.5 h-4 w-4" /> Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
                  </Button>
                  <Button asChild variant="primary" className="flex-1">
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
