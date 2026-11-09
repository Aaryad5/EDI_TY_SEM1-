"use client";

import * as React from "react";
import { authService, type SignupInput } from "@/lib/services/authService";
import { userService, userStorage } from "@/lib/services/userService";
import { farmService } from "@/lib/services/farmService";
import { read, write, STORAGE_KEYS } from "@/lib/services/storage";
import { DEMO_USER, DEMO_FARM, DEMO_FARMS } from "@/lib/data/demo";
import { ensureSeedSnapshot } from "@/lib/services/snapshotService";
import { ensureSeedHistory } from "@/lib/services/historyService";
import { ensureSeedAlerts } from "@/lib/services/alertService";
import type { Farm, UserProfile } from "@/lib/types";

type Session = {
  user: UserProfile;
  token: string;
} | null;

type AuthContextValue = {
  session: Session;
  user: UserProfile | null;
  farms: Farm[];
  activeFarm: Farm | null;
  loading: boolean;
  signUp: (input: SignupInput) => Promise<UserProfile>;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signInWithGoogle: () => Promise<UserProfile>;
  signOut: () => void;
  updateUser: (patch: Partial<Omit<UserProfile, "id">>) => Promise<void>;
  refreshFarms: () => Promise<void>;
  setActiveFarm: (farmId: string) => Promise<void>;
  addFarm: (farm: Farm) => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

function bootstrap() {
  userStorage.ensureDemoUser();
  ensureSeedSnapshot();
  ensureSeedHistory();
  ensureSeedAlerts();
  const savedSession = read<Session>(STORAGE_KEYS.session, null);
  const farms = read<Farm[]>(STORAGE_KEYS.farms, []);
  if (farms.length === 0) {
    write<Farm[]>(STORAGE_KEYS.farms, DEMO_FARMS);
  }
  return { savedSession, farms: read<Farm[]>(STORAGE_KEYS.farms, DEMO_FARMS) };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ savedSession, farms: seedFarms }] = React.useState(bootstrap);
  const [session, setSession] = React.useState<Session>(savedSession);
  const [farms, setFarms] = React.useState<Farm[]>(seedFarms);
  const [loading, setLoading] = React.useState(true);

  const persistSession = React.useCallback((s: Session) => {
    setSession(s);
    if (s) write(STORAGE_KEYS.session, s);
    else {
      const k = STORAGE_KEYS.session;
      try {
        window.localStorage.removeItem(k);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const refreshFarms = React.useCallback(async () => {
    if (!session) return;
    const list = await farmService.listFarms(session.user.id);
    setFarms(list);
  }, [session]);

  React.useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      if (!session) {
        // demo browsing path
        const finalFarms = read<Farm[]>(STORAGE_KEYS.farms, []);
        setFarms(finalFarms.length ? finalFarms : [DEMO_FARM]);
        setLoading(false);
        return;
      }
      try {
        await refreshFarms();
      } finally {
        setLoading(false);
      }
    }, 150);
    return () => clearTimeout(t);
  }, [session, refreshFarms]);

  const value = React.useMemo<AuthContextValue>(() => {
    return {
      session,
      user: session?.user ?? null,
      farms,
      activeFarm:
        farms.find((f) => f.isActive) ?? farms[0] ?? (farms.length ? farms[0]! : null),
      loading,
      async signUp(input) {
        await authService.signup(input);
        const created = await userService.getProfile(input.email.split("@")[0] ?? "");
        const user: UserProfile =
          created ??
          ({
            id: `user_${Date.now()}`,
            userId: `user_${Date.now()}`,
            username: input.username || input.email.split("@")[0] || "farmer",
            fullName: input.fullName,
            email: input.email,
            phone: input.phone,
            country: input.country,
            state: input.state,
            district: input.district,
            preferredLanguage: input.preferredLanguage,
            role: "farmer",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } satisfies UserProfile);
        userStorage.save(user);
        persistSession({ user, token: `mock_token_${user.id}` });
        return user;
      },
      async signIn(email, password) {
        const res = await authService.login({ email, password });
        userStorage.save(res.user);
        persistSession(res);
        return res.user;
      },
      async signInWithGoogle() {
        const res = await authService.login({ email: "demo@agriverse.ai", password: "google-demo" });
        persistSession({ user: DEMO_USER, token: res.token });
        return DEMO_USER;
      },
      signOut() {
        persistSession(null);
      },
      async updateUser(patch) {
        if (!session) return;
        const updated = await userService.updateProfile(session.user.id, patch);
        persistSession({ ...session, user: updated });
      },
      refreshFarms,
      async setActiveFarm(farmId) {
        await farmService.setActiveFarm(farmId);
        await refreshFarms();
      },
      addFarm(farm) {
        setFarms((prev) => [...prev, farm]);
      },
    };
  }, [session, farms, loading, refreshFarms, persistSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { AuthContext };