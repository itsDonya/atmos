"use client";

import { Droplets, Gauge, Sun, Wind } from "lucide-react";

import { WeatherIcon } from "@/components/weather/weather-icon";
import type { CurrentConditions } from "@/types/api";
import {
  formatHumidity,
  formatPressure,
  formatTemperature,
  formatWindDirection,
  formatWindSpeed,
  getUVInfo,
} from "@/lib/weather-format";

interface CurrentWeatherProps {
  current: CurrentConditions;
  name: string;
  timezone: string;
}

export function CurrentWeather({
  current,
  name,
  timezone,
}: CurrentWeatherProps) {
  const uv = getUVInfo(current.uv_index);

  const stats = [
    {
      label: "UV Index",
      icon: <Sun className="h-4 w-4" style={{ color: uv.color }} />,
      value: current.uv_index.toFixed(1),
    },
    {
      label: "Humidity",
      icon: <Droplets className="h-4 w-4 text-[var(--primary)]" />,
      value: formatHumidity(current.humidity),
    },
    {
      label: "Wind",
      icon: <Wind className="h-4 w-4 text-[var(--primary)]" />,
      value: `${formatWindSpeed(current.wind_speed)} ${formatWindDirection(
        current.wind_direction
      )}`,
    },
    {
      label: "Pressure",
      icon: <Gauge className="h-4 w-4 text-[var(--primary)]" />,
      value: formatPressure(current.pressure),
    },
  ];

  return (
    <section className="glass-panel flex flex-col gap-8 rounded-[var(--radius-lg)] p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between">
      {/* Left: headline */}
      <div className="flex items-center gap-6">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-primary/10">
          <WeatherIcon
            condition={current.condition}
            weatherCode={current.weather_code}
            isDay={current.is_day}
            className="h-12 w-12 text-primary"
            strokeWidth={1.5}
          />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            {current.condition_label}
          </p>
          <h2 className="mt-0.5 text-2xl font-bold tracking-tight">{name}</h2>
          <p className="text-sm text-muted-foreground">
            Feels like{" "}
            {formatTemperature(current.apparent_temperature, "C", 1)}° ·{" "}
            {timezone}
          </p>
        </div>
        <p className="text-6xl font-bold leading-none tracking-tighter sm:text-7xl">
          {formatTemperature(current.temperature, "C")}
        </p>
      </div>

      {/* Right: stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-background/40 p-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              {stat.icon}
              <span className="text-xs">{stat.label}</span>
            </div>
            <p className="mt-1.5 text-xl font-semibold tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
