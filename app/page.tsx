import Link from "next/link";

import { AtmosLogo } from "@/components/ui/atmos-logo";
import { LocationSearch } from "@/components/weather/location-search";
import { WeatherDashboard } from "@/components/weather/weather-dashboard";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="Atmos home"
          >
            <AtmosLogo className="h-9 w-9 transition-transform duration-300 group-hover:scale-105" />
            <span className="text-xl font-bold tracking-tight">
              Atmos
            </span>
          </Link>
          <LocationSearch className="ml-auto max-w-lg" />
        </div>
      </header>

      {/* Dashboard */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <WeatherDashboard />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-gradient font-semibold">Atmos</span> — Real-time weather.
          </p>
          <p>Powered by Open-Meteo · Data refreshed every 15 min</p>
        </div>
      </footer>
    </div>
  );
}

