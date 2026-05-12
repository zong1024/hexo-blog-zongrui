# Hexo Blog

This repository is ready for both GitHub Pages and Vercel deployments.

## Local development

```bash
npm install
npm run server
```

## Build

```bash
npm run build
```

The build script supports runtime overrides:

- `SITE_URL` sets the final site URL.
- `SITE_ROOT` sets the root path.

GitHub Pages injects both values automatically in Actions.
Vercel uses `VERCEL_PROJECT_PRODUCTION_URL` or `VERCEL_URL` when available.

## GitHub Pages

Push this repository to GitHub, then enable Pages with:

- Source: `GitHub Actions`

The workflow in [`.github/workflows/pages.yml`](.github/workflows/pages.yml) will publish the `public` folder.

## Vercel

Import this repository into Vercel, or deploy it from the local checkout.

`vercel.json` tells Vercel to:

- run `npm run build`
- publish the `public` directory
