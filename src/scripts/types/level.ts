export interface Level {
  id: string;
  slug: string;
  levelNumber: number;
  title: string;
  shortLabel: string;
  summary: string;
  definition: string[];
  coreConcepts: ConceptRecord[];
  coreSkills: SkillRecord[];
  observableBehaviors: string[];
  failureModes: string[];
  graduationCriteria: string[];
  evaluationTasks: TaskRecord[];
  learningEmphasis: string[];
  relatedDimensionIds: string[];
  citationIds: string[];
  previousLevelId?: string;
  nextLevelId?: string;
  personalNote?: string[];
}

export interface ConceptRecord {
  id: string;
  name: string;
  definition: string;
}

export interface SkillRecord {
  id: string;
  name: string;
  definition: string;
  observableEvidence: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  description: string;
  successCriteria: string[];
}

export interface LevelsConfig {
  familyId: string;
  levels: Level[];
}
