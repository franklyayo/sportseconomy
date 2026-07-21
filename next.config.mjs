/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['ws', 'pg', '@neondatabase/serverless'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
