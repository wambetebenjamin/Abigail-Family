import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes = [
    { path: '', priority: 1 },
    { path: '/features', priority: 0.9 },
    { path: '/pricing', priority: 0.9 },
    { path: '/about', priority: 0.8 },
    { path: '/register', priority: 0.7 },
    { path: '/login', priority: 0.5 },
    { path: '/legal/privacy-policy', priority: 0.4 },
    { path: '/legal/terms', priority: 0.4 },
    { path: '/legal/cookie-policy', priority: 0.4 },
  ]

  return routes.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: route.priority,
  }))
}
