// Renders each route to static HTML after `vite build` so crawlers get real
// content on first request. React hydrates over it in the browser.
import fs from 'node:fs'
import path from 'node:path'
import { render } from './dist-ssr/entry-server.js'

const SITE = 'https://www.iconic.events'
const ROUTES = ['/', '/case-studies/casino-royale']

const template = fs.readFileSync('dist/index.html', 'utf-8')

for (const route of ROUTES) {
  const html = template
    .replace('</head>', `  <link rel="canonical" href="${SITE}${route}" />\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`)
  // Write both route/index.html and route.html so the extensionless URL
  // resolves on static servers that prefer either convention.
  const files = route === '/'
    ? ['dist/index.html']
    : [path.join('dist', route, 'index.html'), path.join('dist', `${route}.html`)]
  for (const file of files) {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, html)
    console.log(`prerendered ${route} -> ${file}`)
  }
}
