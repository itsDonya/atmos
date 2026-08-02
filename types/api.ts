// Internal BFF (Backend for Frontend) API response types

import type { WeatherCondition } from "./weather";

export interface Location {
  name: string;
  country: string;
  country_code: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
}

export interface CurrentConditions {
  time: string; // ISO offset-aware
  temperature: number;
  apparent_temperature: number;
  humidity: number;
  dew_point: number;
  precipitation: number;
  weather_code: number;
  condition: WeatherCondition;
  condition_label: string;
  cloud_cover: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  wind_gusts: number;
  uv_index: number;
  visibility: number;
  is_day: boolean;
}

export interface HourlyDataPoint {
  time: string; // ISO offset-aware
  hour_label: string; // e.g. "3 PM"
  temperature: number;
  apparent_temperature: number;
  humidity: number;
  precipitation_probability: number;
  precipitation: number;
  weather_code: number;
  condition: WeatherCondition;
  wind_speed: number;
  wind_direction: number;
  uv_index: number;
  visibility: number;
  is_day: boolean;
}

export interface DailyDataPoint {
  date: string; // ISO date string e.g. "2025-06-15"
  day_label: string; // e.g. "Mon" or "Today"
  weather_code: number;
  condition: WeatherCondition;
  condition_label: string;
  temp_max: number;
  temp_min: number;
  apparent_temp_max: number;
  apparent_temp_min: number;
  sunrise: string; // ISO offset-aware
  sunset: string; // ISO offset-aware
  sunrise_label: string;
  sunset_label: string;
  precipitation_sum: number;
  precipitation_probability_max: number;
  wind_speed_max: number;
  wind_gusts_max: number;
  uv_index_max: number;
}

// Recharts-ready series data
export interface HourlyChartPoint {
  time: string;
  hour_label: string;
  temperature: number;
  apparent_temperature: number;
  humidity: number;
  precipitation_probability: number;
  wind_speed: number;
  uv_index: number;
}

export interface DailyChartPoint {
  date: string;
  day_label: string;
  temp_max: number;
  temp_min: number;
  precipitation_sum: number;
  wind_speed_max: number;
}

/**
 * US EPA Air Quality Index reading, normalized from Open-Meteo's
 * Air Quality API. `aqi` uses the US AQI scale (0–500) so the client can
 * classify it as Good / Moderate / Unhealthy, etc.
 */
export interface AirQuality {
  aqi: number;
  pm2_5: number; // µg/m³
  pm10: number; // µg/m³
  ozone: number; // µg/m³
  carbon_monoxide: number; // µg/m³
  nitrogen_dioxide: number; // µg/m³
  sulphur_dioxide: number; // µg/m³
}

export interface WeatherApiResponse {
  location: Location;
  current: CurrentConditions;
  hourly: HourlyDataPoint[];
  daily: DailyDataPoint[];
  hourly_chart: HourlyChartPoint[];
  daily_chart: DailyChartPoint[];
  air_quality: AirQuality;
  fetched_at: string;
}

export interface WeatherApiError {
  error: string;
  code: number;
}

export interface SearchResult {
  id: number;
  name: string;
  display_name: string;
  country: string;
  country_code: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
  population?: number;
}

export interface SearchApiResponse {
  results: SearchResult[];
}
