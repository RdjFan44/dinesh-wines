/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Allow locally uploaded images served from /public/uploads
      { protocol: 'http', hostname: 'localhost' },
    ],
    // Also allow unoptimized local paths
    unoptimized: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async redirects() {
    return [
      // Root → new static frontend
      { source: '/', destination: '/index.html', permanent: false },
    ];
  },
};

export default nextConfig;
