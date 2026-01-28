import fs from 'fs'
const base = process.env.BASE_URL || 'https://namasteinsurance.com'
const pages = ['/', '/compare', '/scan', '/life-insurance', '/about', '/privacy', '/terms']
const urls = pages.map(p => `  <url>\n    <loc>${base}${p}</loc>\n  </url>`).join('\n')
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
fs.mkdirSync('public', { recursive: true })
fs.writeFileSync('public/sitemap.xml', xml)
console.log('Wrote public/sitemap.xml')
