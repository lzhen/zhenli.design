# Empathie company website

Standalone deployment source for https://empathie.ai/.

## Status — September 24, 2026

Prepared for deployment, not yet verified live on empathie.ai. Vercel project creation, custom-domain attachment, DNS configuration, and HTTPS checks still need to be completed. No registrar records or existing production domains were changed.

This branch intentionally contains only Empathie's website and its build files. The original personal portfolio remains on the repository's `main` branch. Do not change that branch's CNAME, Pages settings, or production domain.

## Deploy as a separate project

Use the Vercel setup link below to copy this source into a new repository and create a separate project. Review account and plan terms before confirming any paid service.

[Set up Empathie on Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flzhen%2Fzhenli.design%2Ftree%2Fempathie-production&project-name=empathie&repository-name=empathie-website)

Suggested project name: `empathie`. Suggested new repository name: `empathie-website`. Framework: Other. Root Directory: repository root. The checked-in vercel.json supplies the build command and output directory; no environment secrets or third-party packages are needed.

After the separate deployment succeeds, open that project's Settings > Domains and add `empathie.ai`. Add `www.empathie.ai` if desired and redirect it to `empathie.ai`. Copy the exact domain-specific DNS records shown by Vercel to the current authoritative DNS provider. The domain was purchased through GoDaddy, but verify the nameservers before editing DNS. Do not change nameservers merely for this deployment, and preserve mail records and `dlsmagician.empathie.ai`.

Verify the HTTPS homepage, mobile layout, scenario selector, tabs, local form feedback, contact link, robots.txt, and sitemap.xml before removing the original preview. Test both domain variants if www is added. The current preview remains a fallback; it has not been redirected or removed.

## Build locally

Node.js 22, no dependency installation required:

```sh
npm test
VERCEL_ENV=production npm run build
```

Only `dist/` should be published. The build preserves the existing website design and illustrative local demo, removes the preview-only banner, adds empathie.ai canonical metadata, and generates robots.txt, sitemap.xml, and a 404 page. Production builds are indexable; other builds are noindex. No live AI, authentication, or customer-data collection is added.

## Verification scope

Six build-transformation and output tests passed locally using fixtures. This is not a claim of a completed Vercel build, browser UI verification, DNS resolution, or production deployment.

## Source

Original website blob: `a4876353c223cf70e63142bee727585aed63b869`, from `main/empathie/index.html`. Its contents are reused unchanged as `site.template.html`.

## Official setup documentation

- https://vercel.com/docs/deploy-button/source
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://vercel.com/docs/domains/set-up-custom-domain
