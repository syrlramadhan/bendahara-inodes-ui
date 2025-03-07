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
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://6fba-140-213-217-131.ngrok-free.app/api/:path*'
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://6fba-140-213-217-131.ngrok-free.app" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, ngrok-skip-browser-warning" },
          { key: "Access-Control-Allow-Credentials", value: "true" }
        ]
      }
    ]
  }
};

export default nextConfig;
