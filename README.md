# AI Coding Site

A static site generator for AI-assisted development competence frameworks. The first published family is **Claude Code Competence** — a five-level maturity framework.

## Build Commands

```bash
npm install          # Install dependencies
npm run build        # Clean, validate, render pages, compile JS, copy assets → docs/
npm run clean        # Delete generated output
npm run validate     # Validate JSON data without full build
npm run dev          # Serve docs/ locally on port 3000
```

## Repository Layout

```
build/               TypeScript build scripts (load, validate, render, copy)
src/
  data/
    site/            Site-wide config (site.json, navigation.json, footer.json, seo.json)
    families/
      claude-code-competence/   Family content (levels, dimensions, matrix, sources, etc.)
  templates/
    layouts/         Page shells (base, article, matrix, landing, etc.)
    partials/        Reusable fragments (head, nav, footer, breadcrumbs, etc.)
    pages/           Page-specific templates
  styles/            CSS with design tokens (tokens.css → reset → base → components)
  scripts/           Browser TypeScript (nav toggle, matrix filters, accordions)
  assets/            Static files (icons, images, social)
docs/                Build output (GitHub Pages serves from here)
```

## Content Files

All content lives in JSON under `src/data/`. Templates never contain hard-coded content.

| File | Purpose |
|---|---|
| `site/site.json` | Site identity, base path, domain |
| `site/navigation.json` | Primary nav + per-family nav |
| `site/footer.json` | Footer sections and legal text |
| `site/seo.json` | Default SEO metadata |
| `families/*/family.json` | Family identity and metadata |
| `families/*/levels.json` | All 5 level definitions |
| `families/*/dimensions.json` | 7 evaluation dimensions |
| `families/*/matrix.json` | 7×5 competency matrix |
| `families/*/sources.json` | Source inventory by group |
| `families/*/author-notes.json` | Author's personal synthesis |
| `families/*/glossary.json` | Term definitions |
| `families/*/roadmap.json` | Learning stages and future plans |
| `families/*/exercises.json` | Exercise library |
| `families/*/overview.json` | Narrative overview |

## Deployment

The build outputs static HTML to `docs/`. Deploy via GitHub Pages from `docs/` on the main branch.

- Custom domain: configured via `CNAME` (johnboen.com)
- Base path: configurable in `site.json` → `siteBasePath` (default: `/ai-coding/`)

To switch between GitHub Pages project hosting and a custom domain, change `siteBasePath` and `siteUrl` in `src/data/site/site.json`, then rebuild.

## Adding a New Content Family

1. Create `src/data/families/{family-slug}/` with the same JSON files as `claude-code-competence/`
2. Add the family to `src/data/site/navigation.json` (both `primaryNav` and `familyNav`)
3. Optionally add `src/styles/families/{family-slug}.css` for accent color overrides
4. Run `npm run build` — the pipeline auto-discovers families

## Adding a New Level or Source

- **Level**: Add an entry to `levels.json` with a unique `id`, `slug`, and sequential `levelNumber`. Update `previousLevelId`/`nextLevelId` on adjacent levels. The build validates level order is exactly 1–5.
- **Source**: Add an entry to `sources.json` → `sources` array with a valid `groupId`. Reference its `id` in level `citationIds` where relevant.

## Validation

The build fails on:
- Missing required JSON fields
- Dangling ID references (level, dimension, source, citation)
- Nav hrefs pointing to ungenerated pages
- Duplicate IDs within an entity type
- Level order not exactly 1–5
