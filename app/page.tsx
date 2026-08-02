"use client";

import { CloudSun } from "lucide-react";

/**
 * Placeholder landing for Prompt 1 & 2 (Foundation + BFF + State).
 * The full UI & data visualization experience ships in Prompt 2.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="glass-panel flex flex-col items-center gap-4 rounded-2xl px-10 py-12 shadow-2xl">
        <CloudSun className="h-16 w-16 text-primary" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-gradient">Atmos</span>
        </h1>
        <p className="max-w-md text-muted-foreground">
          The premium real-time weather engine. Foundation, feature-complete BFF,
          and state layer are live — the full dashboard UI arrives in the next
          build phase.
        </p>
        <p className="text-sm text-muted-foreground/70">
          ✓ Zustand store · ✓ BFF API routes · ✓ Geolocation hook · ✓ Premium theming
        </p>
      </div>
    </main>
  );
}
