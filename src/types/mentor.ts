export interface StudentProfile {
  name?: string;
  year?: string;
  university?: string;
  major: string;
  strengths: string;
  weaknesses: string;
  skills: string;
  careerGoal: string;
  englishCert?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AcademicTrack {
  title: string;
  description?: string;
  electiveCourses: string[];
  languageCertificates: string[];
  professionalCertificates: string[];
  legalResearchSkills: string[];
}

export interface ExtracurricularTrack {
  title: string;
  description?: string;
  mootCourts: string[];
  clubsAndOrgs: string[];
  legalClinic: string;
  scientificResearch: string;
}

export interface CareerMilestone {
  period: string;
  targetOrg: string;
  actionPlan: string;
}

export interface CareerTrack {
  title: string;
  description?: string;
  internshipTimeline: CareerMilestone[];
  judicialAcademyGuidance: string;
  jobApplicationSkills: string[];
}

export interface RoadmapData {
  mentorSummary: string;
  academicTrack: AcademicTrack;
  extracurricularTrack: ExtracurricularTrack;
  careerTrack: CareerTrack;
  encouragementMessage: string;
  googleChatFormatText: string;
}

export interface IracCase {
  id: string;
  title: string;
  category: string;
  facts: string;
  suggestedIssueHint: string;
}

export interface IracEvaluation {
  overallScore: number;
  gradeLevel: string;
  generalComment: string;
  evaluation: {
    issueFeedback: string;
    ruleFeedback: string;
    applicationFeedback: string;
    conclusionFeedback: string;
  };
  modelAnswer: {
    idealIssue: string;
    idealRule: string;
    idealApplication: string;
    idealConclusion: string;
  };
  encouragement: string;
}
