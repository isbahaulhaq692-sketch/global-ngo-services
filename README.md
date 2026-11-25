# Global NGO Services

A responsive static website for Global NGO Services, an NGO consultancy supporting registration, compliance, reporting, and digital services.

## Features

- Responsive homepage with service search, category filters, and service details
- Contact links for phone, email, WhatsApp, and Instagram
- Enquiry form submitted through Web3Forms, with a manual WhatsApp fallback if the service is unavailable
- English and Hindi interface text
- How We Work section, FAQs, testimonials/review form, Privacy Policy, and Terms
- SEO metadata, social-sharing tags, and Organization/Service structured data

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Inline and local SVG assets
- Web3Forms for enquiry delivery

## Run locally

From the project root, start Python's static file server:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Enquiry form

The contact form uses a Web3Forms client-side access key configured in `js/main.js`. Web3Forms access keys are intended for public client-side use. Do not add passwords, private API tokens, or other secrets to frontend files.

## Deploy on Vercel

This is a static site with no build or install step. Use the repository root as the project root and configure:

- Framework Preset: **Other**
- Build Command: blank
- Install Command: blank
- Output Directory: `.`

`vercel.json` configures `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` response headers. A Content Security Policy is intentionally not set because the site currently uses inline scripts and third-party form, font, and image services.

Vercel Web Analytics and Speed Insights are intentionally deferred. Their official plain-HTML setup uses project-specific script paths, so add the Vercel-provided scripts later when those paths are available; do not guess them. These integrations are not required to deploy the static site.

The current canonical site domain is `https://global-ngo-services.vercel.app`. If a custom domain is connected later, update the canonical URLs, Open Graph URLs and images, Organization structured-data URLs, `robots.txt`, and `sitemap.xml` to match it. The social-preview metadata uses `assets/og-image.jpg`.

After deployment, submit `https://global-ngo-services.vercel.app/sitemap.xml` in Google Search Console. Replace the URL if a custom domain becomes the canonical domain.
