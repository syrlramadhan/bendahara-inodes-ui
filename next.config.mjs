/** @type {import('next').NextConfig} */
const NGROK_URL = 'https://bendahara-inodes-api-production.up.railway.app';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: NGROK_URL.replace('https://', ''),
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    console.log('Rewriting to:', `${NGROK_URL}/api/:path*`);
    return [
      {
        source: '/api/:path*',
        destination: `${NGROK_URL}/api/:path*`
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ]
      }
    ]
  }
};

export default nextConfig;
