
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Status = 'Todo' | 'InProgress' | 'Completed';
export type EnergyPreference = 'morning' | 'night';
export type Mood = 'Excited' | 'Happy' | 'Content' | 'Stressed' | 'Tired';

export interface AdaptivePlan {
  visualSchedule: { day: string; tasks: string[] }[];
  subjectBreakdown: { subject: string; hours: number; percentage: number; reasoning: string }[];
  actionableSteps: string[];
  progressLogic: string;
  summary: { completionTimeline: string; confidenceImprovement: string; workloadRiskReduction: string };
}

export interface User {
  id: string;
  name: string;
  email: string;
  branch: string;
  energyPreference: EnergyPreference;
  dailyStudyHours: number;
  studyHoursWeekend?: number;
  botPersona?: string;
  botKnowledgeBase?: string;
  studentId?: string;
  year?: number;
  phone?: string;
}

export interface Subject {
  id: string;
  userId: string;
  title: string;
  difficulty: Difficulty;
  examDate: string;
  priority: number; // 1-5
  color: string;
  credits?: number;
  confidenceLevel?: number; // 1-5
  gradePoints?: number;
  marksPercent?: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  estimatedHours: number;
  status: Status;
  weightage: number; // 1-10
  weaknessScore: number; // 1-10
}



export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: Mood;
  isPublic: boolean;
  tags: string[];
}

export interface Activity {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  credits: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface AttendanceRecord {
  id: string;
  date: string;
  subjectId: string;
  status: 'Present' | 'Absent';
  time: string;
}

export interface AppState {
  user: User | null;
  subjects: Subject[];
  topics: Topic[];

  diaryEntries: DiaryEntry[];
  activities: Activity[];
  attendance: AttendanceRecord[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
