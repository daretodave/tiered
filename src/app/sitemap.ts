import type { MetadataRoute } from 'next'
import { getSitemapRoutes } from '@/lib/routes'
import { canonicalUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return getSitemapRoutes().map((route) => ({
    url: canonicalUrl(route.path),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route.pattern === '/' ? 1.0 : 0.7,
  }))
}
