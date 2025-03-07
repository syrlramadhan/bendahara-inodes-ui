/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '009d-114-125-221-46.ngrok-free.app',
        port: '',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: '53f1-140-213-217-116.ngrok-free.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '6fba-140-213-217-131.ngrok-free.app',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "http://localhost:5500" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ]
  }
}

export default nextConfig;
