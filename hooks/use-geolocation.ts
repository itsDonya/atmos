"use client";

import { useCallback, useState } from "react";

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

/**
 * SSR-safe geolocation hook that gracefully handles denied permissions.
 * Does not crash on server or when geolocation is unavailable.
 */
export function useGeolocation(options?: PositionOptions) {
  const supported =
    typeof window !== "undefined" && "geolocation" in navigator;

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false,
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (!supported) {
      setState({
        latitude: null,
        longitude: null,
        accuracy: null,
        loading: false,
        error: "Geolocation is not supported by this browser.",
      });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
        });
      },
      (err) => {
        let message = "Unable to retrieve your location.";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message =
              "Location permission was denied. Please allow access or search for a city.";
            break;
          case err.POSITION_UNAVAILABLE:
            message = "Location information is unavailable right now.";
            break;
          case err.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        setState({
          latitude: null,
          longitude: null,
          accuracy: null,
          loading: false,
          error: message,
        });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000, ...options }
    );
  }, [supported, options]);

  return {
    ...state,
    supported,
    requestLocation,
  };
}
