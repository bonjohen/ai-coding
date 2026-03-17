import { existsSync } from 'fs';
import { join } from 'path';
import type { AllData, FamilyData } from './load-data.js';

export interface ValidationError {
  file: string;
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

function requireString(errors: ValidationError[], file: string, obj: Record<string, unknown>, field: string): void {
  if (typeof obj[field] !== 'string' || (obj[field] as string).trim() === '') {
    errors.push({ file, field, message: `Required string field "${field}" is missing or empty` });
  }
}

function requireArray(errors: ValidationError[], file: string, obj: Record<string, unknown>, field: string): void {
  if (!Array.isArray(obj[field])) {
    errors.push({ file, field, message: `Required array field "${field}" is missing or not an array` });
  }
}

function requireNumber(errors: ValidationError[], file: string, obj: Record<string, unknown>, field: string): void {
  if (typeof obj[field] !== 'number') {
    errors.push({ file, field, message: `Required number field "${field}" is missing or not a number` });
  }
}

function validateSiteData(data: AllData, errors: ValidationError[]): void {
  const site = data.site.site as Record<string, unknown>;
  for (const field of ['siteId', 'siteTitle', 'siteSubtitle', 'siteBasePath', 'siteUrl', 'authorName', 'repositoryUrl', 'customDomain', 'defaultLanguage', 'copyrightText']) {
    requireString(errors, 'site.json', site, field);
  }

  const seo = data.site.seo as Record<string, unknown>;
  for (const field of ['defaultTitle', 'defaultDescription', 'defaultOgImage']) {
    requireString(errors, 'seo.json', seo, field);
  }
  requireArray(errors, 'seo.json', seo, 'defaultKeywords');

  const nav = data.site.navigation as Record<string, unknown>;
  requireArray(errors, 'navigation.json', nav, 'primaryNav');
  requireArray(errors, 'navigation.json', nav, 'familyNav');

  const footer = data.site.footer as Record<string, unknown>;
  requireArray(errors, 'footer.json', footer, 'footerSections');
  requireString(errors, 'footer.json', footer, 'legalText');
}

function validateFamily(familyId: string, family: FamilyData, errors: ValidationError[]): void {
  const meta = family.family as Record<string, unknown>;
  for (const field of ['familyId', 'slug', 'title', 'shortTitle', 'summary', 'status', 'version', 'publishDate', 'updatedDate', 'owner', 'landingPath', 'rootPath', 'themeKey']) {
    requireString(errors, `${familyId}/family.json`, meta, field);
  }

  // Validate levels
  const levels = family.levels.levels;
  if (!Array.isArray(levels)) {
    errors.push({ file: `${familyId}/levels.json`, field: 'levels', message: 'levels must be an array' });
    return;
  }

  // Check level order is exactly 1-5
  const levelNumbers = levels.map(l => l.levelNumber).sort((a, b) => a - b);
  if (levelNumbers.length !== 5 || levelNumbers.join(',') !== '1,2,3,4,5') {
    errors.push({ file: `${familyId}/levels.json`, field: 'levelNumber', message: `Level order must be exactly 1-5, got: [${levelNumbers.join(', ')}]` });
  }

  // Collect valid IDs for cross-reference checking
  const levelIds = new Set(levels.map(l => l.id));
  const dimensionIds = new Set(family.dimensions.dimensions.map(d => d.id));
  const sourceIds = new Set(family.sources.sources.map(s => s.id));
  const sourceGroupIds = new Set(family.sources.sourceGroups.map(g => g.id));

  // Check for duplicate IDs
  checkDuplicates(errors, `${familyId}/levels.json`, 'levels', levels.map(l => l.id));
  checkDuplicates(errors, `${familyId}/dimensions.json`, 'dimensions', family.dimensions.dimensions.map(d => d.id));
  checkDuplicates(errors, `${familyId}/sources.json`, 'sources', family.sources.sources.map(s => s.id));
  checkDuplicates(errors, `${familyId}/sources.json`, 'sourceGroups', family.sources.sourceGroups.map(g => g.id));

  // Validate each level's required fields
  for (const level of levels) {
    const prefix = `${familyId}/levels.json[${level.id}]`;
    const l = level as Record<string, unknown>;
    for (const field of ['id', 'slug', 'title', 'shortLabel', 'summary']) {
      requireString(errors, prefix, l, field);
    }
    requireNumber(errors, prefix, l, 'levelNumber');
    for (const field of ['definition', 'coreConcepts', 'coreSkills', 'observableBehaviors', 'failureModes', 'graduationCriteria', 'evaluationTasks', 'learningEmphasis', 'relatedDimensionIds', 'citationIds']) {
      requireArray(errors, prefix, l, field);
    }

    // Validate graduationCriteria objects
    if (Array.isArray(level.graduationCriteria)) {
      for (let i = 0; i < level.graduationCriteria.length; i++) {
        const gc = level.graduationCriteria[i] as Record<string, unknown>;
        if (typeof gc !== 'object' || gc === null) {
          errors.push({ file: prefix, field: `graduationCriteria[${i}]`, message: 'Must be an object with a "text" field' });
        } else {
          if (typeof gc.text !== 'string' || (gc.text as string).trim() === '') {
            errors.push({ file: prefix, field: `graduationCriteria[${i}].text`, message: 'Required string field "text" is missing or empty' });
          }
          if (gc.exampleFile !== undefined && typeof gc.exampleFile !== 'string') {
            errors.push({ file: prefix, field: `graduationCriteria[${i}].exampleFile`, message: 'exampleFile must be a string if provided' });
          }
        }
      }
    }

    // Cross-reference: relatedDimensionIds must exist
    for (const dimId of level.relatedDimensionIds) {
      if (!dimensionIds.has(dimId)) {
        errors.push({ file: prefix, field: 'relatedDimensionIds', message: `Dimension ID "${dimId}" not found in dimensions.json` });
      }
    }

    // Cross-reference: citationIds must exist in sources
    for (const citId of level.citationIds) {
      if (!sourceIds.has(citId)) {
        errors.push({ file: prefix, field: 'citationIds', message: `Citation/source ID "${citId}" not found in sources.json` });
      }
    }

    // Cross-reference: previousLevelId and nextLevelId
    if (level.previousLevelId && !levelIds.has(level.previousLevelId)) {
      errors.push({ file: prefix, field: 'previousLevelId', message: `Level ID "${level.previousLevelId}" not found` });
    }
    if (level.nextLevelId && !levelIds.has(level.nextLevelId)) {
      errors.push({ file: prefix, field: 'nextLevelId', message: `Level ID "${level.nextLevelId}" not found` });
    }
  }

  // Validate dimensions
  for (const dim of family.dimensions.dimensions) {
    const prefix = `${familyId}/dimensions.json[${dim.id}]`;
    const d = dim as Record<string, unknown>;
    for (const field of ['id', 'slug', 'name', 'shortName', 'summary', 'definition', 'whyItMatters']) {
      requireString(errors, prefix, d, field);
    }
    requireNumber(errors, prefix, d, 'order');
    requireArray(errors, prefix, d, 'assessmentQuestions');
  }

  // Validate matrix cross-references
  for (const row of family.matrix.rows) {
    if (!dimensionIds.has(row.dimensionId)) {
      errors.push({ file: `${familyId}/matrix.json`, field: 'dimensionId', message: `Dimension ID "${row.dimensionId}" not found in dimensions.json` });
    }
    for (const cell of row.cells) {
      if (!levelIds.has(cell.levelId)) {
        errors.push({ file: `${familyId}/matrix.json`, field: 'levelId', message: `Level ID "${cell.levelId}" not found in levels.json` });
      }
    }
  }

  // Validate source group references
  for (const source of family.sources.sources) {
    if (!sourceGroupIds.has(source.groupId)) {
      errors.push({ file: `${familyId}/sources.json`, field: 'groupId', message: `Source group ID "${source.groupId}" not found` });
    }
  }

  // Validate glossary
  for (const term of family.glossary.terms) {
    const prefix = `${familyId}/glossary.json[${term.id}]`;
    const t = term as Record<string, unknown>;
    for (const field of ['id', 'term', 'definition']) {
      requireString(errors, prefix, t, field);
    }
    requireArray(errors, prefix, t, 'relatedTerms');
  }

  // Validate roadmap level references
  for (const stage of family.roadmap.learningStages) {
    for (const levelId of stage.recommendedLevelIds) {
      if (!levelIds.has(levelId)) {
        errors.push({ file: `${familyId}/roadmap.json`, field: 'recommendedLevelIds', message: `Level ID "${levelId}" not found in levels.json` });
      }
    }
  }

  // Validate quiz questions (optional file)
  if (family.quizQuestions) {
    const questionIds = family.quizQuestions.questions.map(q => q.id);
    checkDuplicates(errors, `${familyId}/quiz-questions.json`, 'questions', questionIds);

    for (const q of family.quizQuestions.questions) {
      const prefix = `${familyId}/quiz-questions.json[${q.id}]`;
      if (!dimensionIds.has(q.dimensionId)) {
        errors.push({ file: prefix, field: 'dimensionId', message: `Dimension ID "${q.dimensionId}" not found` });
      }
      if (!levelIds.has(q.levelId)) {
        errors.push({ file: prefix, field: 'levelId', message: `Level ID "${q.levelId}" not found` });
      }
      if (!q.text || typeof q.text !== 'string') {
        errors.push({ file: prefix, field: 'text', message: 'Question text is required' });
      }
      if (!Array.isArray(q.choices) || q.choices.length < 2) {
        errors.push({ file: prefix, field: 'choices', message: 'At least 2 choices required' });
      }
    }
  }

  // Validate example projects (optional file)
  if (family.exampleProjects) {
    const projectIds = family.exampleProjects.projects.map(p => p.id);
    checkDuplicates(errors, `${familyId}/example-projects.json`, 'projects', projectIds);

    for (const p of family.exampleProjects.projects) {
      const prefix = `${familyId}/example-projects.json[${p.id}]`;
      if (!levelIds.has(p.levelId)) {
        errors.push({ file: prefix, field: 'levelId', message: `Level ID "${p.levelId}" not found` });
      }
      if (!p.title || typeof p.title !== 'string') {
        errors.push({ file: prefix, field: 'title', message: 'Project title is required' });
      }
      if (!Array.isArray(p.sections) || p.sections.length === 0) {
        errors.push({ file: prefix, field: 'sections', message: 'At least one section required' });
      }
      for (const prereq of p.prerequisites) {
        if (!projectIds.includes(prereq)) {
          errors.push({ file: prefix, field: 'prerequisites', message: `Prerequisite project "${prereq}" not found` });
        }
      }
    }
  }
}

function checkDuplicates(errors: ValidationError[], file: string, entityType: string, ids: string[]): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      errors.push({ file, field: entityType, message: `Duplicate ID "${id}" in ${entityType}` });
    }
    seen.add(id);
  }
}

function validateNavHrefs(data: AllData, generatedPaths: Set<string>, errors: ValidationError[]): void {
  const allNavItems = [
    ...data.site.navigation.primaryNav,
    ...data.site.navigation.familyNav.flatMap(g => g.items),
  ];
  for (const item of allNavItems) {
    if (!generatedPaths.has(item.href)) {
      errors.push({ file: 'navigation.json', field: 'href', message: `Nav href "${item.href}" does not match any generated page` });
    }
  }
}

export function validateAllData(data: AllData, generatedPaths?: Set<string>): ValidationResult {
  const errors: ValidationError[] = [];

  validateSiteData(data, errors);

  for (const [familyId, familyData] of data.families) {
    validateFamily(familyId, familyData, errors);
  }

  if (generatedPaths) {
    validateNavHrefs(data, generatedPaths, errors);
  }

  return { valid: errors.length === 0, errors };
}
