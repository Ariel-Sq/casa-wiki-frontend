/** @type {import('next').NextConfig} */
const backend = process.env.BACKEND_URL ?? 'http://localhost:8080';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/api/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: backend,
  },
};

export default nextConfig;
