# Release Plan: AI Coding Site — Claude Code Competence

Phased implementation plan derived from `docs/claude_code_levels_design.md`.

---

## Phase 1 — Repository Scaffolding & Build Tooling

Goal: A working build pipeline that can load data, validate it, render a minimal template, and write output to `docs/`.

### 1.1 Project initialization
- [ ] Create `package.json` with project metadata and npm scripts (`build`, `clean`, `validate`, `dev`, `watch`)
- [ ] Create `tsconfig.json` (target ES2020+, strict mode, Node module resolution for build scripts)
- [ ] Create `.gitignore` (node_modules, docs/ generated output, OS files)
- [ ] Create `CNAME` with domain value
- [ ] Install dependencies: `typescript`, `ts-node` or `tsx`, a local static server (e.g., `serve` or `http-server`)

### 1.2 TypeScript type definitions
- [ ] `src/scripts/types/site.ts` — SiteConfig, SeoConfig interfaces
- [ ] `src/scripts/types/navigation.ts` — NavigationItem, FamilyNavGroup interfaces
- [ ] `src/scripts/types/family.ts` — FamilyMeta interface
- [ ] `src/scripts/types/level.ts` — Level, ConceptRecord, SkillRecord, TaskRecord interfaces
- [ ] `src/scripts/types/dimension.ts` — Dimension interface
- [ ] `src/scripts/types/matrix.ts` — MatrixRow, MatrixCell interfaces
- [ ] `src/scripts/types/source.ts` — SourceGroup, SourceRecord interfaces
- [ ] `src/scripts/types/glossary.ts` — GlossaryTerm interface
- [ ] `src/scripts/types/exercise.ts` — Exercise interface
- [ ] `src/scripts/types/roadmap.ts` — RoadmapStage, FutureExpansion interfaces

### 1.3 Build scripts
- [ ] `build/load-data.ts` — Read and parse all JSON from `src/data/site/` and `src/data/families/`
- [ ] `build/validate-data.ts` — Validate required fields, cross-reference IDs (level, dimension, source, citation), check level order 1–5, detect duplicates, fail on broken nav hrefs
- [ ] `build/template-engine.ts` — Minimal template renderer (slot replacement, partials, loops, conditionals)
- [ ] `build/render-pages.ts` — Build normalized page model, render each page through layout + page template + partials
- [ ] `build/copy-assets.ts` — Copy CSS to `docs/assets/css/`, compile TS to `docs/assets/js/`, copy images/icons
- [ ] `build/build-site.ts` — Orchestrator: clean → load → validate → render → copy → report

### 1.4 CSS structure (empty shells with design tokens)
- [ ] `src/styles/tokens.css` — Color, spacing, typography, width, radius, shadow, breakpoint variables
- [ ] `src/styles/reset.css` — Basic reset
- [ ] `src/styles/base.css` — Global element styles
- [ ] `src/styles/typography.css` — Headings, paragraphs, lists, links, blockquotes, tables
- [ ] `src/styles/layout.css` — Containers, grids, responsive breakpoints
- [ ] `src/styles/components.css` — Cards, nav, breadcrumbs, matrix, source blocks, level ladder
- [ ] `src/styles/utilities.css` — Utility classes
- [ ] `src/styles/print.css` — Print rules (hide nav chrome, expand collapsed content, prevent matrix overflow)
- [ ] `src/styles/families/claude-code-competence.css` — Family accent colors only

### 1.5 Template shells
- [ ] `src/templates/layouts/base.html` — Global shell (head, header, nav, footer, content slot)
- [ ] `src/templates/partials/head.html` — SEO meta, stylesheet links
- [ ] `src/templates/partials/header.html` — Site header and brand
- [ ] `src/templates/partials/nav.html` — Primary nav + family nav
- [ ] `src/templates/partials/footer.html` — Footer rendering
- [ ] `src/templates/partials/breadcrumbs.html` — Family page breadcrumbs

### 1.6 Verify end-to-end
- [ ] Create a minimal `src/data/site/site.json` stub
- [ ] Run `npm run build` and confirm it produces `docs/index.html` (even if mostly empty)
- [ ] Run `npm run validate` and confirm it reports success on valid stub data

**Phase 1 exit criteria:** `npm run build` executes without error, writes output to `docs/`, and `npm run validate` catches a deliberately broken JSON field.

---

## Phase 2 — JSON Content Seeding

Goal: All 14 data files populated with real Claude Code Competence content.

### 2.1 Site-level data
- [ ] `src/data/site/site.json` — siteId, siteTitle, siteBasePath `/ai-coding/`, siteUrl, authorName, repositoryUrl, customDomain `johnboen.com`, copyrightText
- [ ] `src/data/site/navigation.json` — primaryNav (Home, Claude Code Competence) + familyNav (Overview, Dimensions, Matrix, Levels ×5, Sources, Author Perspective, Glossary, Roadmap)
- [ ] `src/data/site/footer.json` — Footer sections and legal text
- [ ] `src/data/site/seo.json` — Default title, description, OG image path, keywords

### 2.2 Family metadata
- [ ] `src/data/families/claude-code-competence/family.json` — familyId, slug, title, version, publishDate, themeKey, rootPath, landingPath

### 2.3 Core content files (real content, not placeholder)
- [ ] `src/data/families/claude-code-competence/levels.json` — All 5 levels with: definition, coreConcepts (3–5 each), coreSkills (3–5 each), observableBehaviors, failureModes, graduationCriteria, evaluationTasks, learningEmphasis, relatedDimensionIds, citationIds, prev/next links
- [ ] `src/data/families/claude-code-competence/dimensions.json` — 7 dimensions: conceptual understanding, task framing, verification discipline, context management, environment design, workflow scaling, safety & governance. Each with definition, whyItMatters, assessmentQuestions
- [ ] `src/data/families/claude-code-competence/matrix.json` — 7 rows × 5 cells (dimension × level), each cell with summary + detail
- [ ] `src/data/families/claude-code-competence/overview.json` — heroTitle, heroSummary, purpose, whatThisIs, howToUseThisFramework, levelSummaries
- [ ] `src/data/families/claude-code-competence/sources.json` — sourceGroups (Official Anthropic, Practitioner, Interviews/Talks, Synthesis Notes) + source records with title, author, publisher, url, relevance
- [ ] `src/data/families/claude-code-competence/author-notes.json` — Author's view of competence, mid-Level 4 self-assessment, AI infrastructure / data infrastructure parallel, partial Level 5 readiness
- [ ] `src/data/families/claude-code-competence/glossary.json` — Terms: agent, hook, skill, MCP, verification loop, context window, non-interactive mode, subagent, governance, review automation, etc.
- [ ] `src/data/families/claude-code-competence/roadmap.json` — Learning stages with recommendedLevelIds, suggestedActivities, futureExpansions
- [ ] `src/data/families/claude-code-competence/exercises.json` — Exercise library (can be minimal for v1)

### 2.4 Validate seeded content
- [ ] Run `npm run validate` — all required fields present, all cross-references resolve, no duplicate IDs, level order 1–5

**Phase 2 exit criteria:** `npm run validate` passes on all 14 data files with real content. No placeholder text in Claude Code Competence content.

---

## Phase 3 — Page Rendering & Navigation

Goal: All 14+ required pages generated and navigable.

### 3.1 Remaining templates

Layouts:
- [ ] `src/templates/layouts/landing.html` — AI Coding home page layout
- [ ] `src/templates/layouts/family-home.html` — Family landing layout
- [ ] `src/templates/layouts/article.html` — Used by overview, dimensions, author perspective, glossary, roadmap
- [ ] `src/templates/layouts/matrix.html` — Matrix page layout
- [ ] `src/templates/layouts/source-list.html` — Sources page layout

Page templates:
- [ ] `src/templates/pages/home.html` — Landing page with family intro + placeholders for 4 future families
- [ ] `src/templates/pages/family-overview.html` — Family landing content
- [ ] `src/templates/pages/level-detail.html` — Level page (all 14 sections)
- [ ] `src/templates/pages/dimensions.html` — Dimension definitions
- [ ] `src/templates/pages/matrix.html` — Competency matrix rendering
- [ ] `src/templates/pages/sources.html` — Grouped source inventory
- [ ] `src/templates/pages/author-perspective.html` — Author synthesis
- [ ] `src/templates/pages/glossary.html` — Term definitions
- [ ] `src/templates/pages/roadmap.html` — Learning progression

Remaining partials:
- [ ] `src/templates/partials/level-card.html` — Compact level card for ladder views
- [ ] `src/templates/partials/matrix-table.html` — Matrix row/cell rendering
- [ ] `src/templates/partials/source-card.html` — Source entry rendering
- [ ] `src/templates/partials/citation-list.html` — Citation links for pages/sections
- [ ] `src/templates/partials/quote-block.html` — Quotation block

### 3.2 Page generation wiring
- [ ] Wire `render-pages.ts` to generate all 14 required output pages at correct paths under `docs/`
- [ ] Each page gets unique SEO title, meta description, canonical URL, OG tags (from page model or site/family defaults)
- [ ] Breadcrumbs rendered on all family pages
- [ ] Previous/next level links rendered on level pages
- [ ] Navigation highlights active page

### 3.3 Output verification
- [ ] `docs/ai-coding/index.html` exists
- [ ] `docs/ai-coding/claude-code-competence/index.html` exists
- [ ] `docs/ai-coding/claude-code-competence/overview/index.html` exists
- [ ] `docs/ai-coding/claude-code-competence/dimensions/index.html` exists
- [ ] `docs/ai-coding/claude-code-competence/matrix/index.html` exists
- [ ] `docs/ai-coding/claude-code-competence/levels/operator/index.html` exists
- [ ] `docs/ai-coding/claude-code-competence/levels/structured-collaborator/index.html` exists
- [ ] `docs/ai-coding/claude-code-competence/levels/environment-builder/index.html` exists
- [ ] `docs/ai-coding/claude-code-competence/levels/workflow-engineer/index.html` exists
- [ ] `docs/ai-coding/claude-code-competence/levels/agentic-systems-expert/index.html` exists
- [ ] `docs/ai-coding/claude-code-competence/sources/index.html` exists
- [ ] `docs/ai-coding/claude-code-competence/author-perspective/index.html` exists
- [ ] `docs/ai-coding/claude-code-competence/glossary/index.html` exists
- [ ] `docs/ai-coding/claude-code-competence/roadmap/index.html` exists
- [ ] All internal nav links point to existing generated pages
- [ ] CSS assets present at `docs/assets/css/`

**Phase 3 exit criteria:** `npm run build` produces all 14 pages. Opening `docs/ai-coding/index.html` in a browser shows a navigable site with real content on every page.

---

## Phase 4 — JavaScript Enhancements & Print Support

Goal: Interactive behaviors and print-friendly output.

### 4.1 Browser TypeScript
- [ ] `src/scripts/main.ts` — Entry point, initializes all modules
- [ ] `src/scripts/navigation.ts` — Mobile nav toggle, active page highlighting
- [ ] `src/scripts/accordions.ts` — Expand/collapse on matrix and level pages
- [ ] `src/scripts/matrix.ts` — Row filtering/toggling by dimension
- [ ] `src/scripts/citations.ts` — Citation expansion toggles
- [ ] `src/scripts/filters.ts` — General filter support
- [ ] `src/scripts/page-state.ts` — Optional: localStorage for expanded rows, level selector

### 4.2 Build integration
- [ ] Compile browser TypeScript to `docs/assets/js/` during build
- [ ] Link compiled JS from `base.html` layout
- [ ] Verify all content remains readable with JavaScript disabled (progressive enhancement)

### 4.3 Print support
- [ ] `print.css` hides nav chrome, expands collapsed sections, prevents matrix overflow
- [ ] Test browser print preview on level page, matrix page, and sources page
- [ ] Optional: print mode helper button

### 4.4 Accessibility pass
- [ ] Semantic heading order on all page types
- [ ] Visible focus states on all interactive elements
- [ ] Keyboard navigation through nav, accordions, matrix filters
- [ ] ARIA attributes only where semantics are insufficient

**Phase 4 exit criteria:** Matrix filter toggles work. Accordions expand/collapse. Mobile nav toggles. Print preview renders cleanly without clipped content. All core content accessible without JS.

---

## Phase 5 — Deployment, Testing & Documentation

Goal: Production-ready output, verified and documented.

### 5.1 Build verification tests
- [ ] Test: data validation passes on all JSON files
- [ ] Test: build completes without error
- [ ] Test: all 14 required pages present in `docs/`
- [ ] Test: CSS and JS assets present in `docs/assets/`
- [ ] Test: all nav hrefs resolve to generated pages
- [ ] Test: all level/dimension/source ID cross-references valid
- [ ] Test: validation fails on deliberately broken input (missing field, bad ID ref, duplicate ID, wrong level order)

### 5.2 Deployment artifacts
- [ ] `CNAME` contains correct domain
- [ ] All asset references use relative paths honoring `siteBasePath`
- [ ] `docs/` output is self-contained and servable as static files
- [ ] Verify site works when served from local static server (`npm run dev`)

### 5.3 Documentation
- [ ] `README.md` with: project purpose, repository layout, build commands, content file locations, deployment model, how to add a new family, how to add a new level/source, how to change siteBasePath

### 5.4 Optional enhancements (not required for first release)
- [ ] GitHub Actions workflow for automated build and publish
- [ ] Printable summary page (`/ai-coding/claude-code-competence/printable/index.html`)
- [ ] `npm run watch` for file-change rebuild
- [ ] Dark/light theme toggle
- [ ] localStorage for expanded matrix rows
- [ ] Self-assessed level highlighter

**Phase 5 exit criteria:** All 10 acceptance criteria from the design document pass:
1. Repository builds from source into `docs/` without manual editing
2. Site contains all required first-release pages
3. All pages generated from structured JSON data
4. Styling consistent across family pages
5. Matrix page renders on desktop, readable on mobile
6. Level pages include all 14 required sections
7. Sources grouped and rendered from `sources.json`
8. Author perspective distinct from source-backed content
9. Site hostable as static files under GitHub Pages or `johnboen.com`
10. Architecture supports adding four future families with same pattern
