/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HOME_URL: 'http://localhost:3000',
    REVALIDATION_TOKEN: 'SUPER_SECRET_REVALIDATION_TOKEN',
  },
};

module.exports = nextConfig;
