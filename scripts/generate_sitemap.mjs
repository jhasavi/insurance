import fs from 'fs'

const base = process.env.BASE_URL || 'https://safora.namastebostonhomes.com'
const today = new Date().toISOString().slice(0, 10)

const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/life-insurance', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/balance', priority: '0.9', changefreq: 'weekly' },
  { path: '/compare', priority: '0.8', changefreq: 'daily' },
  { path: '/scan', priority: '0.8', changefreq: 'weekly' },
  { path: '/classes', priority: '0.8', changefreq: 'weekly' },
  { path: '/how-it-works', priority: '0.6', changefreq: 'monthly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/glossary', priority: '0.6', changefreq: 'monthly' },
  { path: '/carriers', priority: '0.6', changefreq: 'monthly' },
  { path: '/blog', priority: '0.6', changefreq: 'weekly' },
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/contact', priority: '0.5', changefreq: 'monthly' },
  { path: '/licenses', priority: '0.4', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/accessibility', priority: '0.3', changefreq: 'yearly' },
]

const urls = pages
  .map(
    (p) =>
      `  <url>\n    <loc>${base}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

fs.mkdirSync('public', { recursive: true })
fs.writeFileSync('public/sitemap.xml', xml)
console.log(`Wrote public/sitemap.xml with ${pages.length} URLs for ${base}`)
