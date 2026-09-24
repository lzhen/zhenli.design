import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { renderSite, build, SITE_URL } from './build.mjs';

const fixture = '<!doctype html><html lang="en"><head><meta name="robots" content="noindex,follow"><title>Empathie</title></head><body><div class="preview-note">Preview</div><main id="product">DLS Magician</main><a href="https://zhenli.design/">Founder</a></body></html>';

test('production metadata uses the Empathie domain', () => {
  const html = renderSite(fixture, { production: true });
  assert.ok(html.includes('<meta name="robots" content="index,follow">'));
  assert.ok(html.includes(`<link rel="canonical" href="${SITE_URL}">`));
  assert.ok(html.includes(`<meta property="og:url" content="${SITE_URL}">`));
});
test('preview builds remain noindex', () => {
  assert.ok(renderSite(fixture).includes('content="noindex,nofollow"'));
});
test('removes preview banner without removing product content or founder link', () => {
  const html = renderSite(fixture);
  assert.ok(!html.includes('class="preview-note"'));
  assert.ok(html.includes('<main id="product">DLS Magician</main>'));
  assert.ok(html.includes('href="https://zhenli.design/"'));
});
test('metadata transformation is idempotent', () => {
  const first = renderSite(fixture, { production: true });
  assert.equal(renderSite(first, { production: true }), first);
});
test('rejects incomplete source', () => {
  assert.throws(() => renderSite('<html>broken'), /complete HTML/);
});
test('build emits only four public files and no source or configuration', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'empathie-build-'));
  try {
    await writeFile(join(directory, 'site.template.html'), fixture);
    await build({ production: true, directory });
    assert.deepEqual((await readdir(join(directory, 'dist'))).sort(), ['404.html', 'index.html', 'robots.txt', 'sitemap.xml']);
    assert.ok((await readFile(join(directory, 'dist/robots.txt'), 'utf8')).includes('Allow: /'));
    await build({ production: false, directory });
    assert.equal(await readFile(join(directory, 'dist/robots.txt'), 'utf8'), 'User-agent: *\nDisallow: /\n');
  } finally { await rm(directory, { recursive: true, force: true }); }
});
