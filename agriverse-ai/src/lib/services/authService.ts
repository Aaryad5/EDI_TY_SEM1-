"use client";

import { ENDPOINTS } from "./apiConfig";
import { simulateLatency } from "./storage";
import { dateParts, uid } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";

export type AuthResponse = {
  user: UserProfile;
  token: string;
};

export type SignupInput = {
  fullName: string;
  username?: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  state: string;
  district: string;
  preferredLanguage: string;
};

export type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

// ------------------------------------------------------------------
// authService — mock implementation. Future: POST ENDPOINTS.login etc.
// ------------------------------------------------------------------
export const authService = {
  async signup(input: SignupInput): Promise<AuthResponse> {
    // POST /api/auth/signup
    const now = dateParts().iso;
    const user: UserProfile = {
      id: uid("user"),
      userId: uid("user"),
      username: input.username || input.email.split("@")[0] || "farmer",
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      country: input.country,
      state: input.state,
      district: input.district,
      preferredLanguage: input.preferredLanguage,
      role: "farmer",
      createdAt: now,
      updatedAt: now,
    };
    return simulateLatency({ user, token: `mock_token_${user.id}` }, 500);
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    // POST /api/auth/login
    if (!input.email || !input.password) {
      throw new Error("Email and password are required.");
    }
    const now = dateParts().iso;
    const username = input.email.includes("aarya") ? "Aarya" : input.email.split("@")[0] ?? "farmer";
    const user: UserProfile = {
      id: uid("user"),
      userId: uid("user"),
      username,
      fullName: input.email.includes("aarya") ? "Aarya Patil" : input.email.split("@")[0] ?? "Farmer",
      email: input.email,
      phone: "+91 98230 12345",
      country: "India",
      state: "Maharashtra",
      district: "Pune",
      preferredLanguage: "English",
      role: "farmer",
      createdAt: now,
      updatedAt: now,
    };
    return simulateLatency({ user, token: `mock_token_${user.id}` }, 400);
  },

  async forgotPassword(email: string): Promise<{ ok: true; message: string }> {
    // POST /api/auth/forgot-password
    return simulateLatency(
      { ok: true, message: `If ${email} is registered, a reset link has been sent.` },
      700
    );
  },

  async resetPassword(token: string, password: string): Promise<{ ok: true }> {
    // POST /api/auth/reset-password
    if (!token || password.length < 8) throw new Error("Invalid token or weak password.");
    return simulateLatency({ ok: true }, 600);
  },
};

export const SOCIAL_AUTH_MODE = "demo" as const;

export const GOOGLE_AUTH_URL = ENDPOINTS.login; // placeholder when real OAuth is wired