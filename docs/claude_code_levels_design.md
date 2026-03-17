# Project Design Document

## Project Title

AI Coding Site: Claude Code Competence Family

## Project Purpose

This project creates the first core HTML set for a larger AI Coding website. The immediate goal is to publish a structured, source-aware, data-driven static site section focused on the five levels of Claude Code competence. The site must be buildable as static files, hostable from a GitHub repository under the bonjohen account, and deployable to johnboen.com.

The site must separate content data, styling, and functional behavior from the first implementation. The Claude Code Competence family is the first content family and must be designed so later families can reuse the same architecture.

This document is intended for a coding agent. It defines repository layout, page inventory, data model, rendering pipeline, build steps, and first-release scope.

## Primary Goals

The first release must:

1. Publish a clean static website section for Claude Code Competence.
2. Use structured content data rather than hard-coded article pages.
3. Generate HTML pages from templates plus JSON data.
4. Use shared CSS tokens and layout rules.
5. Use TypeScript for functional behavior and build logic.
6. Be deployable through GitHub Pages or equivalent static hosting.
7. Be easy to extend into additional AI Coding topic families.

## Non-Goals for First Release

The first release must not include:

1. A client-side SPA router.
2. User accounts or login.
3. Server-side rendering at runtime.
4. Search indexing beyond simple in-page filtering.
5. CMS integration.
6. Commenting systems.
7. Database-backed storage.
8. Complex visualization libraries.

## Product Model

The site is a static documentation and reference system.

There is one top-level site.
Within it there are topic families.
Each family shares a common shell, navigation model, design system, and script layer.
Each family owns structured data files that define its content.
Pages are generated at build time.
Each generated page is a real HTML file.

The first family is Claude Code Competence.

## Repository Name

Recommended repository name:

ai-coding-site

Alternative acceptable repository names:

ai-coding
johnboen-ai-coding
claude-code-competence-site

Preferred assumption for this document:

Repository root = ai-coding-site

## Repository Layout

Use this exact layout.

ai-coding-site/
package.json
package-lock.json or pnpm-lock.yaml
tsconfig.json
README.md
.gitignore
CNAME

build/
build-site.ts
copy-assets.ts
render-pages.ts
load-data.ts
template-engine.ts
validate-data.ts

src/
data/
site/
site.json
navigation.json
footer.json
seo.json
families/
claude-code-competence/
family.json
overview.json
dimensions.json
levels.json
matrix.json
sources.json
author-notes.json
exercises.json
glossary.json
roadmap.json
templates/
layouts/
base.html
article.html
matrix.html
source-list.html
family-home.html
landing.html
partials/
head.html
header.html
nav.html
footer.html
breadcrumbs.html
citation-list.html
level-card.html
matrix-table.html
source-card.html
quote-block.html
pages/
home.html
family-overview.html
level-detail.html
dimensions.html
matrix.html
sources.html
author-perspective.html
glossary.html
roadmap.html
styles/
tokens.css
reset.css
base.css
typography.css
layout.css
components.css
utilities.css
print.css
families/
claude-code-competence.css
scripts/
main.ts
navigation.ts
accordions.ts
filters.ts
citations.ts
matrix.ts
page-state.ts
types/
site.ts
family.ts
level.ts
dimension.ts
source.ts
exercise.ts
glossary.ts
assets/
icons/
images/
social/

docs/
generated static site output

## Output Model

The build emits the final static site into:

docs/

GitHub Pages can publish directly from docs/ on the main branch, or from a Pages workflow if preferred.

## Site URL Model

Assume the site will eventually be served from johnboen.com.

The first family should be published under:

/ai-coding/claude-code-competence/

The overall site root may support:

/ai-coding/

All internal links must be generated relative to a configurable base path so the site can work both in GitHub Pages project hosting and under the production custom domain.

## Page Inventory

The first release must generate these pages.

### Top-Level AI Coding Pages

1. /ai-coding/index.html
   Purpose: top-level landing page for the AI Coding site and links to content families.

### Claude Code Competence Family Pages

2. /ai-coding/claude-code-competence/index.html
   Purpose: family landing page.

3. /ai-coding/claude-code-competence/overview/index.html
   Purpose: narrative overview of the five-level model.

4. /ai-coding/claude-code-competence/dimensions/index.html
   Purpose: defines cross-level scoring dimensions.

5. /ai-coding/claude-code-competence/matrix/index.html
   Purpose: renders the full competency matrix.

6. /ai-coding/claude-code-competence/levels/operator/index.html
   Purpose: Level 1 detail page.

7. /ai-coding/claude-code-competence/levels/structured-collaborator/index.html
   Purpose: Level 2 detail page.

8. /ai-coding/claude-code-competence/levels/environment-builder/index.html
   Purpose: Level 3 detail page.

9. /ai-coding/claude-code-competence/levels/workflow-engineer/index.html
   Purpose: Level 4 detail page.

10. /ai-coding/claude-code-competence/levels/agentic-systems-expert/index.html
    Purpose: Level 5 detail page.

11. /ai-coding/claude-code-competence/sources/index.html
    Purpose: source list organized by type.

12. /ai-coding/claude-code-competence/author-perspective/index.html
    Purpose: your personal synthesis and interpretation.

13. /ai-coding/claude-code-competence/glossary/index.html
    Purpose: defines key terms.

14. /ai-coding/claude-code-competence/roadmap/index.html
    Purpose: learning path and future expansion notes.

### Optional First-Release Page

15. /ai-coding/claude-code-competence/printable/index.html
    Purpose: one-page printable summary. Optional for first release. Nice to have, not required.

## Navigation Model

Primary navigation must include:

Home
Claude Code Competence
Overview
Dimensions
Matrix
Levels
Sources
Author Perspective
Glossary
Roadmap

The Levels navigation must expose the five levels directly.

Breadcrumbs must appear on family pages below the global header.

The left navigation or page-local navigation may be added later, but first release should include at least top navigation and within-page section navigation on long pages.

## Page Content Responsibilities

### AI Coding Home

This page introduces the broader AI Coding site. It presents the Claude Code Competence family as the first published family and includes placeholders for four future core families.

### Family Landing Page

This page presents the five-level ladder, the purpose of the framework, where the framework came from, why it matters, and links to detailed pages.

### Overview Page

This page provides the narrative explanation of the five levels and how the framework should be used.

### Dimensions Page

This page defines the cross-level evaluation dimensions such as conceptual understanding, task framing, verification discipline, context management, environment design, workflow scaling, and safety and governance.

### Matrix Page

This page renders the competency matrix with dimensions as one axis and levels as the other axis. It must support simple show or hide controls for dimensions and expanded cell detail.

### Level Pages

Each level page must contain:

1. Level name
2. Short label
3. Summary
4. Full definition
5. Core concepts
6. Core skills
7. Observable behaviors
8. Typical failure modes
9. Graduation criteria
10. Suggested evaluation tasks
11. Learning emphasis
12. Related dimensions
13. Citations
14. Links to previous and next levels

### Sources Page

This page groups sources into:

1. Official Anthropic sources
2. Practitioner sources
3. Interviews and talks
4. Your synthesis notes

### Author Perspective Page

This page clearly distinguishes your views from source-backed summary. It should include your position on being mid-Level 4 moving into Level 5, and the parallel between AI infrastructure and data infrastructure. This content must be data-driven and editable.

### Glossary Page

Defines terms such as agent, hook, skill, MCP, verification loop, context window, non-interactive mode, subagent, governance, review automation, and related terminology.

### Roadmap Page

Defines the learner progression path and future topic expansion.

## Design Requirements

The site must feel like a technical knowledge site.

It must be:

1. Readable
2. Compact
3. Structured
4. Print-friendly
5. Mobile-capable
6. Keyboard-navigable
7. Accessible with semantic HTML

The five levels should read visually as a maturity ladder.

Use a shared design token system.

The design system must define:

1. Color variables
2. Spacing variables
3. Typography scale
4. Content width variables
5. Border radius variables
6. Shadow variables
7. Breakpoint variables

The family-specific stylesheet may define only small presentation differences. Global consistency should dominate.

## Accessibility Requirements

The first release must:

1. Use semantic heading order.
2. Provide visible focus states.
3. Support keyboard navigation.
4. Preserve contrast in dark and light themes if both are added.
5. Render cleanly in print.
6. Use ARIA only when necessary.
7. Avoid interaction patterns that require JavaScript to access core content.

## Data-Driven Rendering Model

The site must be generated from structured JSON data plus HTML templates.

Data files are the source of truth.
Templates render pages.
CSS controls presentation.
TypeScript handles enhancements.

The coding agent must not hard-code Claude Code Competence content inside templates.

## Required Data Files

Use these exact file names.

src/data/site/site.json
src/data/site/navigation.json
src/data/site/footer.json
src/data/site/seo.json

src/data/families/claude-code-competence/family.json
src/data/families/claude-code-competence/overview.json
src/data/families/claude-code-competence/dimensions.json
src/data/families/claude-code-competence/levels.json
src/data/families/claude-code-competence/matrix.json
src/data/families/claude-code-competence/sources.json
src/data/families/claude-code-competence/author-notes.json
src/data/families/claude-code-competence/exercises.json
src/data/families/claude-code-competence/glossary.json
src/data/families/claude-code-competence/roadmap.json

## Data Schema Definitions

The following schemas define the minimum required shape. The coding agent may add fields if they remain backward compatible and clearly documented.

### site.json

Purpose: site-wide identity and deployment settings.

Required fields:

siteId: string
siteTitle: string
siteSubtitle: string
siteBasePath: string
siteUrl: string
authorName: string
repositoryUrl: string
customDomain: string
defaultLanguage: string
copyrightText: string

### navigation.json

Purpose: top-level navigation and family navigation.

Required fields:

primaryNav: array of navigation item
familyNav: array of family navigation group

Navigation item fields:

id: string
label: string
href: string
title: string
order: number

Family navigation group fields:

familyId: string
items: array of navigation item

### footer.json

Purpose: footer links and notes.

Required fields:

footerSections: array
legalText: string

Footer section fields:

id: string
title: string
links: array of navigation item

### seo.json

Purpose: global default metadata.

Required fields:

defaultTitle: string
defaultDescription: string
defaultOgImage: string
defaultKeywords: array of string

### family.json

Purpose: identity and metadata for the Claude Code Competence family.

Required fields:

familyId: string
slug: string
title: string
shortTitle: string
summary: string
status: string
version: string
publishDate: string
updatedDate: string
owner: string
landingPath: string
rootPath: string
themeKey: string
introQuote: string optional

### overview.json

Purpose: family narrative overview content.

Required fields:

familyId: string
heroTitle: string
heroSummary: string
purpose: array of paragraph strings
whatThisIs: array of paragraph strings
howToUseThisFramework: array of paragraph strings
levelSummaries: array of level summary record

Level summary record fields:

levelId: string
levelNumber: number
title: string
shortLabel: string
summary: string
href: string

### dimensions.json

Purpose: cross-level evaluation dimensions.

Required fields:

familyId: string
dimensions: array of dimension record

Dimension record fields:

id: string
slug: string
name: string
shortName: string
summary: string
definition: string
whyItMatters: string
assessmentQuestions: array of string
order: number

### levels.json

Purpose: all level definitions.

Required fields:

familyId: string
levels: array of level record

Level record fields:

id: string
slug: string
levelNumber: number
title: string
shortLabel: string
summary: string
definition: array of paragraph strings
coreConcepts: array of concept record
coreSkills: array of skill record
observableBehaviors: array of string
failureModes: array of string
graduationCriteria: array of string
evaluationTasks: array of task record
learningEmphasis: array of paragraph strings
relatedDimensionIds: array of string
citationIds: array of string
previousLevelId: string optional
nextLevelId: string optional
personalNote: array of paragraph strings optional

Concept record fields:

id: string
name: string
definition: string

Skill record fields:

id: string
name: string
definition: string
observableEvidence: string

Task record fields:

id: string
title: string
description: string
successCriteria: array of string

### matrix.json

Purpose: cross-level matrix content.

Required fields:

familyId: string
rows: array of matrix row record

Matrix row record fields:

dimensionId: string
cells: array of matrix cell record

Matrix cell record fields:

levelId: string
summary: string
detail: array of string

The matrix must reference dimension ids and level ids. It must not duplicate dimension definitions or level identity data.

### sources.json

Purpose: source inventory and page rendering.

Required fields:

familyId: string
sourceGroups: array of source group
sources: array of source record

Source group fields:

id: string
name: string
summary: string
order: number

Source record fields:

id: string
groupId: string
title: string
author: string
publisher: string
publishedDate: string
url: string
sourceType: string
summary: string
relevance: string
notes: string optional

### author-notes.json

Purpose: your personal synthesis.

Required fields:

familyId: string
pageTitle: string
intro: array of paragraph strings
sections: array of author section record

Author section record fields:

id: string
title: string
content: array of paragraph strings

### exercises.json

Purpose: optional structured exercise library for current and future use.

Required fields:

familyId: string
exercises: array of exercise record

Exercise record fields:

id: string
levelId: string
title: string
summary: string
instructions: array of string
successCriteria: array of string
estimatedDifficulty: string

### glossary.json

Purpose: glossary terms.

Required fields:

familyId: string
terms: array of glossary record

Glossary record fields:

id: string
term: string
definition: string
relatedTerms: array of string
citationIds: array of string optional

### roadmap.json

Purpose: learning path and content roadmap.

Required fields:

familyId: string
pageTitle: string
summary: string
learningStages: array of roadmap stage
futureExpansions: array of future expansion record

Roadmap stage fields:

id: string
title: string
summary: string
recommendedLevelIds: array of string
suggestedActivities: array of string

Future expansion record fields:

id: string
title: string
summary: string
status: string

## TypeScript Type Definitions

The coding agent must create matching interfaces under:

src/scripts/types/

Required files:

site.ts
family.ts
level.ts
dimension.ts
source.ts
exercise.ts
glossary.ts
navigation.ts
matrix.ts
roadmap.ts

These interfaces must map directly to the JSON schema above.

## Template Responsibilities

### base.html

Global shell. Includes head, header, nav, footer, and content slot.

### landing.html

Used for the AI Coding home page.

### family-home.html

Used for the Claude Code Competence family landing page.

### article.html

Used for overview, dimensions, author perspective, glossary, and roadmap pages.

### matrix.html

Used for the matrix page.

### source-list.html

Used for the sources page.

### home.html

Page template definition for the AI Coding landing page.

### family-overview.html

Template wrapper for overview content.

### level-detail.html

Used to render each level page.

### dimensions.html

Used to render dimensions.

### sources.html

Used to render grouped sources.

### glossary.html

Used to render glossary terms.

### roadmap.html

Used to render learning progression.

## Partial Responsibilities

### head.html

Injects SEO title, description, canonical URL, stylesheet links, and social meta.

### header.html

Top site header and brand identity.

### nav.html

Primary nav and family nav.

### footer.html

Footer rendering.

### breadcrumbs.html

Path context for family pages.

### citation-list.html

Displays linked citations for a page or section.

### level-card.html

Reusable compact card for the five level ladder and related listings.

### matrix-table.html

Renders matrix rows and cells.

### source-card.html

Renders source entries.

### quote-block.html

Optional support for short quotations or framing statements.

## Rendering Pipeline

The site build must follow this order.

1. Load all site-level JSON files.
2. Load family JSON files for Claude Code Competence.
3. Validate all JSON data against TypeScript-backed runtime validation rules.
4. Build a normalized page model in memory.
5. Render HTML pages from templates plus normalized data.
6. Copy static assets into docs/assets/.
7. Compile TypeScript into browser JavaScript and place it under docs/assets/js/.
8. Copy CSS into docs/assets/css/.
9. Write final HTML pages into docs/ at the target paths.
10. Emit a validation report to the console.

## Build Scripts

The coding agent must provide npm scripts or equivalent.

Required scripts:

build
Cleans previous output, validates data, renders pages, compiles TypeScript, copies assets, and writes docs/.

clean
Deletes generated output.

validate
Validates JSON data and template references without full build.

dev
Runs a local static preview server against docs/ after build or via watch mode.

watch
Optional. Rebuilds on source file change.

## Build Implementation Guidance

Use a lightweight Node plus TypeScript build flow.

Do not use a full SPA framework.
Do not use React, Next.js, or other client-heavy frameworks for the first release.
Use a minimal template rendering approach.
That may be a custom string-template renderer or a small build-friendly templating library.

The result must remain understandable to a coding agent and simple to maintain.

## Functional JavaScript or TypeScript Scope

The first release functional layer should be intentionally small.

Required behaviors:

1. Mobile navigation toggle.
2. Expand or collapse content blocks on matrix and level pages.
3. Matrix row filtering or toggling by dimension.
4. Citation expansion toggles if citations are hidden by default.
5. Active navigation highlighting.

Optional behaviors:

1. Remember expanded matrix rows in local storage.
2. Print mode helper button.
3. Highlight a selected self-assessed level.

All essential page content must remain readable if JavaScript fails.

## CSS Scope

Required CSS files:

tokens.css
Defines design tokens.

reset.css
Basic reset.

base.css
Global element styling.

typography.css
Headings, paragraphs, lists, links, blockquotes, tables.

layout.css
Containers, grids, responsive layout.

components.css
Cards, nav, breadcrumbs, matrix, source blocks, level ladder.

utilities.css
Utility classes.

print.css
Print-specific rules.

families/claude-code-competence.css
Family-specific accents only.

## First-Release Content Scope

The coding agent must implement the first release with real content for:

1. AI Coding site landing page
2. Claude Code Competence family landing page
3. Overview page
4. Dimensions page
5. Matrix page
6. Five level pages
7. Sources page
8. Author perspective page
9. Glossary page
10. Roadmap page

The coding agent may populate placeholder values only for:

1. Social preview image asset
2. Future family cards on the top-level landing page
3. Optional printable page

The Claude Code Competence content itself should be real and not placeholder text.

## Initial Content Seeding Requirements

The coding agent must seed levels.json, dimensions.json, matrix.json, sources.json, overview.json, and author-notes.json using the current Claude Code competence framework already defined.

The author perspective page must include:

1. Your statement that this is your view of Claude Code competence.
2. Your current self-assessment as mid-Level 4.
3. Your belief that AI infrastructure parallels data infrastructure.
4. Your view that this suggests partial readiness for Level 5.

This page must keep your synthesis distinct from sourced observations.

## URL and Slug Rules

Use lowercase kebab-case for all URL segments and slugs.

Required level slugs:

operator
structured-collaborator
environment-builder
workflow-engineer
agentic-systems-expert

## File Naming Rules

Use lowercase kebab-case for directories and JSON file names where directories are content-oriented.
Use lowercase camelCase or PascalCase only inside TypeScript identifiers.

## SEO Requirements

Each page must emit:

1. Unique title
2. Meta description
3. Canonical URL
4. Open Graph title
5. Open Graph description
6. Open Graph image fallback

Each page model should include page-level SEO fields or derive them from family and site defaults.

## Print Requirements

The site must support browser print cleanly.

At minimum, print.css must:

1. Remove navigation chrome that does not help print reading.
2. Preserve headings and section boundaries.
3. Avoid clipping or overflow in matrix layouts.
4. Expand collapsed content automatically in print.

## Deployment Requirements

The repository must support deployment through GitHub Pages.

Required deployment artifacts:

1. docs/ build output
2. CNAME file at repository root containing johnboen.com or relevant subdomain strategy
3. Relative asset references that still honor siteBasePath

The coding agent may optionally add a GitHub Actions workflow for build and publish, but that is not required for the first implementation.

## Validation Requirements

The build must fail when:

1. A required JSON field is missing.
2. A page references a missing level id, dimension id, or source id.
3. A nav href points to a page that is not generated.
4. A citation id is referenced but missing.
5. Duplicate ids occur within the same entity type.
6. A level order is not exactly 1 through 5.

## Minimal Testing Requirements

The coding agent must include at least lightweight verification covering:

1. Data validation pass
2. Successful build output generation
3. Presence of required output pages
4. Presence of generated CSS and JavaScript assets
5. Valid internal page link generation for main navigation and levels

## Phase Breakdown

### Phase 1

Set up repository, build tooling, template system, CSS structure, TypeScript type definitions, and data loaders.

### Phase 2

Create JSON content files and seed real Claude Code Competence content.

### Phase 3

Render all required pages and wire navigation.

### Phase 4

Add small JavaScript enhancements, print support, and validation improvements.

### Phase 5

Prepare deployment-ready docs/ output and README instructions.

## Acceptance Criteria

The first release is complete when:

1. The repository builds from source into docs/ without manual editing of generated files.
2. The site contains all required first-release pages.
3. All Claude Code Competence pages are generated from structured JSON data.
4. Styling is consistent across family pages.
5. The matrix page renders correctly on desktop and remains readable on mobile.
6. Level pages include all required sections.
7. Sources are grouped and rendered from sources.json.
8. Author perspective content is distinct from source-backed content.
9. The site can be hosted as static files under GitHub Pages or johnboen.com.
10. The architecture clearly supports adding four future AI Coding families with the same pattern.

## Suggested README Sections

The coding agent should create a README containing:

1. Project purpose
2. Repository layout
3. Build commands
4. Content file locations
5. Deployment model
6. How to add a new content family
7. How to add a new level or source
8. How to change siteBasePath for GitHub Pages versus custom domain deployment

## Future-Compatible Extension Points

The coding agent should leave clear extension points for:

1. Additional AI Coding families
2. Shared taxonomy pages across families
3. Reusable source library across multiple families
4. Downloadable printable artifacts
5. Search indexing
6. Side-by-side comparison pages across frameworks or tools

## Final Instruction to Coding Agent

Implement the first release as a clean static site generator project with structured data, shared templates, modular CSS, and a small TypeScript enhancement layer. Do not hard-code Claude Code Competence content inside page templates. Build the project so that the Claude Code Competence family is complete, publishable, and serves as the reusable pattern for the next four core HTML sets.
