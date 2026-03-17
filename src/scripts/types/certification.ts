export interface CertificationProvider {
  id: string;
  name: string;
  slug: string;
  brandColor: string;
  brandGradient: string;
  examCount: number;
}

export interface CertificationExam {
  id: string;
  slug: string;
  providerId: string;
  title: string;
  code: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionCount: number;
  categories: string[];
  dataFile: string;
}

export interface CertificationConfig {
  familyId: string;
  providers: CertificationProvider[];
  exams: CertificationExam[];
}
