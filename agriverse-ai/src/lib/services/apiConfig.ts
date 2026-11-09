// ------------------------------------------------------------------
// Central API configuration.
// Mock mode uses the localStorage-backed storage layer.
// When the FastAPI backend is ready, set these env vars and flip
// MOCK_API to false — the service signatures stay identical.
// ------------------------------------------------------------------
"use client";

export const API_CONFIG = {
  mockMode: true,
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  weatherProvider: process.env.NEXT_PUBLIC_WEATHER_PROVIDER || "open-meteo",
  soilProvider: process.env.NEXT_PUBLIC_SOIL_PROVIDER || "soilgrids",
  satProvider: process.env.NEXT_PUBLIC_SAT_PROVIDER || "sentinel-2",
  imdBase: process.env.NEXT_PUBLIC_IMD_API_URL || "",
};

export const ENDPOINTS = {
  signup: "/api/auth/signup",
  login: "/api/auth/login",
  refresh: "/api/auth/refresh",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
  profile: "/api/user/profile",
  farms: "/api/farms",
  weather: (id: string) => `/api/farms/${id}/weather`,
  soil: (id: string) => `/api/farms/${id}/soil`,
  crop: (id: string) => `/api/farms/${id}/crop`,
  irrigation: (id: string) => `/api/farms/${id}/irrigation`,
  history: (id: string) => `/api/farms/${id}/history`,
  recommendations: (id: string) => `/api/farms/${id}/recommendations`,
  cropRecommendation: "/api/recommendations/crop",
  seasonRecommendation: "/api/recommendations/season",
  regionRecommendation: "/api/recommendations/region",
} as const;

// Mark of truth: anything produced while MOCK_API=true is clearly demo.
export const IS_MOCK = API_CONFIG.mockMode;

export function endpoint(path: string): string {
  return API_CONFIG.baseUrl + path;
}