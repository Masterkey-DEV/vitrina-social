/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ✅ Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // ✅ Strapi local
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      // ✅ Strapi en Railway
      {
        protocol: "https",
        hostname: "memoria-y-verdad-production.up.railway.app",
      },
    ],
  },
};

export default nextConfig;