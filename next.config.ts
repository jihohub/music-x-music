/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  images: {
    domains: ["i.scdn.co"],
  },
};

export default nextConfig;
