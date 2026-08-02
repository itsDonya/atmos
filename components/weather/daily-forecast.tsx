import { CalendarDays } from "lucide-react";

import { WeatherIcon } from "@/components/weather/weather-icon";
import type { DailyDataPoint } from "@/types/api";
import { formatTemperature } from "@/lib/weather-format";
import { cn } from "@/lib/utils";

interface DailyForecastProps {
  data: DailyDataPoint[];
  timezone: string;
  className?: string;
}

export function DailyForecast({ data, timezone, className }: DailyForecastProps) {
  const temps = data
    .map((d) => [d.temp_min, d.temp_max])
    .flat()
    .filter((v) => Number.isFinite(v));

  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const span = max - min || 1;

  const position = (value: number) =>
    Math.max(0, Math.min(100, ((value - min) / span) * 100));

  return (
    <section
      className={cn("glass-panel rounded-[var(--radius-lg)] p-5", className)}
    >
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <CalendarDays className="h-4 w-4 text-primary" />
        7-Day Forecast
      </h3>

      <div className="divide-y divide-border">
        {data.map((day) => {
          const left = position(day.temp_min);
          const right = position(day.temp_max);
          const isToday = day.day_label.toLowerCase() === "today";

          return (
            <div
              key={day.date}
              className="grid grid-cols-[3.5rem_2.5rem_auto_1fr_auto] items-center gap-3 py-3"
            >
              <span
                className={cn(
                  "text-sm font-medium tabular-nums",
                  isToday && "font-semibold text-primary"
                )}
              >
                {day.day_label}
              </span>

              <WeatherIcon
                condition={day.condition}
                weatherCode={day.weather_code}
                className="h-6 w-6 text-primary"
                strokeWidth={1.5}
              />

              <span className="w-10 text-right text-sm tabular-nums text-muted-foreground">
                {formatTemperature(day.temp_min, "C")}
              </span>

              {/* Dual high/low temperature bar */}
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
                <div
                  className="absolute inset-y-0 rounded-full bg-gradient-to-r from-[hsl(173_80%_35%)] to-[hsl(173_80%_55%)]"
                  style={{
                    left: `${left}%`,
                    width: `${Math.max(right - left, 2)}%`,
                  }}
                />
              </div>

              <span className="w-10 text-right text-sm font-semibold tabular-nums">
                {formatTemperature(day.temp_max, "C")}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-right text-xs text-muted-foreground/70">
        {timezone}
      </p>
    </section>
  );
}
