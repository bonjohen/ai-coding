export interface SourceGroup {
  id: string;
  name: string;
  summary: string;
  order: number;
}

export interface SourceRecord {
  id: string;
  groupId: string;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  url: string;
  sourceType: string;
  summary: string;
  relevance: string;
  notes?: string;
}

export interface SourcesConfig {
  familyId: string;
  sourceGroups: SourceGroup[];
  sources: SourceRecord[];
}
