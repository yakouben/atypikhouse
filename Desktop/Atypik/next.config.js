/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost', 'your-supabase-project.supabase.co']
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  }
};

module.exports = nextConfig;
