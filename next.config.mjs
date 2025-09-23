/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "api.ingalepedhas.in",
        pathname: "/cms/**",
      },
      {
        protocol: "http",
        hostname: "api.ingalepedhas.in",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "api.ingalepedhas.in",
        pathname: "/cms/**",
      },
      {
        protocol: "https",
        hostname: "api.ingalepedhas.in",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
