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
    // Allow unoptimized local public images
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '300mb',
    },
  },
};



export default nextConfig;
