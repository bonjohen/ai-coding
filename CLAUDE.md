# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static site generator for the AI Coding website. The first (and currently only) content family is **Claude Code Competence** — a five-level maturity framework. The site is data-driven: JSON content files + HTML templates produce static pages at build time. No SPA framework, no runtime rendering.

The architecture is designed so that four additional AI Coding topic families can be added later using the identical pattern.

## Design Specification

The authoritative design document is `docs/claude_code_levels_design.md`. It defines the complete repository layout, data schemas, page inventory, rendering pipeline, and acceptance criteria. **Always consult it before making architectural decisions.**

## Build Commands

```bash
npm run build      # Clean → validate → render → compile → copy assets → write docs/
npm run clean      # Delete generated output in docs/
npm run validate   # Validate JSON data and template refs without full build
npm run dev        # Local static preview server against docs/
npm run watch      # (optional) Rebuild on source file change
```

## Architecture

### Data Flow

```
src/data/**/*.json  →  build/load-data.ts  →  build/validate-data.ts  →  build/render-pages.ts  →  docs/
src/templates/**    →  build/template-engine.ts  ↗
```

### Key Directories

- `build/` — TypeScript build scripts (build-site.ts, load-data.ts, validate-data.ts, render-pages.ts, template-engine.ts, copy-assets.ts)
- `src/data/site/` — Site-wide config JSON (site.json, navigation.json, footer.json, seo.json)
- `src/data/families/claude-code-competence/` — Family content JSON (levels.json, dimensions.json, matrix.json, sources.json, etc.)
- `src/templates/` — HTML templates split into `layouts/`, `partials/`, and `pages/`
- `src/styles/` — CSS with design tokens; family-specific overrides in `families/`
- `src/scripts/` — Small TypeScript enhancement layer (nav toggle, matrix filters, accordions)
- `src/scripts/types/` — TypeScript interfaces matching JSON schemas
- `docs/` — Build output directory (GitHub Pages serves from here)

### Content Model

Content lives entirely in JSON, never hard-coded in templates. Each content family is a directory under `src/data/families/` containing ~10 JSON files that define levels, dimensions, matrix, sources, glossary, etc.

Templates are split into three layers:
- **Layouts** (base.html, article.html, matrix.html, etc.) — page shells with content slots
- **Partials** (head.html, nav.html, level-card.html, etc.) — reusable fragments
- **Pages** (level-detail.html, sources.html, etc.) — page-specific template composition

### CSS Architecture

Modular CSS with no preprocessor. Load order matters:
1. `tokens.css` — Design variables (colors, spacing, typography, breakpoints)
2. `reset.css` → `base.css` → `typography.css` → `layout.css` → `components.css` → `utilities.css`
3. `print.css` — Print-specific rules
4. `families/claude-code-competence.css` — Family accent colors only

### Build Validation

The build **must fail** on: missing required JSON fields, dangling level/dimension/source ID references, nav hrefs pointing to ungenerated pages, duplicate IDs within an entity type, or level order not exactly 1–5.

## URL Structure

Base path is configurable via `site.json:siteBasePath`. Production base: `/ai-coding/`.

```
/ai-coding/                                              — site landing
/ai-coding/claude-code-competence/                       — family landing
/ai-coding/claude-code-competence/overview/              — framework narrative
/ai-coding/claude-code-competence/dimensions/            — evaluation dimensions
/ai-coding/claude-code-competence/matrix/                — competency matrix
/ai-coding/claude-code-competence/levels/{slug}/         — level detail (5 pages)
/ai-coding/claude-code-competence/sources/               — source inventory
/ai-coding/claude-code-competence/author-perspective/    — author synthesis
/ai-coding/claude-code-competence/glossary/              — terms
/ai-coding/claude-code-competence/roadmap/               — learning paths
```

Level slugs: `operator`, `structured-collaborator`, `environment-builder`, `workflow-engineer`, `agentic-systems-expert`

## Adding a New Content Family

1. Create `src/data/families/{family-slug}/` with the same JSON file set as `claude-code-competence`
2. Add family navigation entries to `src/data/site/navigation.json`
3. Optionally add `src/styles/families/{family-slug}.css` for accent overrides
4. The build pipeline auto-discovers families and generates pages using the same templates

## Deployment

GitHub Pages from `docs/` on main branch. Custom domain: `johnboen.com`. CNAME file at repo root.

## Implementation Phases

1. Repository setup, build tooling, template system, CSS structure, TypeScript types
2. JSON content files with real Claude Code Competence content
3. Render all pages and wire navigation
4. JavaScript enhancements, print support, validation improvements
5. Deployment-ready docs/ output

## jcodemunch MCP Integration

This project has a **jcodemunch MCP server** configured for code intelligence.

- **Repo identifier**: `local/claude_code_levels-f0212741` (use this for all `repo` parameters)
- **Index**: Run `index_repo(url: "local/claude_code_levels-f0212741", use_ai_summaries: false)` to index/re-index. Use `incremental: true` (default) after code changes.
- **AI summaries are disabled** (`use_ai_summaries: false`) — do not enable them.

### When to Use jcodemunch vs Built-in Tools

- **Use jcodemunch** for: understanding code structure, finding symbol definitions, exploring unfamiliar parts of the codebase
- **Use built-in Read/Glob/Grep** for: reading specific known files, making edits, simple pattern matching
- **Prefer `search_symbols`** over Grep when looking for function/class/type definitions
- **Prefer `get_file_outline`** before reading a large file to understand its structure first
