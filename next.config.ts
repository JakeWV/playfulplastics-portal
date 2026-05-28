import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Serve uploaded files
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/var/www/playfulplastics-portal/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
