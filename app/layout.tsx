import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atmos-weather.vercel.app"),
  title: {
    default: "Atmos — Real-Time Weather",
    template: "%s | Atmos Weather",
  },
  description:
    "Atmos is a premium real-time weather dashboard with hourly forecasts, 7-day outlook, and beautiful data visualizations.",
  keywords: [
    "weather",
    "forecast",
    "hourly weather",
    "7 day forecast",
    "temperature",
    "uv index",
    "Atmos",
  ],
  authors: [{ name: "Atmos Weather" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://atmos-weather.vercel.app",
    siteName: "Atmos Weather",
    title: "Atmos — Real-Time Weather",
    description:
      "Premium real-time weather dashboard with hourly and 7-day forecasts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atmos — Real-Time Weather",
    description:
      "Premium real-time weather dashboard with hourly and 7-day forecasts.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1b2a",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
