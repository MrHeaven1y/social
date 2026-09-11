# Social Hub Handoff

This document is the authoritative continuation context for the `MrHeaven1y/social` repository. Read it before changing the site.

## Current status

- Repository: `https://github.com/MrHeaven1y/social`
- Local path: `C:\Users\Heavenly\Desktop\Git\github.com\MrHeaven1y\MrHeaven1y.social`
- Branch: `main`
- Working tree: clean at the time this document was written
- Canonical social URL: `https://mrheaven1y.github.io/social/`
- Canonical portfolio URL: `https://mrheaven1y.github.io/`
- Latest commit: `5ef2738` - Polish LinkedIn search and scrollbar
- Latest deployment: [GitHub Actions run 14](https://github.com/MrHeaven1y/social/actions/runs/34577139992)
- Latest deployment result: successful
- Last validation result: 9 LinkedIn posts, 7 topics, 2 archive pages

The social site is independent from the portfolio repository. The portfolio repository is located at:

`C:\Users\Heavenly\Desktop\Git\github.com\MrHeaven1y\MrHeaven1y.github.io`

Do not treat the similarly named local folder below as the active repository:

`C:\Users\Heavenly\Desktop\Git\github.com\MrHeaven1y\MrHeaven1y.social.io`

That folder is an old, non-Git duplicate with stale build files and an old custom-domain configuration. It is not used by deployment and must not be edited as the source of truth. Do not delete it without explicit user approval.

## Public routes

| URL | Purpose |
|---|---|
| `https://mrheaven1y.github.io/social/` | Social hub homepage |
| `https://mrheaven1y.github.io/social/linkedin/` | LinkedIn archive, search, and topic sections |
| `https://mrheaven1y.github.io/social/tags/<topic>/` | One generated topic archive |
| `https://mrheaven1y.github.io/social/page/<number>/` | One generated paginated archive |
| `https://mrheaven1y.github.io/social/linkedin/<slug>/` | One generated LinkedIn post |
| `https://mrheaven1y.github.io/social/portfolio/` | Social-site branch page pointing to the portfolio |
| `https://mrheaven1y.github.io/social/medium/` | Reserved Medium branch page |
| `https://mrheaven1y.github.io/social/x/` | Reserved X/Twitter branch page |
| `https://mrheaven1y.github.io/` | Independent portfolio site |

## Complete repository structure

```text
MrHeaven1y.social/
|
|-- .github/
|   `-- workflows/
|       `-- deploy.yml              GitHub Pages build, validation, and deployment
|
|-- assets/
|   |-- site.css                    Global layout, palette, typography, scrollbar
|   |-- content.css                 Platform cards, archive cards, search field
|   |-- app.js                      External-link accessibility enhancement
|   |-- search.js                   Client-side LinkedIn archive filtering
|   `-- linkedin/
|       |-- <slug>/
|           |-- article.html        Original article body/source fragment
|           |-- post.pdf            Downloadable post PDF
|           |-- source.tex          TeX source
|           `-- <optional images>   Diagrams used by the article
|
|-- content/
|   `-- linkedin/
|       `-- <slug>.md               Frontmatter-only source metadata
|
|-- scripts/
|   |-- build-social.mjs            Generates all ignored routes and feeds
|   `-- validate-social.mjs         Verifies required files and post assets
|
|-- index.html                      Homepage and platform-card source
|-- portfolio/index.html            Portfolio branch landing page
|-- medium/index.html               Reserved Medium branch landing page
|-- x/index.html                    Reserved X/Twitter branch landing page
|
|-- linkedin/                       Generated archive and post routes (ignored)
|-- tags/                           Generated topic routes (ignored)
|-- page/                           Generated pagination routes (ignored)
|-- index.json                      Generated client/search index (ignored)
|-- sitemap.xml                     Generated sitemap (ignored)
|-- feed.xml                        Generated RSS feed (ignored)
|
|-- .gitignore                      Ignores generated output and dist
|-- .nojekyll                       Prevents Jekyll processing on Pages
|-- package.json                    Dependency-free npm scripts
|-- README.md                       Short project overview
|-- PROJECT_STATE.md                Project state and continuation rules
|-- HANDOFF.md                      This detailed next-agent context
`-- LICENSE
```

The local working tree may also contain an ignored `branches/` directory. It is not part of the tracked build or deployment pipeline.

## Source content model

Each file in `content/linkedin/` contains YAML-like frontmatter only. The supported fields are:

```yaml
title: "Distributed Training"
platform: linkedin
topics: [systems, ml-engineering]
date: 2026-09-10
summary: "Short archive-card description."
handnote: "Handwritten-style one-line takeaway."
url: "https://www.linkedin.com/in/dibayendu-mukherjee-bb897b267"
format: "Slide essay"
read: "9 min read"
accent: "#b17645"
```

The Markdown body is not used as the article body. The matching asset directory in `assets/linkedin/<slug>/` owns the original HTML article and downloadable files.

Current source posts:

1. `distributed-training`
2. `gru-gated-memory`
3. `llm-provider-boundaries`
4. `lstm-to-transformers`
5. `notebook-production-parity`
6. `self-attention`
7. `semantic-watermarking`
8. `validation-beyond-metrics`
9. `vanilla-autoencoders`

## Build and deployment flow

Run from the social repository root:

```powershell
npm run build
npm run validate
npm run check
```

`npm run check` is the normal validation command. It:

1. Runs `scripts/build-social.mjs`.
2. Reads all `content/linkedin/*.md` files.
3. Generates `/linkedin/`, `/tags/`, `/page/`, `index.json`, `sitemap.xml`, and `feed.xml`.
4. Patches the homepage LinkedIn card with live post/topic counts and the latest handnote.
5. Runs `scripts/validate-social.mjs`.
6. Confirms every generated post has its HTML, PDF, TeX, and referenced route.

Generated output is intentionally ignored. Do not commit generated route folders unless the deployment architecture is deliberately changed.

`.github/workflows/deploy.yml` runs on pushes to `main` and manual dispatch. It validates first, rebuilds in the deploy job, copies the site into `dist/`, uploads a GitHub Pages artifact, and deploys it. The workflow copies:

```text
.nojekyll index.html index.json sitemap.xml feed.xml
assets linkedin tags page portfolio medium x
```

## Current visual and interaction behavior

The visual system is intentionally editorial and should remain consistent:

- Paper background: `--paper`
- Ink/black: `--ink`
- Copper accent: `--copper`
- Espresso dark surface: `--espresso`
- Latte secondary accent: `--latte`
- Display font: DM Serif Display
- UI/body font: DM Sans
- Metadata/search font: DM Mono
- Handwritten notes: Caveat or fallback cursive

Homepage platform cards:

- Portfolio is live and uses the original copper-only title treatment.
- LinkedIn is the featured live card. Its card body opens the local archive and its small `in` mark opens the LinkedIn profile.
- Medium is reserved and uses a small `M` mark.
- X/Twitter is reserved and uses a small `X` mark.
- Portfolio uses a small `P` mark.
- The old arrow-only platform controls were replaced with these compact marks.
- The diagonal two-tone title effect is applied only to LinkedIn, Medium, and X/Twitter. It uses black first, then copper, with a balanced `/` diagonal boundary.
- The header no longer contains a separate LinkedIn navigation item. It keeps Platforms, Contact, and Portfolio.

LinkedIn archive:

- Search is a real full-width composed field with a copper left accent, search icon, focus state, placeholder styling, native clear button, and Escape-to-clear behavior.
- Search is client-side in `assets/search.js`; it filters `.content-card` elements using their `data-search` values.
- Topic links are generated from the `topics` frontmatter values.
- Current topics: Architecture, Computer Vision, Deep Learning, Foundations, ML Engineering, NLP, Systems.
- The generated archive and topic-page headers contain only a Platforms navigation link plus the Telegram message action.

Scrollbar:

- `assets/site.css` defines a thin native fallback with `scrollbar-color` and `scrollbar-width`.
- Chromium/WebKit receives a rounded pill thumb with a copper/latte/espresso gradient, blended track, paper border, and hover transition.
- Keep the scrollbar usable; do not set `display:none` or remove the native scroll affordance.

## Important implementation details

- `scripts/build-social.mjs` owns generated wording and route markup. If archive labels, header navigation, topic titles, or post-page links change, update the generator rather than only editing generated HTML.
- The homepage LinkedIn card is protected by:

```html
<!-- build:linkedin-card -->
...
<!-- /build:linkedin-card -->
```

- `scripts/build-social.mjs` replaces the content between those markers.
- The canonical site URL in the generator is `https://mrheaven1y.github.io/social/`.
- Topic acronym casing is handled by the `ACRONYMS` set in the generator (`NLP`, `ML`, `AI`, `CV`, `GRU`, `LSTM`, `LLM`, `KV`).
- External links use the real LinkedIn profile, Telegram, GitHub, and portfolio URLs already present in the source.
- Do not reintroduce “Field Notes” or “LinkedIn notes” as a visible platform label. The user requested the visible platform name to be “LinkedIn.”

## Contact and external links

- Email: `mailto:dibyendumukherjee916@gmail.com`
- Telegram: `https://t.me/dibayendu_mukherjee`
- LinkedIn: `https://www.linkedin.com/in/dibayendu-mukherjee-bb897b267`
- GitHub: `https://github.com/MrHeaven1y`
- Portfolio: `https://mrheaven1y.github.io/`
- Social: `https://mrheaven1y.github.io/social/`

## Known repository boundaries

- The social repository owns the static social hub only.
- The portfolio repository owns the root portfolio application and has its own build/deploy workflow.
- Do not edit the portfolio repository when a request is only about the social hub.
- The portfolio repository has an unrelated pre-existing uncommitted change in `src/app/globals.css`; do not revert or overwrite it without explicit approval.
- Do not delete `MrHeaven1y.social.io` without explicit confirmation.

## Safe continuation checklist

Before changing code:

1. Confirm the current directory is `MrHeaven1y.social`, not `MrHeaven1y.social.io`.
2. Run `git status --short --branch`.
3. Read this file and `PROJECT_STATE.md`.
4. Preserve the source/output split.
5. Update `scripts/build-social.mjs` for any generated-page behavior.
6. Run `npm run check`.
7. Preview the relevant local or deployed route.
8. Review `git diff`.
9. Commit only the intended files and push `main`.
10. Verify the corresponding GitHub Actions run and the live URL.

