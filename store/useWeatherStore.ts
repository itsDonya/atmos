"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { WeatherApiResponse, SearchResult } from "@/types/api";
import type { Location } from "@/types/api";

export interface ActiveLocation {
  name: string;
  display_name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface WeatherState {
  activeLocation: ActiveLocation | null;
  recentSearches: SearchResult[];
  weather: WeatherApiResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setActiveLocation: (location: ActiveLocation) => void;
  addRecentSearch: (result: SearchResult) => void;
  removeRecentSearch: (id: number) => void;
  clearRecentSearches: () => void;
  setWeather: (weather: WeatherApiResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const RECENT_LIMIT = 6;

function locationToActive(result: SearchResult): ActiveLocation {
  return {
    name: result.name,
    display_name: result.display_name,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  };
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      activeLocation: null,
      recentSearches: [],
      weather: null,
      isLoading: false,
      error: null,

      setActiveLocation: (location) => set({ activeLocation: location }),
      addRecentSearch: (result) =>
        set((state) => {
          const filtered = state.recentSearches.filter(
            (item) => item.id !== result.id
          );
          return {
            recentSearches: [result, ...filtered].slice(0, RECENT_LIMIT),
          };
        }),
      removeRecentSearch: (id) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((item) => item.id !== id),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),
      setWeather: (weather) => set({ weather, isLoading: false, error: null }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false }),
      reset: () =>
        set({ weather: null, isLoading: false, error: null }),
    }),
    {
      name: "atmos-weather-store",
      partialize: (state) => ({
        activeLocation: state.activeLocation,
        recentSearches: state.recentSearches,
      }),
    }
  )
);

// Helper to fetch weather for a location and update the store
export async function fetchWeatherForLocation(
  location: ActiveLocation
): Promise<WeatherApiResponse> {
  const store = useWeatherStore.getState();
  store.setActiveLocation(location);
  store.setLoading(true);
  store.setError(null);

  try {
    const params = new URLSearchParams({
      lat: String(location.latitude),
      lon: String(location.longitude),
      timezone: location.timezone || "auto",
    });

    const res = await fetch(`/api/weather?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      let message = `Failed to load weather (${res.status})`;
      try {
        const body = await res.json();
        if (body?.error) message = body.error;
      } catch {
        /* ignore parse errors */
      }
      throw new Error(message);
    }

    const data: WeatherApiResponse = await res.json();
    useWeatherStore.getState().setWeather(data);
    return data;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unknown error occurred";
    useWeatherStore.getState().setError(message);
    throw err;
  }
}

// Helper to search locations
export async function searchLocations(
  query: string
): Promise<SearchResult[]> {
  if (!query.trim() || query.trim().length < 2) return [];

  const params = new URLSearchParams({ q: query.trim() });
  const res = await fetch(`/api/search?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Search failed (${res.status})`);
  }

  const data = await res.json();
  return data.results ?? [];
}

export { locationToActive, type Location as LocationType };
