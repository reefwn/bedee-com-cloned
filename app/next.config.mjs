import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.bedee.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  // Old WordPress article URLs must keep working after migration.
  async redirects() {
    return [
      {
        source: '/articles/:category/:slug',
        destination: '/article/:category/:slug',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)
