export interface Exercise {
  id: string;
  levelId: string;
  title: string;
  summary: string;
  instructions: string[];
  successCriteria: string[];
  estimatedDifficulty: string;
}

export interface ExercisesConfig {
  familyId: string;
  exercises: Exercise[];
}
