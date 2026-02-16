/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/build-your-ai-team",
        destination: "/hire-your-24x7-team",
        permanent: true,
      },
      {
        source: "/build-your-ai-team/:path*",
        destination: "/hire-your-24x7-team#team",
        permanent: true,
      },
      {
        source: "/my-ai-employees",
        destination: "/hire-your-24x7-team",
        permanent: true,
      },
      {
        source: "/my-ai-employees/:path*",
        destination: "/hire-your-24x7-team",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
