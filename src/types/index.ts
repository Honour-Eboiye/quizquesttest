
export interface User {
  name: string;
  email: string;
  password: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
}

export interface QuizAnswer {
  questionId: number;
  selectedOption: number | null;
}

export type Difficulty = "Easy" | "Intermediate" | "Professional";

export interface QuizResult {
  answers: QuizAnswer[];
  score: number;
  timeTaken: number;
  isPassed: boolean;
  date: string;
  difficulty: Difficulty;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  timeTaken: number;
  date: string;
  difficulty: Difficulty;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

export interface QuizContextType {
  currentPage: number;
  questions: Question[];
  answers: QuizAnswer[];
  isSubmitted: boolean;
  startTime: number | null;
  endTime: number | null;
  currentDifficulty: Difficulty;
  setCurrentPage: (page: number) => void;
  startQuiz: (difficulty?: Difficulty) => void;
  submitQuiz: () => void;
  setAnswer: (questionId: number, selectedOption: number) => void;
  getResult: () => QuizResult | null;
}
