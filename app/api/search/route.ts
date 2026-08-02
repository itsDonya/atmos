import { NextResponse } from "next/server";

import type { GeocodingResponse, GeocodingResult } from "@/types/weather";
import type { SearchApiResponse, SearchResult } from "@/types/api";

export const dynamic = "force-dynamic";

const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1/search";

function mapResult(result: GeocodingResult): SearchResult {
  return {
    id: result.id,
    name: result.name,
    display_name: [result.name, result.admin1, result.country]
      .filter(Boolean)
      .join(", "),
    country: result.country,
    country_code: result.country_code,
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
    elevation: result.elevation,
    population: result.population,
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required.", code: 400 },
        { status: 400 }
      );
    }

    if (query.length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters.", code: 400 },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      name: query,
      count: "8",
      language: "en",
      format: "json",
    });

    const response = await fetch(`${GEOCODING_BASE}?${params.toString()}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Geocoding API returned status ${response.status}`, code: 502 },
        { status: 502 }
      );
    }

    const json = (await response.json()) as GeocodingResponse;
    const results = (json.results ?? []).map(mapResult);

    const payload: SearchApiResponse = { results };
    const nextResponse = NextResponse.json(payload);
    nextResponse.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=7200"
    );
    return nextResponse;
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search locations.", code: 500 },
      { status: 500 }
    );
  }
}
