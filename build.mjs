import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const SITE_URL = 'https://empathie.ai/';
const root = dirname(fileURLToPath(import.meta.url));

export function renderSite(source, { production = false } = {}) {
  if (typeof source !== 'string' || !/<!doctype html>/i.test(source) || !source.includes('</head>') || !source.includes('</html>')) {
    throw new Error('Expected a complete HTML site template.');
  }
  const robots = production ? 'index,follow' : 'noindex,nofollow';
  let html = source
    .replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+property=["']og:url["'][^>]*>\s*/gi, '')
    .replace(/<!-- Preview release\.[\s\S]*?-->/g, '')
    .replace(/<div class="preview-note">[\s\S]*?<\/div>/g, '')
    .replace("if(location.hostname==='zhenli.design'||location.hostname.endsWith('.github.io'))doc.body.classList.add('is-preview');", '');
  const metadata = `<meta name="robots" content="${robots}">\n<link rel="canonical" href="${SITE_URL}">\n<meta property="og:url" content="${SITE_URL}">\n`;
  return html.replace('</head>', metadata + '</head>');
}

export async function build({ production = process.env.VERCEL_ENV === 'production', directory = root } = {}) {
  const source = await readFile(join(directory, 'site.template.html'), 'utf8');
  const html = renderSite(source, { production });
  const output = join(directory, 'dist');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  const robots = production
    ? `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_URL}</loc></url></urlset>\n`;
  const notFound = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found — Empathie</title><style>body{margin:0;padding:12vh 8vw;background:#f8f8f4;color:#1b1b19;font:18px/1.6 Arial,sans-serif}h1{font-size:clamp(32px,6vw,64px);line-height:1.1;font-weight:400;letter-spacing:-.04em}a{color:inherit}</style></head><body><p>empathie</p><h1>Let's find a better way back.</h1><p>This page doesn't exist.</p><a href="/">Return to Empathie →</a></body></html>`;
  await Promise.all([
    writeFile(join(output, 'index.html'), html),
    writeFile(join(output, 'robots.txt'), robots),
    writeFile(join(output, 'sitemap.xml'), sitemap),
    writeFile(join(output, '404.html'), notFound),
  ]);
  console.log(`Built Empathie for ${production ? 'production' : 'preview'} into dist/. Domain attachment and DNS are separate steps.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  build().catch(error => { console.error(error.message); process.exitCode = 1; });
}
