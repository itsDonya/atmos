import type { WeatherCodeInfo, WeatherCondition } from "@/types/weather";

// ─── Temperature ──────────────────────────────────────────────────────────────

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function formatTemperature(
  celsius: number,
  unit: "C" | "F" = "C",
  decimals = 0
): string {
  const value = unit === "F" ? celsiusToFahrenheit(celsius) : celsius;
  return `${value.toFixed(decimals)}°${unit}`;
}

export function formatTemperatureValue(
  celsius: number,
  unit: "C" | "F" = "C",
  decimals = 0
): number {
  const value = unit === "F" ? celsiusToFahrenheit(celsius) : celsius;
  return parseFloat(value.toFixed(decimals));
}

// ─── Wind ─────────────────────────────────────────────────────────────────────

export function formatWindSpeed(kmh: number, decimals = 0): string {
  return `${kmh.toFixed(decimals)} km/h`;
}

export function formatWindDirection(degrees: number): string {
  const directions = [
    "N","NNE","NE","ENE","E","ESE","SE","SSE",
    "S","SSW","SW","WSW","W","WNW","NW","NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// ─── Visibility & Pressure & Humidity ─────────────────────────────────────────

export function formatVisibility(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${meters} m`;
}

export function formatPressure(hPa: number): string {
  return `${hPa.toFixed(0)} hPa`;
}

export function formatHumidity(percent: number): string {
  return `${Math.round(percent)}%`;
}

// ─── UV Index ─────────────────────────────────────────────────────────────────

export type UVLevel = "Low" | "Moderate" | "High" | "Very High" | "Extreme";

export interface UVInfo {
  level: UVLevel;
  color: string;
  description: string;
}

export function getUVInfo(uvIndex: number): UVInfo {
  if (uvIndex < 3) {
    return { level: "Low", color: "#22c55e", description: "No protection required. You can safely stay outside." };
  } else if (uvIndex < 6) {
    return { level: "Moderate", color: "#eab308", description: "Seek shade during midday. Wear sun protection." };
  } else if (uvIndex < 8) {
    return { level: "High", color: "#f97316", description: "Protection essential. Reduce time in sun midday." };
  } else if (uvIndex < 11) {
    return { level: "Very High", color: "#ef4444", description: "Extra protection required. Avoid sun between 10am–4pm." };
  } else {
    return { level: "Extreme", color: "#a855f7", description: "Stay indoors. If outside, shirt, sunscreen & hat required." };
  }
}

export function formatUVIndex(uvIndex: number): string {
  return uvIndex.toFixed(1);
}

// ─── Weather Codes ────────────────────────────────────────────────────────────

const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0:  { label: "Clear Sky",               condition: "clear",         description: "Perfectly clear skies" },
  1:  { label: "Mainly Clear",            condition: "clear",         description: "Mainly clear" },
  2:  { label: "Partly Cloudy",           condition: "partly-cloudy", description: "Partly cloudy" },
  3:  { label: "Overcast",               condition: "cloudy",        description: "Overcast" },
  45: { label: "Foggy",                  condition: "fog",           description: "Fog" },
  48: { label: "Rime Fog",               condition: "fog",           description: "Depositing rime fog" },
  51: { label: "Light Drizzle",          condition: "drizzle",       description: "Light drizzle" },
  53: { label: "Moderate Drizzle",       condition: "drizzle",       description: "Moderate drizzle" },
  55: { label: "Dense Drizzle",          condition: "drizzle",       description: "Dense drizzle" },
  56: { label: "Freezing Drizzle",       condition: "drizzle",       description: "Light freezing drizzle" },
  57: { label: "Heavy Freezing Drizzle", condition: "drizzle",       description: "Dense freezing drizzle" },
  61: { label: "Slight Rain",            condition: "rain",          description: "Slight rain" },
  63: { label: "Moderate Rain",          condition: "rain",          description: "Moderate rain" },
  65: { label: "Heavy Rain",             condition: "rain",          description: "Heavy rain" },
  66: { label: "Freezing Rain",          condition: "rain",          description: "Light freezing rain" },
  67: { label: "Heavy Freezing Rain",    condition: "rain",          description: "Heavy freezing rain" },
  71: { label: "Slight Snow",            condition: "snow",          description: "Slight snow fall" },
  73: { label: "Moderate Snow",          condition: "snow",          description: "Moderate snow fall" },
  75: { label: "Heavy Snow",             condition: "snow",          description: "Heavy snow fall" },
  77: { label: "Snow Grains",            condition: "snow",          description: "Snow grains" },
  80: { label: "Slight Showers",         condition: "rain",          description: "Slight rain showers" },
  81: { label: "Moderate Showers",       condition: "rain",          description: "Moderate rain showers" },
  82: { label: "Violent Showers",        condition: "rain",          description: "Violent rain showers" },
  85: { label: "Slight Snow Showers",    condition: "snow",          description: "Slight snow showers" },
  86: { label: "Heavy Snow Showers",     condition: "snow",          description: "Heavy snow showers" },
  95: { label: "Thunderstorm",           condition: "thunderstorm",  description: "Thunderstorm" },
  96: { label: "Thunderstorm w/ Hail",   condition: "thunderstorm",  description: "Thunderstorm with slight hail" },
  99: { label: "Thunderstorm w/ Heavy Hail", condition: "thunderstorm", description: "Thunderstorm with heavy hail" },
};

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  return (
    WEATHER_CODE_MAP[code] ?? {
      label: "Unknown",
      condition: "unknown" as WeatherCondition,
      description: "Unknown weather condition",
    }
  );
}

// ─── Timezone-safe date formatting ────────────────────────────────────────────

export function getHourLabel(isoString: string, timezone: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      hour12: true,
    }).format(date);
  } catch {
    return "—";
  }
}

export function getDayLabel(dateString: string, timezone: string): string {
  try {
    const date = new Date(`${dateString}T12:00:00Z`);
    if (isNaN(date.getTime())) return "—";

    const todayStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    if (dateString === todayStr) return "Today";

    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
    }).format(date);
  } catch {
    return "—";
  }
}

export function formatSunTime(isoString: string, timezone: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return "—";
  }
}

/**
 * Converts Open-Meteo "naive" local-time strings (e.g. "2025-06-15T14:00")
 * to an offset-aware ISO string using the utc_offset_seconds.
 * Open-Meteo returns times already in local time, so we append the offset.
 */
export function toOffsetAwareISO(
  naiveDatetime: string,
  utcOffsetSeconds: number
): string {
  try {
    const sign = utcOffsetSeconds >= 0 ? "+" : "-";
    const absOffset = Math.abs(utcOffsetSeconds);
    const offsetHours = String(Math.floor(absOffset / 3600)).padStart(2, "0");
    const offsetMinutes = String(Math.floor((absOffset % 3600) / 60)).padStart(2, "0");
    return `${naiveDatetime}:00${sign}${offsetHours}:${offsetMinutes}`;
  } catch {
    return naiveDatetime;
  }
}

// ─── Precipitation ────────────────────────────────────────────────────────────

export function formatPrecipitation(mm: number): string {
  if (mm === 0) return "0 mm";
  if (mm < 0.1) return "< 0.1 mm";
  return `${mm.toFixed(1)} mm`;
}

export function formatPrecipitationProbability(percent: number): string {
  return `${Math.round(percent)}%`;
}

