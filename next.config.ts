import type { NextConfig } from "next";

/**
 * Static-export config for GitHub Pages.
 * The app deploys to a PROJECT page at https://<user>.github.io/<repo>/, so in
 * production every asset/route must be prefixed with `/<repo>`. Locally (dev +
 * `next start`) basePath is empty so nothing changes for day-to-day work.
 */
// basePath only for the public GitHub Pages demo build (PAGES=1). The private
// Vercel app serves at root, so basePath stays empty there.
const repo = "trafficiq-app";
const basePath = process.env.PAGES === "1" ? `/${repo}` : "";

const nextConfig: NextConfig = {
  // Static export only for the public GitHub Pages demo (PAGES=1). On Vercel the
  // app runs as a server so /live can read Neon and revalidate hourly.
  output: process.env.PAGES === "1" ? "export" : undefined,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true }, // no server = no on-demand image optimization
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true, // /overview -> /overview/index.html (Pages-friendly)
  // Exposed to the client so plain <img> tags can prefix the basePath too.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
