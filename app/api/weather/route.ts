import { NextResponse } from "next/server";

import type {
  OpenMeteoResponse,
  OpenMeteoHourlyData,
  OpenMeteoDailyData,
  OpenMeteoAirQualityResponse,
} from "@/types/weather";
import type {
  WeatherApiResponse,
  Location,
  CurrentConditions,
  HourlyDataPoint,
  DailyDataPoint,
  HourlyChartPoint,
  DailyChartPoint,
  AirQuality,
} from "@/types/api";
import {
  getWeatherCodeInfo,
  getHourLabel,
  getDayLabel,
  formatSunTime,
  toOffsetAwareISO,
} from "@/lib/weather-format";

export const dynamic = "force-dynamic";
export const revalidate = 900;

const OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_BASE = "https://air-quality-api.open-meteo.com/v1/air-quality";

function validateParams(params: {
  lat?: string;
  lon?: string;
  timezone?: string;
}) {
  const { lat, lon, timezone } = params;

  if (!lat || !lon) {
    return {
      error: "Both 'lat' and 'lon' query parameters are required.",
      code: 400,
    };
  }

  const latitude = Number(lat);
  const longitude = Number(lon);

  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    return { error: "Invalid 'lat' value. Must be between -90 and 90.", code: 400 };
  }
  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    return { error: "Invalid 'lon' value. Must be between -180 and 180.", code: 400 };
  }

  return { latitude, longitude, timezone: timezone ?? "auto" };
}

function buildOpenMeteoUrl(latitude: number, longitude: number, timezone: string) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,uv_index_clear_sky,visibility,dew_point_2m",
    hourly:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index,visibility,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max,uv_index_clear_sky_max",
    forecast_days: "7",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  });

  return `${OPEN_METEO_BASE}?${params.toString()}`;
}

function buildAirQualityUrl(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "us_aqi,pm2_5,pm10,ozone,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide",
    timezone: "auto",
  });

  return `${AIR_QUALITY_BASE}?${params.toString()}`;
}

function buildAirQuality(json: OpenMeteoAirQualityResponse): AirQuality {
  const c = json.current;
  return {
    aqi: c.us_aqi,
    pm2_5: c.pm2_5,
    pm10: c.pm10,
    ozone: c.ozone,
    carbon_monoxide: c.carbon_monoxide,
    nitrogen_dioxide: c.nitrogen_dioxide,
    sulphur_dioxide: c.sulphur_dioxide,
  };
}

function buildLocation(json: OpenMeteoResponse, timezone: string): Location {
  return {
    name: timezone,
    country: "",
    country_code: "",
    latitude: json.latitude,
    longitude: json.longitude,
    timezone,
    elevation: json.elevation,
  };
}

function buildCurrent(
  json: OpenMeteoResponse,
  utcOffsetSeconds: number
): CurrentConditions {
  const current = json.current;
  const info = getWeatherCodeInfo(current.weather_code);

  return {
    time: toOffsetAwareISO(current.time, utcOffsetSeconds),
    temperature: current.temperature_2m,
    apparent_temperature: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    dew_point: current.dew_point_2m,
    precipitation: current.precipitation,
    weather_code: current.weather_code,
    condition: info.condition,
    condition_label: info.label,
    cloud_cover: current.cloud_cover,
    pressure: current.pressure_msl,
    wind_speed: current.wind_speed_10m,
    wind_direction: current.wind_direction_10m,
    wind_gusts: current.wind_gusts_10m,
    uv_index: current.uv_index,
    visibility: current.visibility,
    is_day: current.is_day === 1,
  };
}

function buildHourly(
  hourly: OpenMeteoHourlyData,
  timezone: string,
  utcOffsetSeconds: number
): { points: HourlyDataPoint[]; chart: HourlyChartPoint[] } {
  const points: HourlyDataPoint[] = [];
  const chart: HourlyChartPoint[] = [];

  const count = Math.min(hourly.time.length, 48);

  for (let i = 0; i < count; i++) {
    const iso = toOffsetAwareISO(hourly.time[i], utcOffsetSeconds);
    const info = getWeatherCodeInfo(hourly.weather_code[i]);
    const hourLabel = getHourLabel(iso, timezone);

    points.push({
      time: iso,
      hour_label: hourLabel,
      temperature: hourly.temperature_2m[i],
      apparent_temperature: hourly.apparent_temperature[i],
      humidity: hourly.relative_humidity_2m[i],
      precipitation_probability: hourly.precipitation_probability[i],
      precipitation: hourly.precipitation[i],
      weather_code: hourly.weather_code[i],
      condition: info.condition,
      wind_speed: hourly.wind_speed_10m[i],
      wind_direction: hourly.wind_direction_10m[i],
      uv_index: hourly.uv_index[i],
      visibility: hourly.visibility[i],
      is_day: hourly.is_day[i] === 1,
    });

    chart.push({
      time: iso,
      hour_label: hourLabel,
      temperature: hourly.temperature_2m[i],
      apparent_temperature: hourly.apparent_temperature[i],
      humidity: hourly.relative_humidity_2m[i],
      precipitation_probability: hourly.precipitation_probability[i],
      wind_speed: hourly.wind_speed_10m[i],
      uv_index: hourly.uv_index[i],
    });
  }

  return { points, chart };
}

function buildDaily(
  daily: OpenMeteoDailyData,
  timezone: string,
  utcOffsetSeconds: number
): { points: DailyDataPoint[]; chart: DailyChartPoint[] } {
  const points: DailyDataPoint[] = [];
  const chart: DailyChartPoint[] = [];

  for (let i = 0; i < daily.time.length; i++) {
    const info = getWeatherCodeInfo(daily.weather_code[i]);
    const dayLabel = getDayLabel(daily.time[i], timezone);

    points.push({
      date: daily.time[i],
      day_label: dayLabel,
      weather_code: daily.weather_code[i],
      condition: info.condition,
      condition_label: info.label,
      temp_max: daily.temperature_2m_max[i],
      temp_min: daily.temperature_2m_min[i],
      apparent_temp_max: daily.apparent_temperature_max[i],
      apparent_temp_min: daily.apparent_temperature_min[i],
      sunrise: toOffsetAwareISO(daily.sunrise[i], utcOffsetSeconds),
      sunset: toOffsetAwareISO(daily.sunset[i], utcOffsetSeconds),
      sunrise_label: formatSunTime(daily.sunrise[i], timezone),
      sunset_label: formatSunTime(daily.sunset[i], timezone),
      precipitation_sum: daily.precipitation_sum[i],
      precipitation_probability_max: daily.precipitation_probability_max[i],
      wind_speed_max: daily.wind_speed_10m_max[i],
      wind_gusts_max: daily.wind_gusts_10m_max[i],
      uv_index_max: daily.uv_index_max[i],
    });

    chart.push({
      date: daily.time[i],
      day_label: dayLabel,
      temp_max: daily.temperature_2m_max[i],
      temp_min: daily.temperature_2m_min[i],
      precipitation_sum: daily.precipitation_sum[i],
      wind_speed_max: daily.wind_speed_10m_max[i],
    });
  }

  return { points, chart };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = validateParams({
      lat: url.searchParams.get("lat") ?? undefined,
      lon: url.searchParams.get("lon") ?? undefined,
      timezone: url.searchParams.get("timezone") ?? undefined,
    });

    if ("error" in params) {
      return NextResponse.json(
        { error: params.error, code: params.code },
        { status: params.code }
      );
    }

    const { latitude, longitude, timezone } = params as {
      latitude: number;
      longitude: number;
      timezone: string;
    };

    const fetchUrl = buildOpenMeteoUrl(latitude, longitude, timezone);
    const airQualityUrl = buildAirQualityUrl(latitude, longitude);

    const [response, airQualityResponse] = await Promise.all([
      fetch(fetchUrl, {
        headers: { Accept: "application/json" },
        next: { revalidate: 900 },
      }),
      fetch(airQualityUrl, {
        headers: { Accept: "application/json" },
        next: { revalidate: 900 },
      }),
    ]);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Open-Meteo returned status ${response.status}`, code: 502 },
        { status: 502 }
      );
    }

    const json = (await response.json()) as OpenMeteoResponse;
    const utcOffsetSeconds = json.utc_offset_seconds ?? 0;

    // Air quality is a nice-to-have; if it fails, surface a neutral reading
    // rather than failing the whole weather request.
    let airQuality: AirQuality = {
      aqi: 0,
      pm2_5: 0,
      pm10: 0,
      ozone: 0,
      carbon_monoxide: 0,
      nitrogen_dioxide: 0,
      sulphur_dioxide: 0,
    };
    if (airQualityResponse.ok) {
      try {
        const aqJson = (await airQualityResponse.json()) as OpenMeteoAirQualityResponse;
        airQuality = buildAirQuality(aqJson);
      } catch {
        /* keep neutral airQuality */
      }
    }

    // When timezone is "auto", Open-Meteo resolves the correct IANA zone.
    const resolvedTimezone = timezone === "auto" ? json.timezone : timezone;

    const location = buildLocation(json, resolvedTimezone);
    const current = buildCurrent(json, utcOffsetSeconds);
    const { points: hourly, chart: hourlyChart } = buildHourly(
      json.hourly,
      resolvedTimezone,
      utcOffsetSeconds
    );
    const { points: daily, chart: dailyChart } = buildDaily(
      json.daily,
      resolvedTimezone,
      utcOffsetSeconds
    );

    const payload: WeatherApiResponse = {
      location,
      current,
      hourly,
      daily,
      hourly_chart: hourlyChart,
      daily_chart: dailyChart,
      air_quality: airQuality,
      fetched_at: new Date().toISOString(),
    };

    // Cache for up to 15 minutes (matching revalidate: 900)
    const nextResponse = NextResponse.json(payload);
    nextResponse.headers.set(
      "Cache-Control",
      "public, s-maxage=900, stale-while-revalidate=3600"
    );
    return nextResponse;
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data.", code: 500 },
      { status: 500 }
    );
  }
}

