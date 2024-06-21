/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: 'https://api.easydietkw.com/api/v1',
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: 'test.easydietkw.com',
            },
            {
                protocol: 'https',
                hostname: 'easydietkw.com',
            },
            {
                protocol: 'https',
                hostname: 'api.easydietkw.com',
            },
        //     LOCALHOST
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'localhost',
            },
        ],
    },
}

module.exports = nextConfig
