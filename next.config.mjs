/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        return [
          {
            source: '/api/:path*',
            destination: 'http://localhost:8080/api/:path*'
          },
        ]
      },
      eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
      }
};

export default nextConfig;
