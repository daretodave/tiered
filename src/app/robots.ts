import type { MetadataRoute } from 'next'
import { canonicalUrl, siteConfig } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/mod', '/sign-in'],
      },
    ],
    sitemap: canonicalUrl('/sitemap.xml'),
    host: siteConfig.baseUrl,
  }
}
