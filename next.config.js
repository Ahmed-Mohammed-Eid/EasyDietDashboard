/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: 'https://api.easydietkw.com/api/v1'
    },
    images: {
        remotePatterns: [
            {
                // ALL IMAGES FROM ALL DOMAINS
                protocol: 'https',
                hostname: 'api.easydietkw.com'
            },
            {
                // ALL IMAGES FROM ALL DOMAINS
                protocol: 'http',
                hostname: 'api.easydietkw.com'
            },
            {
                // ALL IMAGES FROM ALL DOMAINS
                protocol: 'https',
                hostname: 'easydietkw.com'
            },
            {
                // ALL IMAGES FROM ALL DOMAINS
                protocol: 'http',
                hostname: 'easydietkw.com'
            }
        ]
    }
};

module.exports = nextConfig;
