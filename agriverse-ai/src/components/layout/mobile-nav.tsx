"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { MAIN_NAV } from "@/components/layout/nav-items";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FarmSwitcher } from "@/components/layout/farm-switcher";

import { LayoutDashboard, Warehouse, PlusCircle, BarChart3, FlaskConical, History } from "lucide-react";

const BOTTOM_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Farms", href: "/farms", icon: Warehouse },
  { label: "Add", href: "/farms/add/location", icon: PlusCircle },
  { label: "Analysis", href: "/analysis", icon: BarChart3 },
  { label: "Simulation", href: "/simulation", icon: FlaskConical },
  { label: "History", href: "/history", icon: History },
];

export function MobileNav() {
  const { user, signOut } = useAuth();
  const { unreadAlerts } = useFarmData();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Top bar */}
      <header className="glass sticky top-0 z-40 flex items-center justify-between border-b border-agri/10 px-4 py-3 lg:hidden">
        <Link href="/dashboard">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="px-2.5">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="border-b border-agri/10">
              <div className="grid gap-3 pt-4">
                <SheetHeader>
                  <SheetTitle className="text-forest">Switch Farm</SheetTitle>
                </SheetHeader>
                <FarmSwitcher />
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/alerts" className="relative rounded-lg p-2 text-forest hover:bg-lightgreen/30">
            <Bell className="h-5 w-5" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-0.5 right-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadAlerts}
              </span>
            )}
          </Link>
          <Button variant="outline" size="sm" className="px-2.5" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-forest/30 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-[82%] max-w-sm transform bg-white shadow-2xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-agri/10 px-4 py-4">
          <Logo size="sm" />
          <Button variant="ghost" size="iconSm" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {MAIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-agri text-white" : "text-dark hover:bg-lightgreen/30"
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                {item.label}
                {item.href === "/alerts" && unreadAlerts > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {unreadAlerts}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-agri/10 p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initials(user?.fullName ?? "AF")}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-dark">{user?.fullName ?? "Guest Farmer"}</p>
              <p className="truncate text-xs text-dark/50">{user?.email ?? "—"}</p>
            </div>
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => {
                signOut();
                setOpen(false);
                router.push("/");
                router.refresh();
              }}
              title="Sign out"
            >
              <LogOut className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="glass fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-agri/10 px-2 pb-[env(safe-area-inset-bottom)] lg:hidden">
        {BOTTOM_NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-[11px] font-medium",
                active ? "text-agri" : "text-dark/50"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
              {item.href === "/alerts" && unreadAlerts > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {unreadAlerts}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}