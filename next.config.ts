import type { NextConfig } from 'next';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
} satisfies NextConfig;

export default nextConfig;
