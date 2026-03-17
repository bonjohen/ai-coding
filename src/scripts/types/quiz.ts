export interface QuizChoice {
  value: number;
  label: string;
}

export interface StudyLink {
  label: string;
  href: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'self-rate' | 'scenario' | 'knowledge' | 'behavior';
  choices: QuizChoice[];
  dimensionId: string;
  levelId: string;
  tags: string[];
  studyLinks: StudyLink[];
  explanation: string;
}

export interface QuizQuestionsConfig {
  familyId: string;
  questions: QuizQuestion[];
}
