/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.vercel.app',
        'lyceum.us.ci',
        '*.lyceum.us.ci',
      ],
    },
  },
};

export default nextConfig;
