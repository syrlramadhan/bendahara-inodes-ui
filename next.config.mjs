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
    ],
  },
}

export default nextConfig;
