/** @type {import('next').NextConfig} */
const nextConfig = {
  serverActions: {
    allowedOrigins: [
      'localhost:3000',
      '*.vercel.app',
    ],
  },
};

export default nextConfig;
