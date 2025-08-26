import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress hydration warnings for browser extensions
  reactStrictMode: true,
  
  // Enable experimental features for better hydration
  experimental: {
    optimizeCss: true,
  },
  
  // Webpack configuration for better hydration handling
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignore certain modules on client-side that might cause hydration issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // Configure headers to prevent some browser extension issues
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
