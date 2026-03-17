export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  relatedTerms: string[];
  citationIds?: string[];
}

export interface GlossaryConfig {
  familyId: string;
  terms: GlossaryTerm[];
}
