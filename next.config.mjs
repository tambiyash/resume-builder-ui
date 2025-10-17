/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/auth/linkedin/callback",
        destination: "/api/auth/linkedin/callback",
        permanent: false,
      },
      {
        source: "/auth/linkedin/callback/",
        destination: "/api/auth/linkedin/callback",
        permanent: false,
      },
    ]
  },
}

export default nextConfig