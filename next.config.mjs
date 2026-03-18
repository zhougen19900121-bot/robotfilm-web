import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Prisma 7.x generates .ts files with .js extension imports (ESM convention).
    // Tell webpack to also try .ts when it sees a .js import inside generated/prisma.
    if (isServer) {
      config.resolve.extensionAlias = {
        '.js': ['.js', '.ts'],
      };
    }
    return config;
  },
};

export default nextConfig;
