import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import type { SiteConfig, SeoConfig, FooterConfig } from '../src/scripts/types/site.js';
import type { NavigationConfig } from '../src/scripts/types/navigation.js';
import type { FamilyMeta, OverviewConfig, AuthorNotesConfig } from '../src/scripts/types/family.js';
import type { LevelsConfig } from '../src/scripts/types/level.js';
import type { DimensionsConfig } from '../src/scripts/types/dimension.js';
import type { MatrixConfig } from '../src/scripts/types/matrix.js';
import type { SourcesConfig } from '../src/scripts/types/source.js';
import type { GlossaryConfig } from '../src/scripts/types/glossary.js';
import type { ExercisesConfig } from '../src/scripts/types/exercise.js';
import type { RoadmapConfig } from '../src/scripts/types/roadmap.js';

export interface SiteData {
  site: SiteConfig;
  navigation: NavigationConfig;
  footer: FooterConfig;
  seo: SeoConfig;
}

export interface FamilyData {
  family: FamilyMeta;
  overview: OverviewConfig;
  levels: LevelsConfig;
  dimensions: DimensionsConfig;
  matrix: MatrixConfig;
  sources: SourcesConfig;
  authorNotes: AuthorNotesConfig;
  exercises: ExercisesConfig;
  glossary: GlossaryConfig;
  roadmap: RoadmapConfig;
}

export interface AllData {
  site: SiteData;
  families: Map<string, FamilyData>;
}

function loadJson<T>(filePath: string): T {
  if (!existsSync(filePath)) {
    throw new Error(`Required data file not found: ${filePath}`);
  }
  const raw = readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    throw new Error(`Invalid JSON in ${filePath}: ${(e as Error).message}`);
  }
}

export function loadSiteData(dataDir: string): SiteData {
  const siteDir = join(dataDir, 'site');
  return {
    site: loadJson<SiteConfig>(join(siteDir, 'site.json')),
    navigation: loadJson<NavigationConfig>(join(siteDir, 'navigation.json')),
    footer: loadJson<FooterConfig>(join(siteDir, 'footer.json')),
    seo: loadJson<SeoConfig>(join(siteDir, 'seo.json')),
  };
}

export function loadFamilyData(familyDir: string): FamilyData {
  return {
    family: loadJson<FamilyMeta>(join(familyDir, 'family.json')),
    overview: loadJson<OverviewConfig>(join(familyDir, 'overview.json')),
    levels: loadJson<LevelsConfig>(join(familyDir, 'levels.json')),
    dimensions: loadJson<DimensionsConfig>(join(familyDir, 'dimensions.json')),
    matrix: loadJson<MatrixConfig>(join(familyDir, 'matrix.json')),
    sources: loadJson<SourcesConfig>(join(familyDir, 'sources.json')),
    authorNotes: loadJson<AuthorNotesConfig>(join(familyDir, 'author-notes.json')),
    exercises: loadJson<ExercisesConfig>(join(familyDir, 'exercises.json')),
    glossary: loadJson<GlossaryConfig>(join(familyDir, 'glossary.json')),
    roadmap: loadJson<RoadmapConfig>(join(familyDir, 'roadmap.json')),
  };
}

export function loadAllData(dataDir: string): AllData {
  const siteData = loadSiteData(dataDir);
  const families = new Map<string, FamilyData>();

  const familiesDir = join(dataDir, 'families');
  if (existsSync(familiesDir)) {
    const familyDirs = readdirSync(familiesDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const dirName of familyDirs) {
      const familyDir = join(familiesDir, dirName);
      const familyData = loadFamilyData(familyDir);
      families.set(familyData.family.familyId, familyData);
    }
  }

  return { site: siteData, families };
}
