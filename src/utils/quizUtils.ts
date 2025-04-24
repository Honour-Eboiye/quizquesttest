
import { Question, QuizAnswer, QuizResult, LeaderboardEntry, Difficulty } from "../types";
import { getCurrentUser } from "./authUtils";

const LEADERBOARD_KEY = 'quiz-app-leaderboard';
const RESULTS_KEY = 'quiz-app-results';

export const calculateScore = (questions: Question[], answers: QuizAnswer[]): number => {
  return answers.reduce((score, answer) => {
    if (answer.selectedOption === null) return score;
    
    const question = questions.find(q => q.id === answer.questionId);
    if (question && question.correctOption === answer.selectedOption) {
      return score + 1;
    }
    
    return score;
  }, 0);
};

export const isQuestionAnswered = (questionId: number, answers: QuizAnswer[]): boolean => {
  return answers.some(answer => answer.questionId === questionId && answer.selectedOption !== null);
};

export const getSelectedOption = (questionId: number, answers: QuizAnswer[]): number | null => {
  const answer = answers.find(answer => answer.questionId === questionId);
  return answer ? answer.selectedOption : null;
};

export const isCorrectAnswer = (
  questionId: number, 
  selectedOption: number | null, 
  questions: Question[]
): boolean => {
  if (selectedOption === null) return false;
  
  const question = questions.find(q => q.id === questionId);
  return question ? question.correctOption === selectedOption : false;
};

export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const saveQuizResult = (result: QuizResult): void => {
  const resultsString = localStorage.getItem(RESULTS_KEY);
  const results = resultsString ? JSON.parse(resultsString) : [];
  
  results.push(result);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  
  // Update leaderboard
  updateLeaderboard(result);
};

export const updateLeaderboard = (result: QuizResult): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const leaderboardString = localStorage.getItem(LEADERBOARD_KEY);
  const leaderboard: LeaderboardEntry[] = leaderboardString ? JSON.parse(leaderboardString) : [];
  
  const newEntry: LeaderboardEntry = {
    name: user.name,
    score: result.score,
    timeTaken: result.timeTaken,
    date: result.date,
    difficulty: result.difficulty
  };
  
  // Add the new entry and sort
  leaderboard.push(newEntry);
  
  // Sort by difficulty (Professional > Intermediate > Easy)
  // Then by score (higher is better)
  // Then by time (lower is better)
  leaderboard.sort((a, b) => {
    // Sort by difficulty first
    const difficultyOrder = { "Professional": 3, "Intermediate": 2, "Easy": 1 };
    const diffA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder];
    const diffB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
    
    if (diffB !== diffA) {
      return diffB - diffA;
    }
    
    // Then by score (descending)
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    
    // Then by time (ascending)
    return a.timeTaken - b.timeTaken;
  });
  
  // Keep only top 10
  const topLeaderboard = leaderboard.slice(0, 10);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topLeaderboard));
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  const leaderboardString = localStorage.getItem(LEADERBOARD_KEY);
  return leaderboardString ? JSON.parse(leaderboardString) : [];
};

export const getDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case "Easy":
      return "text-green-500";
    case "Intermediate":
      return "text-blue-500";
    case "Professional":
      return "text-purple-500";
    default:
      return "text-gray-500";
  }
};
