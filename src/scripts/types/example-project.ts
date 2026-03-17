export interface ProjectSection {
  id: string;
  title: string;
  content: string[];
  codeSnippet: string | null;
  codeLanguage: string | null;
}

export interface ExampleProject {
  id: string;
  levelId: string;
  title: string;
  summary: string;
  scenario: string;
  sections: ProjectSection[];
  demonstratedSkills: string[];
  demonstratedConcepts: string[];
  estimatedTime: string;
  prerequisites: string[];
}

export interface ExampleProjectsConfig {
  familyId: string;
  projects: ExampleProject[];
}
