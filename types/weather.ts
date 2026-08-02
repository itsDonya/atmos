// Open-Meteo API response types

export interface OpenMeteoCurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  uv_index: number;
  uv_index_clear_sky: number;
  visibility: number;
  dew_point_2m: number;
}

export interface OpenMeteoHourlyData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  uv_index: number[];
  visibility: number[];
  is_day: number[];
}

export interface OpenMeteoDailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  uv_index_max: number[];
  uv_index_clear_sky_max: number[];
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: OpenMeteoCurrentWeather;
  hourly_units: Record<string, string>;
  hourly: OpenMeteoHourlyData;
  daily_units: Record<string, string>;
  daily: OpenMeteoDailyData;
}

// ─── Air Quality API types (Open-Meteo /v1/air-quality) ─────────────────────

export interface OpenMeteoAirQualityCurrent {
  time: string;
  interval: number;
  us_aqi: number; // US EPA AQI (0–500)
  pm2_5: number; // µg/m³
  pm10: number; // µg/m³
  ozone: number; // µg/m³
  carbon_monoxide: number; // µg/m³
  nitrogen_dioxide: number; // µg/m³
  sulphur_dioxide: number; // µg/m³
}

export interface OpenMeteoAirQualityResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: OpenMeteoAirQualityCurrent;
}

// Geocoding API types
export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id?: number;
  admin2_id?: number;
  timezone: string;
  population?: number;
  country_id: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms: number;
}

// Weather code mapping
export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunderstorm"
  | "unknown";

export interface WeatherCodeInfo {
  label: string;
  condition: WeatherCondition;
  description: string;
}
