import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Protect admin routes and raw API from indexing
    },
    sitemap: `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/sitemap.xml`,
  };
}
