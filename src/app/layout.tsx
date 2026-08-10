import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { themeScript } from "@/components/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trafficiq.com"),
  title: {
    default: "TrafficIQ — Customer Acquisition Intelligence for Retail",
    template: "%s · TrafficIQ",
  },
  description:
    "TrafficIQ connects marketing activity to real store purchases — then shows you where to find your next customers. Customer acquisition intelligence for cannabis retailers.",
  applicationName: "TrafficIQ",
  keywords: [
    "customer acquisition intelligence",
    "dispensary marketing analytics",
    "cannabis retail attribution",
    "CAC",
    "marketing attribution",
    "trade area analysis",
  ],
  authors: [{ name: "TrafficIQ" }],
  openGraph: {
    title: "TrafficIQ — Know exactly where your new customers come from",
    description:
      "Connect marketing activity to real store purchases, then find where your next customers should come from.",
    siteName: "TrafficIQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrafficIQ — Customer Acquisition Intelligence",
    description:
      "Know exactly where your new customers come from — and where your next ones should.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
