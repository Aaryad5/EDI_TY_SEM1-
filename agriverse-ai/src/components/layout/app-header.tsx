"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Check,
  Sprout,
  Droplets,
  CloudRain,
  ShieldAlert,
  TrendingUp,
  User,
  Settings,
  LogOut,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useFarmData } from "@/components/providers/farm-data-provider";
import { FarmSwitcher } from "@/components/layout/farm-switcher";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/utils";

const SAMPLE_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Rain expected tomorrow",
    desc: "12mm precipitation forecast for Pune. Consider withholding irrigation.",
    time: "10 mins ago",
    read: false,
    icon: CloudRain,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    id: "notif-2",
    title: "Soil moisture is low",
    desc: "Zone B subsurface probe dropped to 18%. Drip irrigation recommended.",
    time: "1 hour ago",
    read: false,
    icon: Droplets,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    id: "notif-3",
    title: "Pest risk increased",
    desc: "Aphid vulnerability detected on border rows. Early inspection advised.",
    time: "3 hours ago",
    read: false,
    icon: ShieldAlert,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    id: "notif-4",
    title: "Market price changed",
    desc: "Pune Mandi Wheat prices increased to ₹2,120/q (+4.2%).",
    time: "5 hours ago",
    read: true,
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    id: "notif-5",
    title: "New AI recommendation available",
    desc: "AgriVerse Decision Orchestrator updated recommendations for Rabi season.",
    time: "Yesterday",
    read: true,
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

export function AppHeader() {
  const { user, signOut, farms, activeFarm, setActiveFarm } = useAuth();
  const router = useRouter();

  // Search state
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Notification dropdown state
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(SAMPLE_NOTIFICATIONS);

  // User menu state
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Filtered search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { title: string; subtitle: string; href: string; type: string }[] = [];

    // Search farms
    farms.forEach((f) => {
      if (f.name.toLowerCase().includes(q) || f.district.toLowerCase().includes(q) || f.currentCrop?.toLowerCase().includes(q)) {
        results.push({
          title: f.name,
          subtitle: `${f.district}, ${f.state} · ${f.currentCrop || "Crop"} (${f.areaValue} ${f.areaUnit})`,
          href: `/farms/${f.id}/analysis`,
          type: "Farm",
        });
      }
    });

    // Search modules & crops
    const modules = [
      { title: "Farm Intelligence Analysis", subtitle: "Real-time AI insights, soil and weather diagnostics", href: `/farms/${activeFarm?.id || "farm_001"}/analysis`, type: "Analysis" },
      { title: "Digital Twin Simulation", subtitle: "What-if scenario testing: rainfall, irrigation, temperature", href: `/farms/${activeFarm?.id || "farm_001"}/simulation`, type: "Simulation" },
      { title: "Analysis History", subtitle: "Immutable chronological snapshots and past audits", href: "/history", type: "History" },
      { title: "AI Crop Recommendations", subtitle: "Suitability rankings and NPK matching", href: "/recommendations", type: "Recommendation" },
      { title: "Select Farm Location (GIS)", subtitle: "Map parcel boundary and calculate acreage", href: "/farms/add/location", type: "Location" },
    ];

    modules.forEach((m) => {
      if (m.title.toLowerCase().includes(q) || m.subtitle.toLowerCase().includes(q) || m.type.toLowerCase().includes(q)) {
        results.push(m);
      }
    });

    return results;
  }, [searchQuery, farms, activeFarm?.id]);

  return (
    <header className="sticky top-0 z-40 border-b border-agri/10 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left / Search trigger */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-48 sm:w-64 items-center justify-start gap-2 border-agri/15 bg-cream/50 text-xs text-dark/60 hover:bg-cream hover:text-dark"
            >
              <Search className="h-3.5 w-3.5 text-agri" />
              <span>Search farm, crop, history...</span>
              <kbd className="ml-auto hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-dark/40 shadow-sm sm:inline-block">
                ⌘K
              </kbd>
            </Button>
          </div>
        </div>

        {/* Right actions: Switcher, Notifications, User */}
        <div className="flex items-center gap-3">
          <FarmSwitcher className="hidden md:flex w-52" />

          {/* Notifications Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative text-dark/70 hover:bg-agri/10 hover:text-agri"
              title="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-agri/15 bg-white p-4 shadow-xl z-50">
                <div className="flex items-center justify-between border-b border-agri/10 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-dark">Notifications</h4>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="bg-red-100 text-red-700 text-[10px]">
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs font-semibold text-agri hover:underline flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 rounded-xl p-2.5 transition-colors ${
                          n.read ? "bg-cream/20 hover:bg-cream/40" : "bg-fresh/10 border border-agri/10"
                        }`}
                      >
                        <div className={`rounded-lg p-2 ${n.bg} ${n.color} shrink-0`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-dark">{n.title}</p>
                          <p className="text-[11px] text-dark/70 line-clamp-2 mt-0.5">{n.desc}</p>
                          <span className="text-[10px] text-dark/40 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 border-t border-agri/10 pt-2 text-center">
                  <Link
                    href="/alerts"
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-semibold text-agri hover:underline block"
                  >
                    View All Agronomic Alerts →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 rounded-full border border-agri/15 bg-white p-1 pr-3 hover:border-agri/35 hover:shadow-sm transition-all"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-forest text-white font-bold text-xs">
                  {initials(user?.fullName ?? "Ramesh Patil")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-dark leading-tight">
                  {user?.fullName ?? "Ramesh Patil"}
                </span>
                <span className="block text-[10px] text-forest font-medium leading-none">
                  Farmer · Pune
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-dark/50" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-agri/15 bg-white p-2 shadow-xl z-50">
                <div className="px-3 py-2 border-b border-agri/10">
                  <p className="text-xs font-bold text-dark">{user?.fullName ?? "Ramesh Patil"}</p>
                  <p className="text-[11px] text-dark/50 truncate">{user?.email ?? "ramesh@agriverse.ai"}</p>
                </div>
                <div className="py-1 space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium text-dark hover:bg-cream"
                  >
                    <User className="h-3.5 w-3.5 text-agri" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium text-dark hover:bg-cream"
                  >
                    <Settings className="h-3.5 w-3.5 text-agri" />
                    <span>Farm Settings</span>
                  </Link>
                </div>
                <div className="border-t border-agri/10 pt-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                      router.push("/");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-agri/20 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-agri/10 pb-3">
              <div className="flex items-center gap-2.5 flex-1 mr-2">
                <Search className="h-4 w-4 text-agri shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to search farms, crops, analysis, simulation, history..."
                  className="w-full bg-transparent text-sm font-medium text-dark outline-none placeholder:text-dark/40"
                />
              </div>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="rounded-lg p-1 text-dark/40 hover:bg-cream hover:text-dark"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="mt-3 max-h-72 overflow-y-auto space-y-1.5">
              {searchResults.length > 0 ? (
                searchResults.map((res, i) => (
                  <Link
                    key={i}
                    href={res.href}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center justify-between rounded-xl p-2.5 transition-colors hover:bg-cream/60"
                  >
                    <div>
                      <p className="text-xs font-bold text-dark">{res.title}</p>
                      <p className="text-[11px] text-dark/60">{res.subtitle}</p>
                    </div>
                    <Badge variant="outline" className="border-agri/20 text-agri text-[10px]">
                      {res.type}
                    </Badge>
                  </Link>
                ))
              ) : searchQuery ? (
                <div className="p-6 text-center text-xs text-dark/50">
                  No matches found for "{searchQuery}". Try searching for "Wheat", "Pune", "Analysis", or "Simulation".
                </div>
              ) : (
                <div className="p-4 text-xs text-dark/50 space-y-1">
                  <p className="font-semibold text-dark/70 mb-2">Suggested Shortcuts:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Farm 01", "Digital Twin", "Wheat", "Soil Moisture", "Simulation"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="rounded-lg border border-agri/15 bg-cream/40 px-2.5 py-1 text-[11px] text-dark/70 hover:bg-agri/10 hover:text-agri"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
