/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: 'https://test.easydietkw.com/api/v1',
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
        ],
    },
}

module.exports = nextConfig
