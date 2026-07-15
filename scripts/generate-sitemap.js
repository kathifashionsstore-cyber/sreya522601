import fs from 'node:fs'
import path from 'node:path'
import { blogPosts } from '../src/mockData/blogPosts.js'
import { getAllServiceUrls } from '../src/mockData/services.js'

const siteUrl = process.env.VITE_SITE_URL || 'https://sreyaivfcentre.com'

const staticRoutes = [
  '/',
  '/about',
  '/services',
  '/doctors',
  '/gallery',
  '/blog',
  '/free-camp',
  '/success-stories',
  '/faq',
  '/contact',
  '/appointment',
  '/privacy-policy',
  '/terms-of-use',
  '/medical-disclaimer',
  '/cookie-policy',
]

const serviceRoutes = getAllServiceUrls()

// Published blog routes
const blogRoutes = blogPosts
  .filter((post) => post.published !== false)
  .map((post) => `/blog/${post.slug}`)

const urls = [...new Set([
  ...staticRoutes,
  ...serviceRoutes,
  ...blogRoutes,
])]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (route) => `  <url>
    <loc>${siteUrl.replace(/\/$/, '')}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.7'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), xml)
console.log(`Generated sitemap with ${urls.length} routes.`)
