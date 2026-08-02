import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * AtmosLogo — the minimal geometric brand mark for "Atmos".
 * A stylised intersection of a sun and layered atmospheric cloud,
 * drawn in the premium Teal family. Transparent background so it can
 * be embedded anywhere (header, loading states, favicon-like spots).
 */
export function AtmosLogo({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label="Atmos"
      {...props}
    >
      <defs>
        <linearGradient
          id="atmos-logo-grad"
          x1="16"
          y1="14"
          x2="52"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="55%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      {/* Sun (light teal), sits behind the cloud */}
      <circle cx="43" cy="16" r="11.5" fill="#5eead4" />
      {/* Cloud / atmospheric layers (teal gradient) */}
      <g fill="url(#atmos-logo-grad)">
        <circle cx="26" cy="42" r="14" />
        <circle cx="41" cy="35" r="11" />
        <circle cx="15" cy="45" r="10" />
        <rect x="13" y="44" width="38" height="13" rx="6.5" />
      </g>
      {/* Highlights for depth */}
      <circle cx="20" cy="37" r="4" fill="#99f6e4" opacity="0.55" />
      <circle cx="36" cy="30" r="3" fill="#99f6e4" opacity="0.4" />
    </svg>
  );
}
