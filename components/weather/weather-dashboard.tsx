"use client";

import { useEffect, useRef } from "react";
import { CloudOff, LocateFixed, MapPin, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import {
  useWeatherStore,
  fetchWeatherForLocation,
} from "@/store/useWeatherStore";
import { useGeolocation } from "@/hooks/use-geolocation";
import { CurrentWeather } from "@/components/weather/current-weather";
import { HourlyChart } from "@/components/weather/hourly-chart";
import { DailyForecast } from "@/components/weather/daily-forecast";
import { WeatherSkeleton } from "@/components/weather/skeletons";

export function WeatherDashboard() {
  const { activeLocation, weather, error } = useWeatherStore();
  const geo = useGeolocation();
  const geoHandledRef = useRef(false);

  // Ask for geolocation once, only when no location is already stored.
  useEffect(() => {
    if (!activeLocation && geo.supported) geo.requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When geolocation resolves and the user hasn't chosen a place, default to
  // "My Location".
  useEffect(() => {
    if (activeLocation || geoHandledRef.current) return;
    if (geo.latitude == null || geo.longitude == null) return;

    geoHandledRef.current = true;
    useWeatherStore
      .getState()
      .setActiveLocation({
        name: "My Location",
        display_name: "My Location",
        latitude: geo.latitude,
        longitude: geo.longitude,
        timezone: "auto",
      });
  }, [geo.latitude, geo.longitude, activeLocation]);

  // Fetch + hydrate the store whenever the active location changes.
  useEffect(() => {
    if (!activeLocation) return;
    let cancelled = false;
    fetchWeatherForLocation(activeLocation).catch((err) => {
      if (!cancelled) {
        toast.error(
          err instanceof Error ? err.message : "Failed to load weather."
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeLocation]);

  // --- No location yet -------------------------------------------------------
  if (!activeLocation) {
    if (geo.loading) {
      return <WeatherSkeleton />;
    }

    return (
      <section className="glass-panel flex flex-col items-center justify-center rounded-[var(--radius-lg)] px-6 py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-4 text-xl font-bold tracking-tight">
          Find your forecast
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Search for a city above, or let Atmos detect your current location
          for instant weather.
        </p>
        {geo.supported && (
          <button
            type="button"
            onClick={() => geo.requestLocation()}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LocateFixed className="h-4 w-4" />
            Use my location
          </button>
        )}
        {geo.error && (
          <p className="mt-3 max-w-sm text-xs text-muted-foreground/70">
            {geo.error}
          </p>
        )}
      </section>
    );
  }

  // --- Error before any data -------------------------------------------------
  if (!weather && error) {
    return (
      <section className="glass-panel flex flex-col items-center justify-center rounded-[var(--radius-lg)] px-6 py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10">
          <CloudOff className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="mt-4 text-xl font-bold tracking-tight">
          Couldn&apos;t load the forecast
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{error}</p>
        <button
          type="button"
          onClick={() => fetchWeatherForLocation(activeLocation)}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </section>
    );
  }

  // --- Loading (zero layout shift) -------------------------------------------
  if (!weather) {
    return <WeatherSkeleton />;
  }

  // --- Ready -----------------------------------------------------------------
  return (
    <div className="flex flex-col gap-5">
      <CurrentWeather
        current={weather.current}
        name={activeLocation.display_name}
        timezone={weather.location.timezone}
      />
      <div className="grid gap-5 lg:grid-cols-5">
        <HourlyChart
          className="lg:col-span-3"
          data={weather.hourly_chart}
          timezone={weather.location.timezone}
        />
        <DailyForecast
          className="lg:col-span-2"
          data={weather.daily}
          timezone={weather.location.timezone}
        />
      </div>
    </div>
  );
}
