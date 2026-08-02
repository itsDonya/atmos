import { CloudSun, Search } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Zero-CLS skeletons.
 *
 * Every skeleton mirrors the exact markup + spacing of its final component
 * so that swapping in real data causes ZERO layout shift. Only the inner
 * "content" blocks are shimmering placeholders.
 */

export function SearchBarSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group relative flex h-11 w-full max-w-md items-center",
        className
      )}
    >
      <Search className="pointer-events-none absolute left-4 h-4 w-4 text-primary/70" />
      <Skeleton className="h-11 w-full rounded-full" />
      <span className="sr-only">Loading search</span>
    </div>
  );
}

function StatTileSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-3 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-7 w-14 rounded-lg" />
    </div>
  );
}

export function CurrentWeatherSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glass-panel flex flex-col gap-8 rounded-[var(--radius-lg)] p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      {/* Left: headline */}
      <div className="flex items-center gap-6">
        <Skeleton className="grid h-20 w-20 place-items-center rounded-2xl bg-primary/10">
          <CloudSun className="h-10 w-10 text-primary/30" />
        </Skeleton>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded-full bg-primary/10" />
          <Skeleton className="h-7 w-40 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-full" />
        </div>
        <Skeleton className="h-20 w-28 rounded-2xl text-5xl" />
      </div>

      {/* Right: stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
        <StatTileSkeleton />
        <StatTileSkeleton />
        <StatTileSkeleton />
        <StatTileSkeleton />
      </div>
    </div>
  );
}

export function HourlyChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[var(--radius-lg)] p-5",
        className
      )}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full bg-primary/20" />
          <Skeleton className="h-4 w-32 rounded-full" />
        </div>
        <div className="hidden gap-3 sm:flex">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-3 w-16 rounded-full" />
        </div>
      </div>
      {/* Mimic the responsive area-chart container */}
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((_, i) => (
            <Skeleton key={i} className="h-px w-full bg-primary/5" />
          ))}
        </div>
        {/* Soft teal "area" blob rising from the baseline */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 rounded-t-[2rem] bg-gradient-to-t from-primary/25 via-primary/10 to-transparent blur-[2px]" />
      </div>
    </div>
  );
}

export function DailyForecastSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[var(--radius-lg)] p-5",
        className
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full bg-primary/20" />
        <Skeleton className="h-4 w-32 rounded-full" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[3.5rem_2.5rem_2.5rem_1fr_2.5rem] items-center gap-3 py-3"
          >
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full bg-primary/15" />
            <Skeleton className="h-4 w-9 rounded-full" />
            <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
              <Skeleton className="h-full w-2/3 rounded-full bg-primary/25" />
            </div>
            <Skeleton className="h-4 w-9 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Full dashboard skeleton — matches the weather-dashboard grid exactly. */
export function WeatherSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <CurrentWeatherSkeleton />
      <div className="grid gap-5 lg:grid-cols-5">
        <HourlyChartSkeleton className="lg:col-span-3" />
        <DailyForecastSkeleton className="lg:col-span-2" />
      </div>
    </div>
  );
}

export function HeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Skeleton className="h-9 w-9 rounded-xl bg-primary/20" />
      <SearchBarSkeleton className="ml-auto max-w-md" />
    </div>
  );
}
