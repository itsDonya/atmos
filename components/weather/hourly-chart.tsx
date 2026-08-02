"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CloudSun } from "lucide-react";

import type { HourlyChartPoint } from "@/types/api";
import {
  formatTemperature,
  formatPrecipitationProbability,
} from "@/lib/weather-format";
import { cn } from "@/lib/utils";

interface HourlyChartProps {
  data: HourlyChartPoint[];
  timezone: string;
  className?: string;
}

interface TooltipEntry {
  payload?: HourlyChartPoint;
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as HourlyChartPoint | undefined;
  if (!point) return null;

  return (
    <div className="rounded-xl border border-primary/30 bg-popover/95 px-3.5 py-2.5 shadow-2xl backdrop-blur">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
        {label ?? point.hour_label}
      </p>
      <div className="space-y-1 text-sm">
        <p className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">Temp</span>
          <span className="font-semibold">
            {formatTemperature(point.temperature, "C", 1)}°
          </span>
        </p>
        <p className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">Feels like</span>
          <span>{formatTemperature(point.apparent_temperature, "C", 1)}°</span>
        </p>
        <p className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">Precip.</span>
          <span>{formatPrecipitationProbability(point.precipitation_probability)}</span>
        </p>
        <p className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">Wind</span>
          <span>{point.wind_speed.toFixed(0)} km/h</span>
        </p>
      </div>
    </div>
  );
}

export function HourlyChart({ data, timezone, className }: HourlyChartProps) {
  return (
    <section
      className={cn("glass-panel rounded-[var(--radius-lg)] p-5", className)}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CloudSun className="h-4 w-4 text-primary" />
          24-Hour Forecast
        </h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[hsl(173_80%_45%)]" />
            Temperature
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#7c6cff]" />
            Precip. probability
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: -14, bottom: 0 }}
          >
            <defs>
              <linearGradient id="atmosTempFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(173 80% 45%)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(173 80% 45%)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="atmosPrecipFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c6cff" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#7c6cff" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="hour_label"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickMargin={8}
              minTickGap={28}
            />
            <YAxis
              yAxisId="temp"
              domain={["dataMin - 3", "dataMax + 3"]}
              tickLine={false}
              axisLine={false}
              width={44}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickFormatter={(v) => `${v}°`}
            />
            <YAxis
              yAxisId="precip"
              orientation="right"
              domain={[0, 100]}
              hide
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              yAxisId="precip"
              type="monotone"
              dataKey="precipitation_probability"
              stroke="#7c6cff"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              fill="url(#atmosPrecipFill)"
              dot={false}
              activeDot={false}
            />
            <Area
              yAxisId="temp"
              type="monotone"
              dataKey="temperature"
              name="Temperature"
              stroke="hsl(173 80% 45%)"
              strokeWidth={2.5}
              fill="url(#atmosTempFill)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "hsl(173 80% 45%)",
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-right text-xs text-muted-foreground/70">
        {timezone}
      </p>
    </section>
  );
}
