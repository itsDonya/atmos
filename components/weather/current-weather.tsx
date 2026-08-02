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
import { cn } from "@/lib/utils";

interface CurrentWeatherProps {
  current: CurrentConditions;
  name: string;
  timezone: string;
  className?: string;
}

export function CurrentWeather({
  current,
  name,
  timezone,
  className,
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
    <section
      className={cn(
        "glass-panel flex flex-col gap-6 rounded-[var(--radius-lg)] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 xl:p-8",
        className
      )}
    >
      {/* Left: headline */}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary/10 sm:h-20 sm:w-20">
            <WeatherIcon
              condition={current.condition}
              weatherCode={current.weather_code}
              isDay={current.is_day}
              className="h-10 w-10 text-primary sm:h-12 sm:w-12"
              strokeWidth={1.5}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-primary sm:text-sm">
              {current.condition_label}
            </p>
            <h2 className="mt-0.5 truncate text-xl font-bold tracking-tight sm:text-2xl">
              {name}
            </h2>
            <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
              {timezone}
            </p>
          </div>
        </div>

        {/* Hero temperature — isolated on its own wrapping line for mobile */}
        <div className="mt-4 flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-2 sm:mt-6">
          <p className="text-6xl font-bold leading-none tracking-tighter md:text-7xl xl:text-8xl">
            {formatTemperature(current.temperature, "C")}
          </p>
          <p className="pb-1 text-sm text-muted-foreground">
            Feels like {formatTemperature(current.apparent_temperature, "C", 1)}°
          </p>
        </div>
      </div>

      {/* Right: stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 lg:w-72 xl:w-80">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-background/40 p-3.5 sm:p-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              {stat.icon}
              <span className="text-xs">{stat.label}</span>
            </div>
            <p className="mt-1.5 truncate text-base font-semibold tracking-tight sm:text-xl">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
