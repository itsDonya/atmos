import { createElement } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";

import type { WeatherCondition } from "@/types/weather";

/**
 * Maps a weather condition (optionally refined by code + day/night) to a
 * curated lucide icon. Falls back gracefully to a generic cloud.
 */
export function getWeatherIcon(
  condition: WeatherCondition,
  code = 0,
  isDay = true
): LucideIcon {
  switch (condition) {
    case "clear":
      return isDay ? Sun : Moon;
    case "partly-cloudy":
      return isDay ? CloudSun : CloudMoon;
    case "cloudy":
      return code >= 3 ? Cloudy : Cloud;
    case "fog":
      return CloudFog;
    case "drizzle":
      return CloudDrizzle;
    case "rain":
      return CloudRain;
    case "snow":
      return CloudSnow;
    case "thunderstorm":
      return CloudLightning;
    default:
      return Cloud;
  }
}

export interface WeatherIconProps {
  condition: WeatherCondition;
  weatherCode?: number;
  isDay?: boolean;
  className?: string;
  strokeWidth?: number;
}

/**
 * A render-safe wrapper around `getWeatherIcon`. Uses `createElement` so the
 * icon stays a static, pre-declared component (satisfies
 * `react-hooks/static-components`) without re-mounting on every render.
 */
export function WeatherIcon({
  condition,
  weatherCode = 0,
  isDay = true,
  className,
  strokeWidth = 2,
}: WeatherIconProps) {
  const Icon = getWeatherIcon(condition, weatherCode, isDay);
  return createElement(Icon, { className, strokeWidth });
}
