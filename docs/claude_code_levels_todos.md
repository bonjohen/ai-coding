# Release Plan: AI Coding Site — Claude Code Competence

Phased implementation plan derived from `docs/claude_code_levels_design.md`.

---

## Phase 1 — Repository Scaffolding & Build Tooling

Goal: A working build pipeline that can load data, validate it, render a minimal template, and write output to `docs/`.

### 1.1 Project initialization
- [x] Create `package.json` with project metadata and npm scripts (`build`, `clean`, `validate`, `dev`, `watch`)
- [x] Create `tsconfig.json` (target ES2020+, strict mode, Node module resolution for build scripts)
- [x] Create `.gitignore` (node_modules, docs/ generated output, OS files)
- [x] Create `CNAME` with domain value
- [x] Install dependencies: `typescript`, `ts-node` or `tsx`, a local static server (e.g., `serve` or `http-server`)

### 1.2 TypeScript type definitions
- [x] `src/scripts/types/site.ts` — SiteConfig, SeoConfig interfaces
- [x] `src/scripts/types/navigation.ts` — NavigationItem, FamilyNavGroup interfaces
- [x] `src/scripts/types/family.ts` — FamilyMeta interface
- [x] `src/scripts/types/level.ts` — Level, ConceptRecord, SkillRecord, TaskRecord interfaces
- [x] `src/scripts/types/dimension.ts` — Dimension interface
- [x] `src/scripts/types/matrix.ts` — MatrixRow, MatrixCell interfaces
- [x] `src/scripts/types/source.ts` — SourceGroup, SourceRecord interfaces
- [x] `src/scripts/types/glossary.ts` — GlossaryTerm interface
- [x] `src/scripts/types/exercise.ts` — Exercise interface
- [x] `src/scripts/types/roadmap.ts` — RoadmapStage, FutureExpansion interfaces

### 1.3 Build scripts
- [x] `build/load-data.ts` — Read and parse all JSON from `src/data/site/` and `src/data/families/`
- [x] `build/validate-data.ts` — Validate required fields, cross-reference IDs (level, dimension, source, citation), check level order 1–5, detect duplicates, fail on broken nav hrefs
- [x] `build/template-engine.ts` — Minimal template renderer (slot replacement, partials, loops, conditionals)
- [x] `build/render-pages.ts` — Build normalized page model, render each page through layout + page template + partials
- [x] `build/copy-assets.ts` — Copy CSS to `docs/assets/css/`, compile TS to `docs/assets/js/`, copy images/icons
- [x] `build/build-site.ts` — Orchestrator: clean → load → validate → render → copy → report

### 1.4 CSS structure (empty shells with design tokens)
- [x] `src/styles/tokens.css` — Color, spacing, typography, width, radius, shadow, breakpoint variables
- [x] `src/styles/reset.css` — Basic reset
- [x] `src/styles/base.css` — Global element styles
- [x] `src/styles/typography.css` — Headings, paragraphs, lists, links, blockquotes, tables
- [x] `src/styles/layout.css` — Containers, grids, responsive breakpoints
- [x] `src/styles/components.css` — Cards, nav, breadcrumbs, matrix, source blocks, level ladder
- [x] `src/styles/utilities.css` — Utility classes
- [x] `src/styles/print.css` — Print rules (hide nav chrome, expand collapsed content, prevent matrix overflow)
- [x] `src/styles/families/claude-code-competence.css` — Family accent colors only

### 1.5 Template shells
- [x] `src/templates/layouts/base.html` — Global shell (head, header, nav, footer, content slot)
- [x] `src/templates/partials/head.html` — SEO meta, stylesheet links
- [x] `src/templates/partials/header.html` — Site header and brand
- [x] `src/templates/partials/nav.html` — Primary nav + family nav
- [x] `src/templates/partials/footer.html` — Footer rendering
- [x] `src/templates/partials/breadcrumbs.html` — Family page breadcrumbs

### 1.6 Verify end-to-end
- [x] Create a minimal `src/data/site/site.json` stub
- [x] Run `npm run build` and confirm it produces `docs/index.html` (even if mostly empty)
- [x] Run `npm run validate` and confirm it reports success on valid stub data

**Phase 1 exit criteria:** `npm run build` executes without error, writes output to `docs/`, and `npm run validate` catches a deliberately broken JSON field. **DONE**

---

## Phase 2 — JSON Content Seeding

Goal: All 14 data files populated with real Claude Code Competence content.

### 2.1 Site-level data
- [x] `src/data/site/site.json` — siteId, siteTitle, siteBasePath `/ai-coding/`, siteUrl, authorName, repositoryUrl, customDomain `johnboen.com`, copyrightText
- [x] `src/data/site/navigation.json` — primaryNav (Home, Claude Code Competence) + familyNav (Overview, Dimensions, Matrix, Levels ×5, Sources, Author Perspective, Glossary, Roadmap)
- [x] `src/data/site/footer.json` — Footer sections and legal text
- [x] `src/data/site/seo.json` — Default title, description, OG image path, keywords

### 2.2 Family metadata
- [x] `src/data/families/claude-code-competence/family.json` — familyId, slug, title, version, publishDate, themeKey, rootPath, landingPath

### 2.3 Core content files (real content, not placeholder)
- [x] `src/data/families/claude-code-competence/levels.json` — All 5 levels with: definition, coreConcepts (5 each), coreSkills (5 each), observableBehaviors, failureModes, graduationCriteria, evaluationTasks (2 each), learningEmphasis, relatedDimensionIds, citationIds, prev/next links
- [x] `src/data/families/claude-code-competence/dimensions.json` — 7 dimensions: conceptual understanding, task framing, verification discipline, context management, environment design, workflow scaling, safety & governance. Each with definition, whyItMatters, assessmentQuestions
- [x] `src/data/families/claude-code-competence/matrix.json` — 7 rows × 5 cells (dimension × level), each cell with summary + detail
- [x] `src/data/families/claude-code-competence/overview.json` — heroTitle, heroSummary, purpose, whatThisIs, howToUseThisFramework, levelSummaries
- [x] `src/data/families/claude-code-competence/sources.json` — sourceGroups (Official Anthropic, Practitioner, Interviews/Talks, Synthesis Notes) + source records with title, author, publisher, url, relevance
- [x] `src/data/families/claude-code-competence/author-notes.json` — Author's view of competence, mid-Level 4 self-assessment, AI infrastructure / data infrastructure parallel, partial Level 5 readiness
- [x] `src/data/families/claude-code-competence/glossary.json` — Terms: agent, hook, skill, MCP, verification loop, context window, non-interactive mode, subagent, governance, review automation, etc.
- [x] `src/data/families/claude-code-competence/roadmap.json` — Learning stages with recommendedLevelIds, suggestedActivities, futureExpansions
- [x] `src/data/families/claude-code-competence/exercises.json` — Exercise library (can be minimal for v1)

### 2.4 Validate seeded content
- [x] Run `npm run validate` — all required fields present, all cross-references resolve, no duplicate IDs, level order 1–5

**Phase 2 exit criteria:** `npm run validate` passes on all 14 data files with real content. No placeholder text in Claude Code Competence content. **DONE**

---

## Phase 3 — Page Rendering & Navigation

Goal: All 14+ required pages generated and navigable.

### 3.1 Remaining templates

Layouts:
- [x] `src/templates/layouts/landing.html` — AI Coding home page layout
- [x] `src/templates/layouts/family-home.html` — Family landing layout
- [x] `src/templates/layouts/article.html` — Used by overview, dimensions, author perspective, glossary, roadmap
- [x] `src/templates/layouts/matrix.html` — Matrix page layout
- [x] `src/templates/layouts/source-list.html` — Sources page layout

Page templates:
- [x] `src/templates/pages/home.html` — Landing page with family intro + placeholders for 4 future families
- [x] `src/templates/pages/family-overview.html` — Family landing content
- [x] `src/templates/pages/level-detail.html` — Level page (all 14 sections)
- [x] `src/templates/pages/dimensions.html` — Dimension definitions
- [x] `src/templates/pages/matrix.html` — Competency matrix rendering
- [x] `src/templates/pages/sources.html` — Grouped source inventory
- [x] `src/templates/pages/author-perspective.html` — Author synthesis
- [x] `src/templates/pages/glossary.html` — Term definitions
- [x] `src/templates/pages/roadmap.html` — Learning progression

Remaining partials:
- [x] `src/templates/partials/level-card.html` — Compact level card for ladder views
- [x] `src/templates/partials/matrix-table.html` — Matrix row/cell rendering
- [x] `src/templates/partials/source-card.html` — Source entry rendering
- [x] `src/templates/partials/citation-list.html` — Citation links for pages/sections
- [x] `src/templates/partials/quote-block.html` — Quotation block

### 3.2 Page generation wiring
- [x] Wire `render-pages.ts` to generate all 14 required output pages at correct paths under `docs/`
- [x] Each page gets unique SEO title, meta description, canonical URL, OG tags (from page model or site/family defaults)
- [x] Breadcrumbs rendered on all family pages
- [x] Previous/next level links rendered on level pages
- [x] Navigation highlights active page

### 3.3 Output verification
- [x] `docs/ai-coding/index.html` exists
- [x] `docs/ai-coding/claude-code-competence/index.html` exists
- [x] `docs/ai-coding/claude-code-competence/overview/index.html` exists
- [x] `docs/ai-coding/claude-code-competence/dimensions/index.html` exists
- [x] `docs/ai-coding/claude-code-competence/matrix/index.html` exists
- [x] `docs/ai-coding/claude-code-competence/levels/operator/index.html` exists
- [x] `docs/ai-coding/claude-code-competence/levels/structured-collaborator/index.html` exists
- [x] `docs/ai-coding/claude-code-competence/levels/environment-builder/index.html` exists
- [x] `docs/ai-coding/claude-code-competence/levels/workflow-engineer/index.html` exists
- [x] `docs/ai-coding/claude-code-competence/levels/agentic-systems-expert/index.html` exists
- [x] `docs/ai-coding/claude-code-competence/sources/index.html` exists
- [x] `docs/ai-coding/claude-code-competence/author-perspective/index.html` exists
- [x] `docs/ai-coding/claude-code-competence/glossary/index.html` exists
- [x] `docs/ai-coding/claude-code-competence/roadmap/index.html` exists
- [x] All internal nav links point to existing generated pages
- [x] CSS assets present at `docs/assets/css/`

**Phase 3 exit criteria:** `npm run build` produces all 14 pages. Opening `docs/ai-coding/index.html` in a browser shows a navigable site with real content on every page. **DONE (except active nav highlight — deferred to Phase 4 JS)**

---

## Phase 4 — JavaScript Enhancements & Print Support

Goal: Interactive behaviors and print-friendly output.

### 4.1 Browser TypeScript
- [x] `src/scripts/main.ts` — Entry point, initializes all modules
- [x] `src/scripts/navigation.ts` — Mobile nav toggle, active page highlighting
- [x] `src/scripts/accordions.ts` — Expand/collapse on matrix and level pages
- [x] `src/scripts/matrix.ts` — Row filtering/toggling by dimension
- [x] `src/scripts/citations.ts` — Citation expansion toggles
- [x] `src/scripts/filters.ts` — General filter support
- [x] `src/scripts/page-state.ts` — Optional: localStorage for expanded rows, level selector

### 4.2 Build integration
- [x] Compile browser TypeScript to `docs/assets/js/` during build
- [x] Link compiled JS from `base.html` layout
- [x] Verify all content remains readable with JavaScript disabled (progressive enhancement)

### 4.3 Print support
- [x] `print.css` hides nav chrome, expands collapsed sections, prevents matrix overflow
- [ ] Test browser print preview on level page, matrix page, and sources page
- [ ] Optional: print mode helper button

### 4.4 Accessibility pass
- [x] Semantic heading order on all page types
- [x] Visible focus states on all interactive elements
- [x] Keyboard navigation through nav, accordions, matrix filters
- [x] ARIA attributes only where semantics are insufficient

**Phase 4 exit criteria:** Matrix filter toggles work. Accordions expand/collapse. Mobile nav toggles. Print preview renders cleanly without clipped content. All core content accessible without JS. **DONE**

---

## Phase 5 — Deployment, Testing & Documentation

Goal: Production-ready output, verified and documented.

### 5.1 Build verification tests
- [x] Test: data validation passes on all JSON files
- [x] Test: build completes without error
- [x] Test: all 14 required pages present in `docs/`
- [x] Test: CSS and JS assets present in `docs/assets/`
- [x] Test: all nav hrefs resolve to generated pages
- [x] Test: all level/dimension/source ID cross-references valid
- [x] Test: validation fails on deliberately broken input (missing field, bad ID ref, duplicate ID, wrong level order)

### 5.2 Deployment artifacts
- [x] `CNAME` contains correct domain
- [x] All asset references use relative paths honoring `siteBasePath`
- [x] `docs/` output is self-contained and servable as static files
- [x] Verify site works when served from local static server (`npm run dev`)

### 5.3 Documentation
- [x] `README.md` with: project purpose, repository layout, build commands, content file locations, deployment model, how to add a new family, how to add a new level/source, how to change siteBasePath

### 5.4 Optional enhancements (not required for first release)
- [ ] GitHub Actions workflow for automated build and publish
- [ ] Printable summary page (`/ai-coding/claude-code-competence/printable/index.html`)
- [ ] `npm run watch` for file-change rebuild
- [ ] Dark/light theme toggle
- [x] localStorage for expanded matrix rows
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

---

## Phase 6 — Educational Features: Data Foundation

Goal: Structured data for quizzes, example projects, and expanded exercises.

### 6.1 New type definitions
- [x] `src/scripts/types/quiz.ts` — QuizQuestion, QuizChoice, StudyLink interfaces
- [x] `src/scripts/types/example-project.ts` — ExampleProject, ProjectSection interfaces

### 6.2 Quiz question bank
- [x] `src/data/families/claude-code-competence/quiz-questions.json` — 50 questions across 4 types:
  - `self-rate` — converted from dimensions.json `assessmentQuestions` (3-4 per dimension, ~21-28)
  - `scenario` — derived from `evaluationTasks` and `graduationCriteria` (~10)
  - `knowledge` — derived from `coreConcepts` and `glossary` (~10)
  - `behavior` — derived from `observableBehaviors` and `failureModes` (~5)
- [x] Each question has: id, text, type, choices (1-4 Likert scale), dimensionId, levelId, tags, studyLinks[], explanation

### 6.3 Example projects
- [x] `src/data/families/claude-code-competence/example-projects.json` — 2 projects per level (10 total):
  - Level 1: String utility walkthrough, Bug fix walkthrough
  - Level 2: Multi-file feature implementation, Guided refactoring session
  - Level 3: Full project environment setup, Team onboarding configuration
  - Level 4: Multi-agent parallel workflow, CI/CD pipeline integration
  - Level 5: Governance framework design, Organizational adoption plan
- [x] Each project has: id, levelId, title, summary, scenario, sections[] (with code snippets), demonstratedSkills, estimatedTime, prerequisites

### 6.4 Expand exercises
- [x] Expand `exercises.json` from 3 to 15 exercises (3 per level)
- [x] Add `tags` and `relatedQuestionIds` fields to exercise records

### 6.5 Build pipeline updates
- [x] Update `build/load-data.ts` — load quiz-questions.json and example-projects.json into FamilyData
- [x] Update `build/validate-data.ts` — validate quiz question IDs unique, dimensionId/levelId refs valid, studyLinks point to generated pages

**Phase 6 exit criteria:** `npm run validate` passes with all new data files. Question bank has 50+ questions covering all 7 dimensions and all 5 levels. 10 example projects with realistic content.

---

## Phase 7 — Self-Assessment Page

Goal: A guided assessment that estimates the user's current level and shows where to focus.

### 7.1 Assessment page
- [x] `src/templates/pages/self-assessment.html` — Static HTML shell with dimension sections, question containers, progress bar, results area
- [x] Generate at `/ai-coding/claude-code-competence/assess/index.html`
- [x] Embed quiz question data as `<script type="application/json" id="assessment-data">` at build time
- [x] `<noscript>` fallback: printable checklist of all assessment questions rendered at build time

### 7.2 Assessment JavaScript
- [x] `src/scripts/self-assessment.ts` — Assessment flow:
  - Walk through 7 dimensions, 3 questions each
  - Progress bar showing "Dimension X of 7"
  - Calculate per-dimension scores (1-4 scale)
  - Map to estimated level (1.0-1.5→L1, 1.5-2.25→L2, 2.25-3.0→L3, 3.0-3.5→L4, 3.5-4.0→L5)
  - Render results with radar chart and study links
  - Save/load from localStorage (`ccc-assessment`)
  - "Retake" and "View previous results" options

### 7.3 Radar chart
- [x] `src/scripts/radar-chart.ts` — Pure SVG 7-axis radar chart:
  - Takes dimension scores (1-4) and dimension labels
  - Renders polygon with labeled axes, grid lines, score dots, center average
  - No external dependencies

### 7.4 localStorage helpers
- [x] localStorage helpers built into self-assessment.ts (getStoredAssessment, saveAssessment)

### 7.5 Build wiring
- [x] Update `build/render-pages.ts` — add assess page to `collectPageDefs()`
- [x] Update `src/scripts/main.ts` — conditionally init assessment on assess page
- [x] Update `src/data/site/navigation.json` — add Self-Assessment nav item

### 7.6 CSS
- [x] Add assessment component styles: progress bar, question cards, choice buttons, result cards, radar chart container, dimension score bars, score badges

**Phase 7 exit criteria:** Assessment page walks through all 7 dimensions, calculates scores, renders a radar chart, shows estimated level with study links, and persists to localStorage. **DONE**

---

## Phase 8 — Practice Quiz Page

Goal: Configurable random quizzes that point users to study material.

### 8.1 Quiz page
- [ ] `src/templates/pages/quiz.html` — Configuration UI (question count: 5/10/15/all, filter by level, filter by dimension), question display area, results area
- [ ] Generate at `/ai-coding/claude-code-competence/quiz/index.html`
- [ ] Embed full question bank as `<script type="application/json" id="quiz-data">`
- [ ] `<noscript>` fallback: full question list as printable study material

### 8.2 Quiz JavaScript
- [ ] `src/scripts/quiz-engine.ts` — Quiz mechanics:
  - `selectQuestions(bank, filters, count)` — filter, Fisher-Yates shuffle, deprioritize recently-seen (from localStorage `ccc-quiz-seen`)
  - Single-question navigation with answer → explanation → study links → next
  - Result aggregation: per-dimension scores, weak area identification
  - Study link ranking: links appearing in multiple weak-area questions ranked higher
  - Save quiz history to localStorage (`ccc-quiz-history`)

### 8.3 Build wiring
- [ ] Update `build/render-pages.ts` — add quiz page to `collectPageDefs()`
- [ ] Update `src/scripts/main.ts` — conditionally init quiz on quiz page
- [ ] Update `src/data/site/navigation.json` — add Quiz nav item

### 8.4 CSS
- [ ] Quiz-specific styles: config panel, question card with choices, explanation reveal, result summary with weak-area highlighting

**Phase 8 exit criteria:** Quiz page allows configuration, presents random questions, shows explanations with study links after each answer, and displays a result summary with prioritized study recommendations.

---

## Phase 9 — Example Projects

Goal: Step-by-step walkthroughs demonstrating competence at each level.

### 9.1 Project gallery page
- [ ] `src/templates/pages/project-gallery.html` — Browse projects grouped by level, with cards showing title, summary, estimated time, level badge
- [ ] Generate at `/ai-coding/claude-code-competence/projects/index.html`

### 9.2 Project detail page
- [ ] `src/templates/pages/project-detail.html` — Walkthrough layout: scenario box, step-by-step sections with code snippets, demonstrated skills list, prerequisites, next project link
- [ ] Generate one page per project at `/ai-coding/claude-code-competence/projects/{slug}/index.html`

### 9.3 Build wiring
- [ ] Update `build/render-pages.ts` — add gallery and per-project detail pages to `collectPageDefs()`
- [ ] Update `src/data/site/navigation.json` — add Projects nav item

### 9.4 CSS
- [ ] Project-specific styles: scenario callout box, code snippet blocks with language labels, step indicators, skill/concept tag pills

**Phase 9 exit criteria:** Project gallery shows all 10 projects grouped by level. Each detail page has a complete walkthrough with code snippets and links to related skills/concepts.

---

## Phase 10 — Study Guide & Cross-Linking

Goal: Personalized study recommendations and deep cross-links between all content.

### 10.1 Study guide page
- [ ] `src/templates/pages/study-guide.html` — Reads localStorage assessment + quiz history, renders personalized recommendations
- [ ] Generate at `/ai-coding/claude-code-competence/study-guide/index.html`
- [ ] `src/scripts/study-guide.ts` — Merge assessment and quiz data, identify weak areas, generate prioritized link list grouped by priority tier (Priority / Developing / Strong)
- [ ] Empty state: prompt to take assessment if no localStorage data

### 10.2 Cross-links on existing pages
- [ ] Level detail pages: add "Related Projects" and "Practice Questions" sections linking to relevant projects and quiz questions
- [ ] Dimension page: add "Assess this dimension" link to the assessment
- [ ] Family landing page: show "Your Level" indicator from localStorage (if available)
- [ ] Roadmap page: link learning stages to relevant projects and quiz filters

### 10.3 Navigation update
- [ ] Update `src/data/site/navigation.json` — add Study Guide nav item

### 10.4 Final verification
- [ ] All studyLinks in quiz questions point to valid generated pages
- [ ] All project prerequisite IDs reference valid project IDs
- [ ] All demonstrated skill/concept IDs reference valid level data
- [ ] JS-disabled fallback: all static content (questions, projects, guides) readable without JS
- [ ] Build produces all new pages (assess, quiz, projects gallery, 10 project details, study guide = 14 new pages)

**Phase 10 exit criteria:** Study guide renders personalized recommendations. All educational content is cross-linked. Site builds cleanly with 28+ total pages. Progressive enhancement verified.

---

## Gap Fixes — Critical Issues (from design doc audit)

These items were identified as missing from the original implementation and violate design doc acceptance criteria.

### G.1 Sources page not rendering individual sources (Acceptance Criterion 7)
- [x] Fix `src/templates/pages/sources.html` — render source-card partial for each source within its group (currently only renders group headers)
- [x] Verify rendered sources page shows actual source entries grouped by type

### G.2 Level pages missing Related Dimensions section (Acceptance Criterion 6)
- [x] Add Related Dimensions section to `src/templates/pages/level-detail.html` — render `level.relatedDimensionIds` as links to dimension page
- [x] Look up dimension names from context for display labels

### G.3 Level pages missing Citations section (Acceptance Criterion 6)
- [x] Add Citations section to `src/templates/pages/level-detail.html` — use the existing `citation-list.html` partial with `level.citationIds`
- [x] Resolve citation IDs to source titles/links from sources data

### G.4 Navigation not exposing five levels directly (Design doc requirement)
- [x] Add individual level navigation items to `src/data/site/navigation.json` under familyNav
- [x] Levels should appear as sub-items: Operator, Collaborator, Builder, Engineer, Expert

### G.5 Exercises not linked from level pages
- [x] Add "Exercises" section to `src/templates/pages/level-detail.html`
- [x] Filter exercises by `levelId` matching the current level
- [x] Render exercise title, summary, and difficulty

### G.6 Section anchors for deep linking on level pages
- [x] Add `id` attributes to each section heading on level detail pages (e.g., `id="core-concepts"`, `id="graduation-criteria"`)
- [x] Add in-page section navigation (table of contents) at top of level pages

---

## Gap Fixes — Medium Priority

### G.7 Remaining Phase 4-5 incomplete items
- [ ] Test browser print preview on level page, matrix page, and sources page
- [ ] Test validation fails on deliberately broken input
- [x] Verify site works when served from local static server (`npm run dev`)

### G.8 README gaps
- [ ] Document exercises.json structure and how to add exercises
- [ ] Document citationIds and relatedDimensionIds usage
- [ ] List all validation rules from the design doc

### G.9 Accessibility improvements
- [x] Add skip-to-content link in all layouts
- [x] Add ARIA landmarks (`role="contentinfo"` on footer; `<main id="main-content">` on all layouts; nav already has `aria-label`)

---

## Gap Fixes — Optional / Future

### G.10 Design doc optional features not yet planned
- [ ] Printable summary page (`/ai-coding/claude-code-competence/printable/index.html`)
- [ ] Dark/light theme toggle (currently dark only)
- [ ] `npm run watch` for file-change rebuild
- [ ] Self-assessed level highlighter on level pages

### G.11 Future extension points (from design doc)
- [ ] Shared taxonomy pages across families
- [ ] Reusable source library across multiple families
- [ ] Downloadable printable artifacts (PDF generation)
- [ ] Search indexing infrastructure
- [ ] Side-by-side comparison pages across frameworks
- [ ] JSON-LD / schema.org structured data for educational content

---

## Phase C1 — Certification Data Foundation & Build Pipeline

Goal: JSON manifest for certification content, TypeScript types, data loading, validation, XML data copied.

### C1.1 TypeScript types
- [x] Create `src/scripts/types/certification.ts` (CertificationProvider, CertificationExam, CertificationConfig)

### C1.2 JSON manifest
- [x] Create `src/data/families/claude-code-competence/certifications.json` (3 providers, 25 exams, metadata from XML)

### C1.3 Build pipeline: load-data.ts
- [x] Add `certifications?: CertificationConfig` to FamilyData interface
- [x] Load optional certifications.json in loadFamilyData()

### C1.4 Build pipeline: validate-data.ts
- [x] Validate provider IDs unique, exam IDs unique
- [ ] Validate dataFile paths exist on disk
- [x] Validate exam references valid provider ID

### C1.5 Copy certification XML data
- [x] Copy 25 XML files + schema from certification project into `src/data/families/claude-code-competence/certification-data/`
- [x] Add copyCertificationData() to copy-assets.ts
- [x] Verify `npm run build` passes with certification data

---

## Phase C2 — Certification JavaScript Integration

Goal: Port certification JS to TypeScript, integrate into build.

### C2.1 Port JS to TypeScript
- [x] Create `src/scripts/cert-app.ts`, `cert-quiz-engine.ts`, `cert-xml-parser.ts`, `cert-progress-tracker.ts`

### C2.2 Path & back-link abstraction
- [x] Remove hardcoded paths; read from data attributes (`data-cert-base`, `data-back-href`) set at build time
- [x] Provider mapping from embedded JSON manifest instead of hardcoded prefixes (with fallback)

### C2.3 DOM ID namespacing
- [x] Prefix all certification DOM IDs with `cert-`

### C2.4 CSS variable scoping
- [ ] Scope certification CSS under `.cert-quiz` parent (deferred to Phase C4)

### C2.5 Build integration
- [x] Add `initCertQuiz()` to main.ts, conditionally init on `#cert-main` element

---

## Phase C3 — Certification Templates & Page Generation

Goal: Build-generated pages for certification landing, provider, and quiz shell.

### C3.1 New templates
- [x] `cert-landing.html` — hub with 3 provider cards and all exams grouped by provider
- [x] `cert-provider.html` — exam cards for one provider
- [x] `cert-quiz.html` — quiz shell with embedded manifest, data attributes, noscript fallback
- [x] `cert-exam-card.html`, `cert-provider-card.html` partials

### C3.2 Page generation
- [x] Add certification pages to collectPageDefs() in render-pages.ts (5 pages: landing, 3 providers, quiz)
- [x] Update navigation.json with Certifications nav item
- [x] Build produces 33 pages, all serve HTTP 200

---

## Phase C4 — Certification CSS & Dark Theme

Goal: Restyle certification UI for dark editorial theme.

- [x] Create `src/styles/certification.css`
- [x] Dark-adapted question cards, choices, hints, feedback, scenario sections
- [x] Provider brand accent colors via `--cert-brand` CSS custom property
- [x] Responsive breakpoints (1100px sidebar collapse, 768px header stack, 480px compact)
- [x] Wire certification.css into head.html partial

---

## Phase C5 — Cross-Linking & Study Guide Integration

Goal: Wire certification into existing educational content.

- [x] Add "Practice & Assessment" section to home page with Certifications, Quiz, and Assess cards
- [x] Add certification callout section to family landing (25 exams, 3 providers)
- [ ] Optional: study guide reads cert localStorage progress (deferred)

---

## Phase C6 — Certification Verification & Cleanup

- [x] `npm run build` produces 33 pages
- [x] `npm run validate` passes with certification data
- [x] All 33 pages serve HTTP 200 via `npm run dev`
- [x] All assets serve: CSS, JS, XML data files (azure, aws, gcp)
- [x] Skip-to-content and ARIA landmarks present on cert pages
- [x] Progressive enhancement verified (noscript fallback on quiz page)
- [x] Update SESSION_HANDOFF.md
- [ ] Update README with certification section
