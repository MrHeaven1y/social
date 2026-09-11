# Project state

## Purpose

`MrHeaven1y.social` is the single dependency-free social hub for Dibyendu Mukherjee's public work and publishing. The former Field Notes site is consolidated into the LinkedIn category here — one content source, one build, one deploy.

The repository is independent from the portfolio and deploys at `https://mrheaven1y.github.io/mrheaven1y.social.io/`. Canonical LinkedIn notes now live here as the LinkedIn / Field Notes category.

## Branch map

- Portfolio: `https://mrheaven1y.github.io/`
- Social hub: `https://mrheaven1y.github.io/mrheaven1y.social.io/`
- LinkedIn / Field Notes: `https://mrheaven1y.github.io/mrheaven1y.social.io/linkedin/`
- LinkedIn profile: `https://www.linkedin.com/in/dibayendu-mukherjee-bb897b267`
- X / Twitter: reserved for a future public profile
- Medium: reserved for future publishing

## Folder structure

| Path | Role |
|------|------|
| `content/linkedin/*.md` | Source frontmatter |
| `assets/linkedin/[slug]/` | Post assets (article.html, PDF, TeX, images) |
| `assets/*.css`, `assets/*.js` | Site styles and scripts |
| `index.html` | Home page with platform cards |
| `portfolio/`, `medium/`, `x/` | Static branch pages |
| `scripts/build-social.mjs` | Build generator |
| `linkedin/`, `tags/`, `page/` | Generated routes (gitignored) |
| `index.json`, `sitemap.xml`, `feed.xml` | Generated feeds (gitignored) |

## Contact policy

- Public direct contact is `dibyendumukherjee916@gmail.com`.
- No phone number is published.
- Telegram is the direct messaging route at `https://t.me/dibayendu_mukherjee`. No Telegram channel is published.

## Deployment

`.github/workflows/deploy.yml` validates, builds, and deploys the repository root through GitHub Pages on pushes to `main`.

The home page uses dual-hit platform cards: the card body opens a local route while the small external-link control opens the real platform. LinkedIn and Field Notes are one category at `/linkedin/`; content is sourced from `content/linkedin/` with assets in `assets/linkedin/`.

## Continuation rules

1. Keep the branch map numbered and extend it when new channels become active.
2. Preserve the existing visual language: paper, espresso, copper, editorial typography, and restrained spacing.
3. Keep future social links disabled/reserved until their real public URLs are provided.
4. Update this file when a branch, contact route, or deployment convention changes.
