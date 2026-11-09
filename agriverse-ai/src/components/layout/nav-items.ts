"use client";

import {
  LayoutDashboard,
  Warehouse,
  PlusCircle,
  BarChart3,
  FlaskConical,
  History,
  Database,
  CloudSun,
  Layers,
  Sprout,
  Droplets,
  Sparkles,
  Radar,
  Boxes,
  Map as MapIcon,
  Bell,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  group?: string;
};

export const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Farms", href: "/farms", icon: Warehouse },
  { label: "Add Farm", href: "/farms/add/location", icon: PlusCircle },
  { label: "Farm Data", href: "/farm-data", icon: Database },
  { label: "Analysis", href: "/analysis", icon: BarChart3 },
  { label: "Simulation", href: "/simulation", icon: FlaskConical },
  { label: "History", href: "/history", icon: History },
];

export const MAIN_NAV: NavItem[] = [
  ...PRIMARY_NAV,
  { label: "Weather", href: "/weather", icon: CloudSun, group: "Tools" },
  { label: "Soil", href: "/soil", icon: Layers, group: "Tools" },
  { label: "Crops", href: "/crops", icon: Sprout, group: "Tools" },
  { label: "Irrigation", href: "/irrigation", icon: Droplets, group: "Tools" },
  { label: "AI Recommendations", href: "/recommendations", icon: Sparkles, group: "AI Intelligence" },
  { label: "Crop Analysis", href: "/crop-analysis", icon: Radar, group: "AI Intelligence" },
  { label: "Digital Twin", href: "/digital-twin", icon: Boxes, group: "AI Intelligence" },
  { label: "GIS Map", href: "/map", icon: MapIcon, group: "AI Intelligence" },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const PARENT_GROUPS: Record<string, string> = {
  "Farm": "Farm Data Center",
  "AI Intelligence": "AI Intelligence",
};