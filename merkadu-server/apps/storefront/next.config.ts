import {NextConfig} from 'next';

const nextConfig: NextConfig = {
    // LINHA ADICIONADA: Diz ao Next.js para criar a pasta standalone para o Docker
    output: 'standalone',
    
    cacheComponents: true,
    images: {
        // This is necessary to display images from your local Vendure instance
        dangerouslyAllowLocalIP: true,
        remotePatterns: [
            {
                hostname: 'readonlydemo.vendure.io',
            },
            {
                hostname: 'demo.vendure.io'
            },
            {
                hostname: 'localhost'
            }
        ],
    },
    experimental: {
        rootParams: true
    }
};

export default nextConfig;