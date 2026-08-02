"use client";

import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--popover)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
        },
      }}
      {...props}
    />
  );
}
