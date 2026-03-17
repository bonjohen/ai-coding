export interface RoadmapStage {
  id: string;
  title: string;
  summary: string;
  recommendedLevelIds: string[];
  suggestedActivities: string[];
}

export interface FutureExpansion {
  id: string;
  title: string;
  summary: string;
  status: string;
}

export interface RoadmapConfig {
  familyId: string;
  pageTitle: string;
  summary: string;
  learningStages: RoadmapStage[];
  futureExpansions: FutureExpansion[];
}
