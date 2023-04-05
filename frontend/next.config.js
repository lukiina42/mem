/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXTAUTH_SECRET: "SECRET",
    HOME_URL: "http://localhost:3000",
  },
};

module.exports = nextConfig;
