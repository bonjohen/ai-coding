export interface Dimension {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  definition: string;
  whyItMatters: string;
  assessmentQuestions: string[];
  order: number;
}

export interface DimensionsConfig {
  familyId: string;
  dimensions: Dimension[];
}
