import { Leaf, Wind } from "lucide-react";

import type { AirQuality } from "@/types/api";
import { cn } from "@/lib/utils";

interface AqiWidgetProps {
  airQuality: AirQuality;
  className?: string;
}

interface AqiBand {
  label: string;
  color: string;
  description: string;
}

// US EPA AQI classification (0–500)
function getAqiBand(aqi: number): AqiBand {
  if (aqi <= 50) {
    return {
      label: "Good",
      color: "#22c55e",
      description: "Air quality is satisfactory, air pollution poses little risk.",
    };
  }
  if (aqi <= 100) {
    return {
      label: "Moderate",
      color: "#eab308",
      description: "Acceptable quality; sensitive groups should limit exertion.",
    };
  }
  if (aqi <= 150) {
    return {
      label: "Unhealthy for Sensitive Groups",
      color: "#f97316",
      description: "Sensitive groups may experience health effects.",
    };
  }
  if (aqi <= 200) {
    return {
      label: "Unhealthy",
      color: "#ef4444",
      description: "Everyone may begin to experience health effects.",
    };
  }
  if (aqi <= 300) {
    return {
      label: "Very Unhealthy",
      color: "#a855f7",
      description: "Health alert — everyone may experience serious effects.",
    };
  }
  return {
    label: "Hazardous",
    color: "#7f1d1d",
    description: "Emergency conditions — avoid outdoor activity.",
  };
}

function PollutantStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 px-2 py-2 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">
        {value.toFixed(0)}
      </p>
    </div>
  );
}

export function AqiWidget({ airQuality, className }: AqiWidgetProps) {
  const { aqi, pm2_5, pm10, ozone } = airQuality;
  const hasData = aqi > 0;
  const band = getAqiBand(aqi);

  return (
    <section
      className={cn(
        "glass-panel flex h-full flex-col rounded-[var(--radius-lg)] p-5",
        className
      )}
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Leaf className="h-4 w-4 text-primary" />
        Air Quality
      </h3>

      {hasData ? (
        <>
          <div className="mt-4 flex items-center gap-4">
            <div
              className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-xl font-bold tabular-nums"
              style={{
                color: band.color,
                boxShadow: `inset 0 0 0 3px ${band.color}55`,
                backgroundColor: `${band.color}14`,
              }}
            >
              {aqi}
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold leading-tight" style={{ color: band.color }}>
                {band.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {band.description}
              </p>
            </div>
          </div>

          {/* Indicator bar */}
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-[width]"
              style={{
                width: `${Math.min(aqi, 300) / 3}%`,
                background: `linear-gradient(90deg, #22c55e, #eab308, #f97316, #ef4444 ${Math.max(
                  (aqi / 250) * 100,
                  50
                )}%)`,
              }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <PollutantStat label="PM2.5" value={pm2_5} />
            <PollutantStat label="PM10" value={pm10} />
            <PollutantStat label="O₃" value={ozone} />
          </div>
        </>
      ) : (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background/40 p-4">
          <Wind className="h-5 w-5 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Air quality data is unavailable for this location.
          </p>
        </div>
      )}
    </section>
  );
}
