/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'gcbppyetisfunawqzzjt.supabase.co',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            }
        ],
        minimumCacheTTL: 3600, // Cache optimised images for 1 hour
    },
    async headers() {
        return [
            {
                // Cache static assets (JS, CSS, fonts, icons) for 1 year immutably
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                // Cache public folder assets (images, PDFs) for 1 day
                source: '/assets/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=86400, stale-while-revalidate=3600',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
