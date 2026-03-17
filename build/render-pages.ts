import { join } from 'path';
import { loadTemplate, applyLayout, renderTemplate, type TemplateContext } from './template-engine.js';
import type { AllData, FamilyData } from './load-data.js';

export interface PageOutput {
  /** Relative path under docs/, e.g. "ai-coding/index.html" */
  outputPath: string;
  html: string;
}

interface PageDef {
  outputPath: string;
  layout: string;
  page: string;
  context: TemplateContext;
}

function buildBaseContext(data: AllData): TemplateContext {
  return {
    site: data.site.site,
    seo: data.site.seo,
    navigation: data.site.navigation,
    footer: data.site.footer,
    basePath: data.site.site.siteBasePath,
    _partialsDir: '', // Set at render time
  };
}

// Map level slugs to image filenames
const levelImageMap: Record<string, string> = {
  'operator': 'level-operator.svg',
  'structured-collaborator': 'level-structured-collaborator.svg',
  'environment-builder': 'level-environment-builder.svg',
  'workflow-engineer': 'level-workflow-engineer.svg',
  'agentic-systems-expert': 'level-agentic-systems-expert.svg',
};

// Map dimension slugs to image filenames
const dimImageMap: Record<string, string> = {
  'conceptual-understanding': 'conceptual_understanding.svg',
  'task-framing': 'task_framing.svg',
  'verification-discipline': 'verification_discipline.svg',
  'context-management': 'context_management.svg',
  'environment-design': 'environmental_design.svg',
  'workflow-scaling': 'workflow_scaling.svg',
  'safety-governance': 'safety_and_governance.svg',
};

function buildFamilyContext(data: AllData, family: FamilyData): TemplateContext {
  return {
    ...buildBaseContext(data),
    family: family.family,
    overview: family.overview,
    levels: family.levels,
    dimensions: family.dimensions,
    matrix: family.matrix,
    sources: family.sources,
    authorNotes: family.authorNotes,
    glossary: family.glossary,
    roadmap: family.roadmap,
    exercises: family.exercises,
  };
}

function collectPageDefs(data: AllData): PageDef[] {
  const basePath = data.site.site.siteBasePath.replace(/^\/|\/$/g, '');
  const pages: PageDef[] = [];

  // Top-level landing page
  pages.push({
    outputPath: `${basePath}/index.html`,
    layout: 'landing',
    page: 'home',
    context: {
      ...buildBaseContext(data),
      pageTitle: data.site.site.siteTitle,
      pageDescription: data.site.seo.defaultDescription,
      canonicalUrl: `${data.site.site.siteUrl}/${basePath}/`,
      families: Array.from(data.families.values()).map(f => f.family),
    },
  });

  // Family pages
  for (const [_familyId, family] of data.families) {
    const familyBase = `${basePath}/${family.family.slug}`;
    const familyCtx = buildFamilyContext(data, family);

    // Enrich level summaries with images for overview/landing pages
    const levelSummariesWithImages = family.overview.levelSummaries.map(ls => {
      const level = family.levels.levels.find(l => l.id === ls.levelId);
      const slug = level?.slug || '';
      return {
        ...ls,
        image: levelImageMap[slug]
          ? `${data.site.site.siteBasePath}assets/images/levels/${levelImageMap[slug]}`
          : null,
      };
    });
    const overviewWithImages = { ...family.overview, levelSummaries: levelSummariesWithImages };

    // Family landing
    pages.push({
      outputPath: `${familyBase}/index.html`,
      layout: 'family-home',
      page: 'family-overview',
      context: {
        ...familyCtx,
        overview: overviewWithImages,
        hasCertifications: !!family.certifications,
        certTotalExams: family.certifications?.exams.length || 0,
        certProviderCount: family.certifications?.providers.length || 0,
        certHref: `/${familyBase}/certifications/`,
        pageTitle: family.family.title,
        pageDescription: family.family.summary,
        canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/`,
        breadcrumbs: [
          { label: 'Home', href: `/${basePath}/` },
          { label: family.family.shortTitle, href: '' },
        ],
      },
    });

    // Overview
    pages.push({
      outputPath: `${familyBase}/overview/index.html`,
      layout: 'article',
      page: 'family-overview',
      context: {
        ...familyCtx,
        overview: overviewWithImages,
        pageTitle: `Overview — ${family.family.shortTitle}`,
        pageDescription: family.overview.heroSummary,
        canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/overview/`,
        breadcrumbs: [
          { label: 'Home', href: `/${basePath}/` },
          { label: family.family.shortTitle, href: `/${familyBase}/` },
          { label: 'Overview', href: '' },
        ],
      },
    });

    // Dimensions — enrich with image paths
    const dimensionsWithImages = {
      ...family.dimensions,
      dimensions: family.dimensions.dimensions.map(d => ({
        ...d,
        image: dimImageMap[d.slug]
          ? `${data.site.site.siteBasePath}assets/images/dims/${dimImageMap[d.slug]}`
          : null,
      })),
    };

    pages.push({
      outputPath: `${familyBase}/dimensions/index.html`,
      layout: 'article',
      page: 'dimensions',
      context: {
        ...familyCtx,
        dimensions: dimensionsWithImages,
        pageTitle: `Dimensions — ${family.family.shortTitle}`,
        pageDescription: 'Cross-level evaluation dimensions for the competence framework.',
        canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/dimensions/`,
        breadcrumbs: [
          { label: 'Home', href: `/${basePath}/` },
          { label: family.family.shortTitle, href: `/${familyBase}/` },
          { label: 'Dimensions', href: '' },
        ],
      },
    });

    // Matrix — enrich rows with dimension display names
    const dimLookup = new Map(family.dimensions.dimensions.map(d => [d.id, d.name]));
    const enrichedMatrix = {
      ...family.matrix,
      rows: family.matrix.rows.map(row => ({
        ...row,
        dimensionName: dimLookup.get(row.dimensionId) || row.dimensionId,
      })),
    };

    pages.push({
      outputPath: `${familyBase}/matrix/index.html`,
      layout: 'matrix',
      page: 'matrix',
      context: {
        ...familyCtx,
        matrix: enrichedMatrix,
        pageTitle: `Competency Matrix — ${family.family.shortTitle}`,
        pageDescription: 'Full competency matrix: dimensions vs. levels.',
        canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/matrix/`,
        breadcrumbs: [
          { label: 'Home', href: `/${basePath}/` },
          { label: family.family.shortTitle, href: `/${familyBase}/` },
          { label: 'Matrix', href: '' },
        ],
      },
    });

    // Level pages
    for (const level of family.levels.levels) {
      const prevLevel = family.levels.levels.find(l => l.id === level.previousLevelId);
      const nextLevel = family.levels.levels.find(l => l.id === level.nextLevelId);

      // Resolve related dimensions to full objects for display
      const levelDimensions = level.relatedDimensionIds
        .map(dimId => family.dimensions.dimensions.find(d => d.id === dimId))
        .filter(Boolean);

      // Resolve citation IDs to full source objects
      const levelCitations = level.citationIds
        .map(srcId => family.sources.sources.find(s => s.id === srcId))
        .filter(Boolean);

      // Filter exercises for this level
      const levelExercises = family.exercises.exercises.filter(e => e.levelId === level.id);

      // Level image path
      const levelImage = levelImageMap[level.slug]
        ? `${data.site.site.siteBasePath}assets/images/levels/${levelImageMap[level.slug]}`
        : null;

      pages.push({
        outputPath: `${familyBase}/levels/${level.slug}/index.html`,
        layout: 'article',
        page: 'level-detail',
        context: {
          ...familyCtx,
          level,
          prevLevel: prevLevel || null,
          nextLevel: nextLevel || null,
          levelDimensions,
          levelCitations,
          levelExercises,
          levelImage,
          pageTitle: `Level ${level.levelNumber}: ${level.title} — ${family.family.shortTitle}`,
          pageDescription: level.summary,
          canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/levels/${level.slug}/`,
          breadcrumbs: [
            { label: 'Home', href: `/${basePath}/` },
            { label: family.family.shortTitle, href: `/${familyBase}/` },
            { label: 'Levels', href: `/${familyBase}/` },
            { label: level.shortLabel, href: '' },
          ],
        },
      });
    }

    // Sources — pre-group sources by sourceGroup for template rendering
    const groupedSources = family.sources.sourceGroups
      .sort((a, b) => a.order - b.order)
      .map(group => ({
        ...group,
        sources: family.sources.sources.filter(s => s.groupId === group.id),
      }));

    pages.push({
      outputPath: `${familyBase}/sources/index.html`,
      layout: 'source-list',
      page: 'sources',
      context: {
        ...familyCtx,
        groupedSources,
        pageTitle: `Sources — ${family.family.shortTitle}`,
        pageDescription: 'Source inventory for the competence framework.',
        canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/sources/`,
        breadcrumbs: [
          { label: 'Home', href: `/${basePath}/` },
          { label: family.family.shortTitle, href: `/${familyBase}/` },
          { label: 'Sources', href: '' },
        ],
      },
    });

    // Author perspective
    pages.push({
      outputPath: `${familyBase}/author-perspective/index.html`,
      layout: 'article',
      page: 'author-perspective',
      context: {
        ...familyCtx,
        pageTitle: `Author Perspective — ${family.family.shortTitle}`,
        pageDescription: 'Personal synthesis and interpretation of the framework.',
        canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/author-perspective/`,
        breadcrumbs: [
          { label: 'Home', href: `/${basePath}/` },
          { label: family.family.shortTitle, href: `/${familyBase}/` },
          { label: 'Author Perspective', href: '' },
        ],
      },
    });

    // Glossary
    pages.push({
      outputPath: `${familyBase}/glossary/index.html`,
      layout: 'article',
      page: 'glossary',
      context: {
        ...familyCtx,
        pageTitle: `Glossary — ${family.family.shortTitle}`,
        pageDescription: 'Key terms and definitions.',
        canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/glossary/`,
        breadcrumbs: [
          { label: 'Home', href: `/${basePath}/` },
          { label: family.family.shortTitle, href: `/${familyBase}/` },
          { label: 'Glossary', href: '' },
        ],
      },
    });

    // Roadmap
    pages.push({
      outputPath: `${familyBase}/roadmap/index.html`,
      layout: 'article',
      page: 'roadmap',
      context: {
        ...familyCtx,
        pageTitle: `Roadmap — ${family.family.shortTitle}`,
        pageDescription: 'Learning path and future expansion notes.',
        canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/roadmap/`,
        breadcrumbs: [
          { label: 'Home', href: `/${basePath}/` },
          { label: family.family.shortTitle, href: `/${familyBase}/` },
          { label: 'Roadmap', href: '' },
        ],
      },
    });

    // Self-Assessment page
    if (family.quizQuestions) {
      const assessmentQuestions = family.quizQuestions.questions.filter(q => q.type === 'self-rate');
      const assessmentDimensions = family.dimensions.dimensions
        .sort((a, b) => a.order - b.order)
        .map(d => ({
          ...d,
          questions: assessmentQuestions.filter(q => q.dimensionId === d.id),
        }));
      const dimensionsMeta = family.dimensions.dimensions
        .sort((a, b) => a.order - b.order)
        .map(d => ({ id: d.id, name: d.name, shortName: d.shortName, summary: d.summary }));

      pages.push({
        outputPath: `${familyBase}/assess/index.html`,
        layout: 'article',
        page: 'self-assessment',
        context: {
          ...familyCtx,
          assessmentDimensions,
          assessmentDataJson: JSON.stringify(assessmentQuestions),
          dimensionsMetaJson: JSON.stringify(dimensionsMeta),
          pageTitle: `Self-Assessment — ${family.family.shortTitle}`,
          pageDescription: 'Evaluate your Claude Code competence across 7 dimensions.',
          canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/assess/`,
          breadcrumbs: [
            { label: 'Home', href: `/${basePath}/` },
            { label: family.family.shortTitle, href: `/${familyBase}/` },
            { label: 'Self-Assessment', href: '' },
          ],
        },
      });
    }

    // Quiz page
    if (family.quizQuestions) {
      const allQuestions = family.quizQuestions.questions;
      const quizLevels = family.levels.levels.map(l => ({
        id: l.id, title: l.title, shortLabel: l.shortLabel, levelNumber: l.levelNumber, slug: l.slug,
      }));
      const quizDimensions = family.dimensions.dimensions
        .sort((a, b) => a.order - b.order)
        .map(d => ({ id: d.id, name: d.name, shortName: d.shortName }));

      pages.push({
        outputPath: `${familyBase}/quiz/index.html`,
        layout: 'article',
        page: 'quiz',
        context: {
          ...familyCtx,
          allQuestions,
          quizDataJson: JSON.stringify(allQuestions),
          quizDimensionsJson: JSON.stringify(quizDimensions),
          quizLevelsJson: JSON.stringify(quizLevels),
          pageTitle: `Practice Quiz — ${family.family.shortTitle}`,
          pageDescription: 'Test your Claude Code knowledge with random questions.',
          canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/quiz/`,
          breadcrumbs: [
            { label: 'Home', href: `/${basePath}/` },
            { label: family.family.shortTitle, href: `/${familyBase}/` },
            { label: 'Quiz', href: '' },
          ],
        },
      });
    }

    // Project gallery and detail pages
    if (family.exampleProjects) {
      const projectsByLevel = family.levels.levels.map(l => ({
        level: l,
        projects: family.exampleProjects!.projects.filter(p => p.levelId === l.id),
        levelImage: levelImageMap[l.slug]
          ? `${data.site.site.siteBasePath}assets/images/levels/${levelImageMap[l.slug]}`
          : null,
      }));

      pages.push({
        outputPath: `${familyBase}/projects/index.html`,
        layout: 'article',
        page: 'project-gallery',
        context: {
          ...familyCtx,
          projectsByLevel,
          pageTitle: `Example Projects — ${family.family.shortTitle}`,
          pageDescription: 'Step-by-step walkthroughs demonstrating Claude Code competence at each level.',
          canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/projects/`,
          breadcrumbs: [
            { label: 'Home', href: `/${basePath}/` },
            { label: family.family.shortTitle, href: `/${familyBase}/` },
            { label: 'Projects', href: '' },
          ],
        },
      });

      for (const project of family.exampleProjects.projects) {
        const slug = project.id.replace(/^proj-\d+-/, '');
        const level = family.levels.levels.find(l => l.id === project.levelId);
        pages.push({
          outputPath: `${familyBase}/projects/${slug}/index.html`,
          layout: 'article',
          page: 'project-detail',
          context: {
            ...familyCtx,
            project,
            projectLevel: level,
            pageTitle: `${project.title} — ${family.family.shortTitle}`,
            pageDescription: project.summary,
            canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/projects/${slug}/`,
            breadcrumbs: [
              { label: 'Home', href: `/${basePath}/` },
              { label: family.family.shortTitle, href: `/${familyBase}/` },
              { label: 'Projects', href: `/${familyBase}/projects/` },
              { label: project.title, href: '' },
            ],
          },
        });
      }
    }

    // Certification pages
    if (family.certifications) {
      const cert = family.certifications;
      const certBase = `${familyBase}/certifications`;

      // Group exams by provider
      const examsByProvider = cert.providers.map(p => ({
        provider: p,
        exams: cert.exams.filter(e => e.providerId === p.id),
      }));

      // Certification landing page
      pages.push({
        outputPath: `${certBase}/index.html`,
        layout: 'article',
        page: 'cert-landing',
        context: {
          ...familyCtx,
          certProviders: cert.providers,
          examsByProvider,
          totalExams: cert.exams.length,
          certBasePath: `/${certBase}/`,
          pageTitle: `Cloud Certifications — ${family.family.shortTitle}`,
          pageDescription: 'Scenario-based quiz practice for Azure, AWS, and Google Cloud certification exams.',
          canonicalUrl: `${data.site.site.siteUrl}/${certBase}/`,
          breadcrumbs: [
            { label: 'Home', href: `/${basePath}/` },
            { label: family.family.shortTitle, href: `/${familyBase}/` },
            { label: 'Certifications', href: '' },
          ],
        },
      });

      // Per-provider pages
      for (const { provider, exams } of examsByProvider) {
        pages.push({
          outputPath: `${certBase}/${provider.slug}/index.html`,
          layout: 'article',
          page: 'cert-provider',
          context: {
            ...familyCtx,
            certProvider: provider,
            certExams: exams,
            certBasePath: `/${certBase}/`,
            quizHref: `/${certBase}/quiz/`,
            pageTitle: `${provider.name} Certifications — ${family.family.shortTitle}`,
            pageDescription: `Practice ${exams.length} ${provider.name} certification exams with scenario-based questions.`,
            canonicalUrl: `${data.site.site.siteUrl}/${certBase}/${provider.slug}/`,
            breadcrumbs: [
              { label: 'Home', href: `/${basePath}/` },
              { label: family.family.shortTitle, href: `/${familyBase}/` },
              { label: 'Certifications', href: `/${certBase}/` },
              { label: provider.name, href: '' },
            ],
          },
        });
      }

      // Quiz page (single page, receives ?exam= param)
      pages.push({
        outputPath: `${certBase}/quiz/index.html`,
        layout: 'article',
        page: 'cert-quiz',
        context: {
          ...familyCtx,
          certManifestJson: JSON.stringify({ providers: cert.providers, exams: cert.exams }),
          certDataBase: `${data.site.site.siteBasePath}${family.family.slug}/certification-data/`,
          certBackHref: `/${certBase}/`,
          pageTitle: `Certification Quiz — ${family.family.shortTitle}`,
          pageDescription: 'Interactive certification exam practice with progressive hints and progress tracking.',
          canonicalUrl: `${data.site.site.siteUrl}/${certBase}/quiz/`,
          breadcrumbs: [
            { label: 'Home', href: `/${basePath}/` },
            { label: family.family.shortTitle, href: `/${familyBase}/` },
            { label: 'Certifications', href: `/${certBase}/` },
            { label: 'Quiz', href: '' },
          ],
        },
      });
    }

    // Study guide page
    const studyDimensions = family.dimensions.dimensions
      .sort((a, b) => a.order - b.order)
      .map(d => ({ id: d.id, name: d.name, shortName: d.shortName, slug: d.slug }));
    const studyLevels = family.levels.levels.map(l => ({
      id: l.id, title: l.title, shortLabel: l.shortLabel, levelNumber: l.levelNumber, slug: l.slug,
    }));

    pages.push({
      outputPath: `${familyBase}/study-guide/index.html`,
      layout: 'article',
      page: 'study-guide',
      context: {
        ...familyCtx,
        studyDimensionsJson: JSON.stringify(studyDimensions),
        studyLevelsJson: JSON.stringify(studyLevels),
        pageTitle: `Study Guide — ${family.family.shortTitle}`,
        pageDescription: 'Personalized study recommendations based on your assessment and quiz results.',
        canonicalUrl: `${data.site.site.siteUrl}/${familyBase}/study-guide/`,
        breadcrumbs: [
          { label: 'Home', href: `/${basePath}/` },
          { label: family.family.shortTitle, href: `/${familyBase}/` },
          { label: 'Study Guide', href: '' },
        ],
      },
    });
  }

  return pages;
}

export function getGeneratedPaths(data: AllData): Set<string> {
  const pages = collectPageDefs(data);
  const basePath = data.site.site.siteBasePath;
  return new Set(pages.map(p => {
    // Convert "ai-coding/claude-code-competence/index.html" -> "/ai-coding/claude-code-competence/"
    const path = p.outputPath.replace(/index\.html$/, '');
    return `/${path}`;
  }));
}

export function renderAllPages(data: AllData, templatesDir: string): PageOutput[] {
  const layoutsDir = join(templatesDir, 'layouts');
  const pagesDir = join(templatesDir, 'pages');
  const partialsDir = join(templatesDir, 'partials');

  const pageDefs = collectPageDefs(data);
  const outputs: PageOutput[] = [];

  for (const pageDef of pageDefs) {
    const layoutTemplate = loadTemplate(join(layoutsDir, `${pageDef.layout}.html`));
    const pageTemplate = loadTemplate(join(pagesDir, `${pageDef.page}.html`));

    const context: TemplateContext = {
      ...pageDef.context,
      _partialsDir: partialsDir,
    };

    // Render page template first to extract blocks
    const renderedPage = renderTemplate(pageTemplate, context);

    // Apply layout with page blocks
    const html = applyLayout(layoutTemplate, renderedPage, context);

    outputs.push({ outputPath: pageDef.outputPath, html });
  }

  return outputs;
}
