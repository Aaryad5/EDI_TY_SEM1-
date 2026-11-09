"use client";

import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { PUBLIC_NAV_LINKS } from "./public-navbar";

export function PublicFooter() {
  return (
    <footer className="border-t border-agri/10 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Link href="/">
            <Logo />
          </Link>
          <p className="text-xs text-dark/50">
            Smarter Farming. Better Decisions. Sustainable Future.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-dark/70">
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-agri transition-colors">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="hover:text-agri transition-colors font-medium">
            Sign In
          </Link>
          <Link href="/signup" className="hover:text-agri transition-colors font-medium">
            Get Started
          </Link>
        </nav>

        <p className="text-xs text-dark/40">
          © {new Date().getFullYear()} AgriVerse AI. Precision Smart Farming Platform.
        </p>
      </div>
    </footer>
  );
}
