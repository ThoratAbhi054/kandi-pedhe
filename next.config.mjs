/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Your frontend path
        destination: "https://api.ingalepedhas.in/:path*", // Backend URL
      },
    ];
  },
};

export default nextConfig;
