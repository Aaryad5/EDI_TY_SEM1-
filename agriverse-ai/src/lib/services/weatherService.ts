"use client";

import { ENDPOINTS } from "./apiConfig";
import { read, simulateLatency, write, STORAGE_KEYS } from "./storage";
import { DEMO_FORECAST, DEMO_WEATHER } from "@/lib/data/demo";
import { uid } from "@/lib/utils";
import type { ForecastDay, WeatherRecord } from "@/lib/types";

export type WeatherInput = Omit<
  WeatherRecord,
  "id" | "snapshotId" | "farmId" | "userId" | "createdAt" | "updatedAt"
>;

// ------------------------------------------------------------------
// weatherService — mock implementation.
// Future: post to ENDPOINTS.weather(farmId); live data from checkLiveWeather.
// ------------------------------------------------------------------
export const weatherService = {
  async submitWeather(
    farmId: string,
    userId: string,
    input: WeatherInput
  ): Promise<WeatherRecord> {
    // POST /api/farms/:id/weather
    const now = new Date().toISOString();
    const rec: WeatherRecord = {
      ...input,
      id: uid("wth"),
      snapshotId: null,
      farmId,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    const list = read<WeatherRecord[]>(STORAGE_KEYS.weather, []);
    list.push(rec);
    write(STORAGE_KEYS.weather, list);
    return simulateLatency(rec, 350);
  },

  async getWeather(farmId: string): Promise<WeatherRecord | null> {
    const list = read<WeatherRecord[]>(STORAGE_KEYS.weather, []);
    return simulateLatency(list.filter((w) => w.farmId === farmId).at(-1) ?? null, 200);
  },

  /**
   * Placeholder for live data. When connected, this calls the
   * Open-Meteo / IMD adapter (via FastAPI) using farm coordinates.
   */
  async checkLiveWeather(): Promise<WeatherInput | null> {
    // GET /api/weather/live?farmId=...   (Open-Meteo / IMD integration placeholder)
    return simulateLatency(
      {
        avgTemperatureC: parseFloat((20 + Math.random() * 12).toFixed(1)),
        maxTemperatureC: parseFloat((25 + Math.random() * 10).toFixed(1)),
        minTemperatureC: parseFloat((15 + Math.random() * 8).toFixed(1)),
        relativeHumidityPct: Math.round(45 + Math.random() * 35),
        annualRainfallMm: DEMO_WEATHER.annualRainfallMm,
        recentRainfallMm: Math.round(Math.random() * 25),
        windSpeedKmh: parseFloat((8 + Math.random() * 14).toFixed(1)),
        sunshineHours: Math.round(5 + Math.random() * 5),
        growingSeason: DEMO_WEATHER.growingSeason,
        irrigationAvailable: true,
        source: "live",
      } as WeatherInput,
      900
    );
  },

  async getForecast(): Promise<ForecastDay[]> {
    // GET /api/weather/forecast?farmId=...&days=7
    return simulateLatency(DEMO_FORECAST, 300);
  },
};

export { STORAGE_KEYS as WEATHER_KEYS, ENDPOINTS as WEATHER_ENDPOINTS };