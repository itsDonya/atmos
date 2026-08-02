# Product Requirements Document (PRD)

**Project Name:** Atmos Weather
**Platform:** Web Application
**Objective:** A portfolio-grade, enterprise-ready weather application demonstrating senior-level architectural patterns, strict typing, and high-performance UI.

## 1. Core Architecture & Tech Stack

- **Framework:** Next.js (App Router) - Full-stack.
- **Language:** TypeScript (Strict mode).
- **Package Manager:** `pnpm`.
- **State Management:** Zustand (for client states & persisted recent searches).
- **Styling:** Tailwind CSS + Custom-themed shadcn/ui.
- **Data Visualization:** Recharts (customized to match the app's theme).
- **External APIs (100% Free):** Open-Meteo (Weather), Open-Meteo Geocoding / Nominatim.

## 2. Senior-Level Distinctions (The "Wow" Factors)

- **BFF (Backend for Frontend):** Client components NEVER call external APIs. All requests go through Next.js Route Handlers (`app/api/...`) which act as a proxy, sanitize data, and utilize Next.js data caching (`revalidate`).
- **Timezone Mastery:** Weather data and charts MUST reflect the local time of the _searched city_, not the user's browser timezone. ISO strings with strict offsets must be parsed from the BFF.
- **Zero-CLS Skeletons:** Loading states must use structurally identical Skeleton components to ensure 0 Cumulative Layout Shift.
- **Bespoke UI:** No default generic dashboard looks. The UI must use custom CSS variables for a premium, high-contrast, modern aesthetic (avoiding basic glassmorphism).
- **Resilience & a11y:** Graceful degradation if geolocation fails. Full keyboard navigation. ARIA labels on all interactive elements.
- **Dynamic SEO:** `Metadata` API implementation that dynamically updates titles and OpenGraph tags based on the currently viewed city's weather.

## 3. Key Features

1.  **Smart Location Search:** Debounced input, fetching from geocoding API, persisting history via Zustand.
2.  **Geolocation Hook:** Auto-detect user location with strict error boundaries and fallbacks.
3.  **Current Weather:** Temp, feels like, humidity, wind, and UV index.
4.  **24h Hourly Chart:** Interactive Recharts area graph with custom tooltips.
5.  **7-Day Forecast:** Clean list/grid with high/low visual indicators.
