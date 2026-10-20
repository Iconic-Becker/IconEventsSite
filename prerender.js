// Renders each route to static HTML after `vite build` so crawlers get real
// content on first request. React hydrates over it in the browser.
//
// Routes and the sitemap are both derived from CASE_STUDIES, so adding an
// event to src/case-studies.js is enough: its page is prerendered and listed
// without touching this file.
import fs from 'node:fs'
import path from 'node:path'
import { render, preloadRoute } from './dist-ssr/entry-server.js'
import { CASE_STUDIES } from './src/case-studies.js'
import { PRIVACY, TERMS } from './src/legal.js'

const SITE = 'https://www.iconic.events'

// Per route metadata, so the static HTML a crawler receives carries the right
// title and description rather than the homepage's.
const ROUTES = [
  {
    path: '/',
    title: 'Event Production in South Florida | Iconic Events',
    description:
      'Iconic Events is a full-service event production company crafting corporate & experiential events across South Florida. Get a free quote today.',
    image: '/og/default.jpg',
  },
  {
    path: '/case-studies',
    title: 'Case Studies | Iconic Events',
    description:
      'Every room Iconic Events has engineered: events for founders, agencies and creators across the US, UK, Spain and the UAE.',
    image: '/og/case-studies.jpg',
  },
  ...CASE_STUDIES.map((study) => ({
    path: `/case-studies/${study.slug}`,
    title: `${study.name} · Case Study · Iconic Events`,
    description: study.summary,
    image: `/og/${study.slug}.jpg`,
  })),
]

// /nextsteps is prerendered so a refresh or a bookmark resolves, but kept out
// of the sitemap: it is a post-submission confirmation page, marked noindex in
// the page itself and disallowed in robots.txt.
// The contact form as its own page, for linking to directly from anywhere
// that is not the homepage.
ROUTES.push({
  path: '/contact',
  title: 'Contact | Iconic Events',
  description:
    'Tell Iconic Events about the room you want to build. Event production, stage design and experience architecture for live in person events.',
  image: '/og/default.jpg',
})

// The privacy policy and terms. Indexed: ad platforms and visitors look for
// them, and Meta checks the privacy policy URL on lead forms.
for (const doc of [PRIVACY, TERMS]) {
  ROUTES.push({ path: doc.path, title: `${doc.title} | Iconic Events`, description: doc.description, image: '/og/default.jpg' })
}

// Every case study photograph on one page, each linked to its event.
ROUTES.push({
  path: '/gallery',
  title: 'Gallery | Iconic Events',
  description:
    'Photographs from the rooms Iconic Events has produced. Stage, light, detail and audience, each linked to its case study.',
  image: '/og/default.jpg',
})

// The vendor sign-up. Indexed: vendors searching for production companies to
// work with should be able to find it.
ROUTES.push({
  path: '/vendors',
  title: 'Vendor sign-up | Iconic Events',
  description:
    'Join the vendor list at Iconic Events. We work with audio visual, lighting, staging, catering, photography and production partners across South Florida and beyond.',
  image: '/og/default.jpg',
})

ROUTES.push({
  path: '/nextsteps',
  title: 'Request confirmed · Iconic Events',
  description:
    'Your request has been received. A director from Iconic Events will be in touch within 48 hours.',
  image: '/og/default.jpg',
  sitemap: false,
})


const template = fs.readFileSync('dist/index.html', 'utf-8')

// A page split into its own chunk (see src/lib/split-page.jsx) has to be
// fetched before the browser can hydrate it. Naming the chunk in that page's
// head lets the browser fetch it alongside the main bundle rather than after.
const chunk = (name) => fs.readdirSync('dist/assets').find((f) => f.startsWith(`${name}-`) && f.endsWith('.js'))
const SPLIT_CHUNKS = { '/gallery': chunk('GalleryPage') }

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Without these, a link shared to Slack, WhatsApp or LinkedIn renders as a
// bare URL: no image, no title, no description.
function socialTags(route) {
  const url = `${SITE}${route.path}`
  const image = `${SITE}${route.image ?? '/og/default.jpg'}`
  return [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Iconic Events" />`,
    `<meta property="og:title" content="${escape(route.title)}" />`,
    `<meta property="og:description" content="${escape(route.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escape(route.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(route.title)}" />`,
    `<meta name="twitter:description" content="${escape(route.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].map((tag) => `  ${tag}`).join('\n')
}

for (const route of ROUTES) {
  // A split page's code has to be loaded before it can render to a string.
  await preloadRoute(route.path)
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escape(route.description)}" />`
    )
    .replace(
      '</head>',
      `  <link rel="canonical" href="${SITE}${route.path}" />\n${
        SPLIT_CHUNKS[route.path] ? `  <link rel="modulepreload" crossorigin href="/assets/${SPLIT_CHUNKS[route.path]}" />\n` : ''
      }${socialTags(route)}\n${
        route.sitemap === false ? '  <meta name="robots" content="noindex, nofollow" />\n' : ''
      }  </head>`
    )
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
