/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['imgbb.com', 'cdn.sanity.io'],
  },
};

module.exports = nextConfig;
