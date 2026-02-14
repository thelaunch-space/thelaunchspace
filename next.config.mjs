/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/my-ai-employees/:path*",
        destination: "/build-your-ai-team/:path*",
        permanent: true,
      },
      {
        source: "/my-ai-employees",
        destination: "/build-your-ai-team",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
