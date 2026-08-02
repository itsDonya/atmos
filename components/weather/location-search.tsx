"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Clock, Loader2, MapPin, Navigation, Search, X } from "lucide-react";
import { toast } from "sonner";

import {
  useWeatherStore,
  fetchWeatherForLocation,
  searchLocations,
  locationToActive,
} from "@/store/useWeatherStore";
import type { SearchResult } from "@/types/api";
import { cn } from "@/lib/utils";

export function LocationSearch({ className }: { className?: string }) {
  const { setActiveLocation, activeLocation, recentSearches } =
    useWeatherStore();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmed = query.trim();

  // Close on outside click
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  // The dashboard broadcasts this when geolocation is denied so the user can
  // immediately start typing a city (auto-focus, zero extra clicks).
  useEffect(() => {
    function onFocusSearch() {
      inputRef.current?.focus();
      setOpen(true);
    }
    window.addEventListener("atmos:focus-search", onFocusSearch);
    return () => window.removeEventListener("atmos:focus-search", onFocusSearch);
  }, []);

  // Debounced search against /api/search. All state writes happen in the
  // debounce callback (async) or event handlers — never synchronously in the
  // effect body — to satisfy react-hooks/set-state-in-effect.
  useEffect(() => {
    if (trimmed.length < 2) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchLocations(trimmed);
        setResults(data);
        setError(null);
      } catch (err) {
        setResults([]);
        setError(
          err instanceof Error ? err.message : "Search failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [trimmed]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      const active = locationToActive(result);
      setActiveLocation(active);
      useWeatherStore.getState().addRecentSearch(result);
      setQuery("");
      setOpen(false);
      setResults([]);

      fetchWeatherForLocation(active).catch((err) => {
        toast.error(
          err instanceof Error ? err.message : "Unable to load weather.",
          {
            description: `Check "${result.display_name}" and try again.`,
          }
        );
      });
    },
    [setActiveLocation]
  );

  const showRecent = trimmed.length < 2 && recentSearches.length > 0;
  const showResults = trimmed.length >= 2;
  const showDropdown = open && (showRecent || showResults || loading);

  const displayValue = useMemo(() => {
    if (query) return query;
    return activeLocation ? activeLocation.display_name : "";
  }, [query, activeLocation]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative flex h-11 items-center">
        <Search className="pointer-events-none absolute left-4 h-4 w-4 text-primary" />
        <input
          ref={inputRef}
          value={displayValue}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            setOpen(true);
            if (value.trim().length < 2) {
              setResults([]);
              setError(null);
              setLoading(false);
            } else {
              setLoading(true);
            }
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "Enter" && results[0]) handleSelect(results[0]);
          }}
          placeholder={
            activeLocation
              ? activeLocation.display_name
              : "Search for a city…"
          }
          className="h-11 w-full rounded-full border border-border bg-background/60 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label="Search location"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="absolute right-3 rounded-full p-1 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <span className="pointer-events-none absolute right-4 text-[10px] font-semibold uppercase tracking-wider text-white/15">
            ⌘K
          </span>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-2xl">
          {showRecent && (
            <div>
              <p className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Recent
              </p>
              {recentSearches.slice(0, 5).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(r);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
                  <span className="truncate">{r.display_name}</span>
                </button>
              ))}
            </div>
          )}

          {showResults && (
            <div>
              {loading && (
                <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Searching…
                </div>
              )}
              {!loading && error && (
                <p className="px-3 py-3 text-sm text-destructive">{error}</p>
              )}
              {!loading && !error && results.length === 0 && (
                <p className="px-3 py-3 text-sm text-muted-foreground">
                  No locations found.
                </p>
              )}
              {!loading &&
                !error &&
                results.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(r);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <Navigation className="h-4 w-4 shrink-0 text-primary/70" />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{r.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {r.admin1 ?? r.country}
                      </span>
                    </span>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
