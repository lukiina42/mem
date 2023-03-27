/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXTAUTH_SECRET: "SECRET",
  },
};

module.exports = nextConfig;
