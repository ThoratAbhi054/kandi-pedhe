/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow explicit domains alongside remotePatterns to cover all Next.js versions/configs
    domains: [
      "api.ingalepedhas.in",
      "127.0.0.1",
      "newingalepedhas.s3.amazonaws.com",
    ],
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
      {
        protocol: "https",
        hostname: "newingalepedhas.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
