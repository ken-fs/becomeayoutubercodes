import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: Cloudflare serves ./out directly as assets, which is the same
  // shape every other site in this fleet uses.
  output: "export",
  // The optimizer needs a server, and there is not one in an assets-only Worker.
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
