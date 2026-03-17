export interface FamilyMeta {
  familyId: string;
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  status: string;
  version: string;
  publishDate: string;
  updatedDate: string;
  owner: string;
  landingPath: string;
  rootPath: string;
  themeKey: string;
  introQuote?: string;
}

export interface OverviewConfig {
  familyId: string;
  heroTitle: string;
  heroSummary: string;
  purpose: string[];
  whatThisIs: string[];
  howToUseThisFramework: string[];
  levelSummaries: LevelSummary[];
}

export interface LevelSummary {
  levelId: string;
  levelNumber: number;
  title: string;
  shortLabel: string;
  summary: string;
  href: string;
}

export interface AuthorNotesConfig {
  familyId: string;
  pageTitle: string;
  intro: string[];
  sections: AuthorSection[];
}

export interface AuthorSection {
  id: string;
  title: string;
  content: string[];
}
