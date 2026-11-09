"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { PRIMARY_NAV, MAIN_NAV, type NavItem } from "@/components/layout/nav-items";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
        active
          ? "bg-[#2d6a4f] text-white shadow-sm font-semibold"
          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
      )}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl bg-[#2d6a4f] shadow-sm"
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />
      )}
      <Icon className={cn("relative z-10 h-5 w-5 shrink-0 transition-colors", active ? "text-white" : "text-slate-400 group-hover:text-[#2d6a4f]")} />
      <span className="relative z-10 truncate">{item.label}</span>
      {active && (
        <span className="relative z-10 ml-auto h-2 w-2 rounded-full bg-white shadow-xs" />
      )}
    </Link>
  );
}

function NavGroup({ group }: { group: string }) {
  const items = MAIN_NAV.filter((i) => i.group === group);
  if (items.length === 0) return null;
  return (
    <div className="mt-5">
      <p className="mb-2 px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {group}
      </p>
      <div className="space-y-1">
        {items.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
}

export function Sidebar() {
  const { user, signOut, activeFarm } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Dynamic routes for active farm
  const currentFarmId = activeFarm?.id || "farm_001";
  const primaryWithActiveFarm = PRIMARY_NAV.map((item) => {
    if (item.href === "/analysis") {
      return { ...item, href: `/farms/${currentFarmId}/analysis` };
    }
    if (item.href === "/simulation") {
      return { ...item, href: `/farms/${currentFarmId}/simulation` };
    }
    return item;
  });

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex shadow-xs">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <Link href="/dashboard" className="block">
          <Logo variant="dark" size="sm" />
        </Link>
      </div>

      {/* Primary & Secondary Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {primaryWithActiveFarm.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        <NavGroup group="Tools" />
        <NavGroup group="AI Intelligence" />
      </nav>

      {/* Slogan at the Bottom as requested */}
      <div className="px-3.5 py-2.5">
        <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/60 p-3 text-center">
          <p className="text-[11px] font-semibold leading-relaxed text-emerald-950">
            Smarter Farms.<br />
            Stronger People.<br />
            <span className="font-bold text-[#2d6a4f]">Greener Tomorrow.</span>
          </p>
        </div>
      </div>

      {/* Farmer Profile Strip */}
      <div className="border-t border-slate-100 bg-slate-50/70 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <Avatar className="h-9 w-9 border border-emerald-200 ring-1 ring-emerald-100">
            <AvatarFallback className="bg-[#2d6a4f] text-white font-bold text-xs">
              {initials(user?.fullName ?? "Aarya Patil")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800">
              {user?.fullName ?? "Aarya Patil"}
            </p>
            <p className="truncate text-[11px] text-slate-500">{user?.email ?? "aarya@agriverse.ai"}</p>
          </div>
          <Button
            variant="ghost"
            size="iconSm"
            className="text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            onClick={() => {
              signOut();
              router.push("/");
              router.refresh();
            }}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="sr-only">{pathname}</p>
    </aside>
  );
}