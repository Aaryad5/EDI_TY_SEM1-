"use client";

import { read, simulateLatency, write, STORAGE_KEYS } from "./storage";
import { DEMO_USER } from "@/lib/data/demo";
import type { UserProfile } from "@/lib/types";
import { dateParts, uid } from "@/lib/utils";

// ------------------------------------------------------------------
// userService — mock implementation.
// Future: GET/PUT ENDPOINTS.profile
// ------------------------------------------------------------------
export const userService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    // GET /api/user/profile
    const users = read<UserProfile[]>(STORAGE_KEYS.users, []);
    const found = users.find((u) => u.id === userId || u.userId === userId);
    return simulateLatency(found ?? null, 250);
  },

  async updateProfile(
    userId: string,
    patch: Partial<Omit<UserProfile, "id" | "userId">>
  ): Promise<UserProfile> {
    // PUT /api/user/profile
    const users = read<UserProfile[]>(STORAGE_KEYS.users, []);
    const idx = users.findIndex((u) => u.id === userId || u.userId === userId);
    let user: UserProfile;
    if (idx >= 0) {
      user = { ...users[idx]!, ...patch, updatedAt: dateParts().iso };
      users[idx] = user;
    } else {
      user = { ...DEMO_USER, ...patch, id: userId, userId, updatedAt: dateParts().iso };
      users.push(user);
    }
    write(STORAGE_KEYS.users, users);
    return simulateLatency(user, 300);
  },
};

export const userStorage = {
  save(user: UserProfile) {
    const users = read<UserProfile[]>(STORAGE_KEYS.users, []);
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) users[idx] = user;
    else users.push(user);
    write(STORAGE_KEYS.users, users);
  },
  ensureDemoUser() {
    write<UserProfile[]>(STORAGE_KEYS.users, [DEMO_USER]);
  },
};

export { uid as newUserId }; // re-export for consistency