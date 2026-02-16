/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Disable Next.js/Vercel image optimization to avoid free-tier limits
    unoptimized: true,
  },
};

module.exports = nextConfig;

