import { Sunrise, Sunset } from "lucide-react";

import { cn } from "@/lib/utils";

interface AstroWidgetProps {
  sunriseLabel: string;
  sunsetLabel: string;
  timezone: string;
  className?: string;
}

function AstroRow({
  label,
  time,
  icon: Icon,
}: {
  label: string;
  time: string;
  icon: typeof Sunrise;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-background/40 p-4 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-lg font-bold tabular-nums tracking-tight">{time}</p>
    </div>
  );
}

export function AstroWidget({
  sunriseLabel,
  sunsetLabel,
  timezone,
  className,
}: AstroWidgetProps) {
  return (
    <section
      className={cn(
        "glass-panel flex h-full flex-col rounded-[var(--radius-lg)] p-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sunrise className="h-4 w-4 text-primary" />
          Sun &amp; Moon
        </h3>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <AstroRow label="Sunrise" time={sunriseLabel} icon={Sunrise} />
        <AstroRow label="Sunset" time={sunsetLabel} icon={Sunset} />
      </div>

      {/* decorative dawn/dusk gradient arc */}
      <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gradient-to-r from-amber-400/40 via-primary/40 to-violet-400/40">
        <div className="absolute left-1/2 top-1/2 h-2.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
      </div>

      <p className="mt-3 text-right text-xs text-muted-foreground/70">
        {timezone}
      </p>
    </section>
  );
}
