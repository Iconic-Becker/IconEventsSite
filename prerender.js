// Renders each route to static HTML after `vite build` so crawlers get real
// content on first request. React hydrates over it in the browser.
//
// Routes and the sitemap are both derived from CASE_STUDIES, so adding an
// event to src/case-studies.js is enough: its page is prerendered and listed
// without touching this file.
import fs from 'node:fs'
import path from 'node:path'
import { render } from './dist-ssr/entry-server.js'
import { CASE_STUDIES } from './src/case-studies.js'

const SITE = 'https://www.iconic.events'

// Per route metadata, so the static HTML a crawler receives carries the right
// title and description rather than the homepage's.
const ROUTES = [
  {
    path: '/',
    title: 'Event Production in South Florida | Iconic Events',
    description:
      'Iconic Events is a full-service event production company crafting corporate & experiential events across South Florida. Get a free quote today.',
  },
  ...CASE_STUDIES.map((study) => ({
    path: `/case-studies/${study.slug}`,
    title: `${study.name} · Case Study · Iconic Events`,
    description: study.summary,
  })),
]

// /nextsteps is prerendered so a refresh or a bookmark resolves, but kept out
// of the sitemap: it is a post-submission confirmation page, marked noindex in
// the page itself and disallowed in robots.txt.
ROUTES.push({
  path: '/nextsteps',
  title: 'Request confirmed · Iconic Events',
  description:
    'Your request has been received. A director from Iconic Events will be in touch within 48 hours.',
  sitemap: false,
})

const template = fs.readFileSync('dist/index.html', 'utf-8')

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

for (const route of ROUTES) {
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escape(route.description)}" />`
    )
    .replace('</head>', `  <link rel="canonical" href="${SITE}${route.path}" />\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${render(route.path)}</div>`)

  // Write both route/index.html and route.html so the extensionless URL
  // resolves on static servers that prefer either convention.
  const files =
    route.path === '/'
      ? ['dist/index.html']
      : [path.join('dist', route.path, 'index.html'), path.join('dist', `${route.path}.html`)]

  for (const file of files) {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, html)
    console.log(`prerendered ${route.path} -> ${file}`)
  }
}

// A static host serves 404.html for a path with no file, so the branded
// not-found page reaches anyone who mistypes or follows a dead case study
// link. Without it they would get the host's default error page.
fs.writeFileSync(
  'dist/404.html',
  template
    .replace(/<title>[\s\S]*?<\/title>/, '<title>Page not found · Iconic Events</title>')
    .replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>')
    .replace('<div id="root"></div>', `<div id="root">${render('/case-studies/__not-found__')}</div>`)
)
console.log('wrote dist/404.html')

// Sitemap is generated from the same list, so it can never fall behind the
// routes that actually exist.
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...ROUTES.filter((route) => route.sitemap !== false).map(
    (route) => `  <url>\n    <loc>${SITE}${route.path}</loc>\n  </url>`
  ),
  '</urlset>',
  '',
].join('\n')

fs.writeFileSync('dist/sitemap.xml', sitemap)
console.log(
  `wrote dist/sitemap.xml with ${ROUTES.filter((r) => r.sitemap !== false).length} urls`
)
