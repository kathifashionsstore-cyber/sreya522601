import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { execSync } from 'node:child_process'
import { blogPosts } from '../src/mockData/blogPosts.js'
import { getAllServiceUrls } from '../src/mockData/services.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 1. Build the SSR bundle first
console.log('Building SSR server bundle...')
execSync('npx vite build --ssr src/entry-server.jsx --outDir dist-ssr', { stdio: 'inherit' })

// 2. Import the render function from compiled server bundle
const ssrPath = path.resolve(__dirname, '../dist-ssr/entry-server.js')
const { render } = await import(pathToFileURL(ssrPath).href)

// 3. Read template client HTML
const templatePath = path.resolve(__dirname, '../dist/index.html')
const template = fs.readFileSync(templatePath, 'utf-8')

// 4. Programmatically generate the list of routes to prerender
const staticRoutes = [
  '/',
  '/about',
  '/services',
  '/doctors',
  '/gallery',
  '/blog',
  '/free-camp',
  '/success-stories',
  '/contact',
  '/appointment',
  '/privacy-policy',
  '/terms-of-use',
  '/medical-disclaimer',
  '/cookie-policy',
]

const serviceRoutes = getAllServiceUrls()

// Blog post routes
const blogRoutes = blogPosts
  .filter((post) => post.published !== false)
  .map((post) => `/blog/${post.slug}`)

const routesToPrerender = [...new Set([
  ...staticRoutes,
  ...serviceRoutes,
  ...blogRoutes,
])]

console.log(`Prerendering ${routesToPrerender.length} routes...`)

// 5. Generate static files for each route
for (const route of routesToPrerender) {
  const helmetContext = {}
  const { html } = render(route, helmetContext)
  const { helmet } = helmetContext

  // Parse Helmet headers to strings
  const title = helmet?.title?.toString() || ''
  const meta = helmet?.meta?.toString() || ''
  const link = helmet?.link?.toString() || ''
  const script = helmet?.script?.toString() || ''

  // Inject rendered HTML and metadata into template
  let pageHtml = template
    .replace('<!--app-html-->', html) // replace placeholder if exists, otherwise fallback to root wrapper
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  
  // Inject Helmet headers inside the head element
  if (title || meta || link || script) {
    const headInjection = `\n  ${title}\n  ${meta}\n  ${link}\n  ${script}\n`
    pageHtml = pageHtml.replace('<head>', `<head>${headInjection}`)
  }

  // Determine output directory and filename
  const isIndex = route === '/'
  const outDir = isIndex 
    ? path.resolve(__dirname, '../dist') 
    : path.resolve(__dirname, `../dist${route}`)

  // Create directory path if it doesn't exist
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  const outFile = isIndex 
    ? path.join(outDir, 'index.html')
    : path.join(outDir, 'index.html')

  fs.writeFileSync(outFile, pageHtml, 'utf-8')
  console.log(`✓ Prerendered: ${route} -> ${path.relative(path.resolve(__dirname, '..'), outFile)}`)
}

// 6. Clean up temporary SSR bundle directory
console.log('Cleaning up SSR server bundle...')
fs.rmSync(path.resolve(__dirname, '../dist-ssr'), { recursive: true, force: true })

console.log('Static prerendering complete! Dispatching app-ready event.')
// In Node, we can simulate dispatching by printing, and browser does it natively if loaded.
console.log('All pages successfully generated for SEO indexing.')
