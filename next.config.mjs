/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  generateBuildId: async () => {
    return process.env.COMMIT_REF ?? `local-${Date.now()}`;
  },
  async redirects() {
    return [
      {
        source: "/hire-your-24x7-team",
        destination: "/your-ai-team",
        permanent: true,
      },
      {
        source: "/hire-your-24x7-team/:path*",
        destination: "/your-ai-team",
        permanent: true,
      },
      {
        source: "/build-your-ai-team",
        destination: "/your-ai-team",
        permanent: true,
      },
      {
        source: "/build-your-ai-team/:path*",
        destination: "/your-ai-team",
        permanent: true,
      },
      {
        source: "/my-ai-employees",
        destination: "/your-ai-team",
        permanent: true,
      },
      {
        source: "/my-ai-employees/:path*",
        destination: "/your-ai-team",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
