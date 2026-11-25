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

## Deployment

This is a static site and can be deployed with GitHub Pages or another static hosting provider. Before deployment, replace the `YOUR-DOMAIN.com` placeholders in the SEO metadata, structured data, `robots.txt`, and `sitemap.xml` with the final public site URL. Also update the social preview image URL to an image that exists in `assets/`.
