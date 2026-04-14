/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

// Deploy targets:
//   - GitHub Pages project site: DEPLOY_TARGET=pages  -> basePath /rcees-website
//   - Vercel / any root domain:  DEPLOY_TARGET unset  -> no basePath
// In prod we default to the Pages layout to keep the existing deploy
// working; Vercel's project settings override DEPLOY_TARGET to "vercel".
const target = process.env.DEPLOY_TARGET || (isProd ? "pages" : "dev");
const basePath = target === "pages" ? "/rcees-website" : "";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "rcees.uenr.edu.gh" },
    ],
  },
  trailingSlash: true,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
