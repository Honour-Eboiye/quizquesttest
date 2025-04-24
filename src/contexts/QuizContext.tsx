
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Question, QuizAnswer, QuizResult, QuizContextType, Difficulty } from '../types';
import { questions } from '../data/questions';
import { calculateScore, saveQuizResult } from '../utils/quizUtils';

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>("Intermediate");
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Initialize empty answers for all questions
  useEffect(() => {
    const initialAnswers = questions.map(question => ({
      questionId: question.id,
      selectedOption: null
    }));
    setAnswers(initialAnswers);
  }, []);

  const startQuiz = (difficulty: Difficulty = "Intermediate"): void => {
    setStartTime(Date.now());
    setIsSubmitted(false);
    setEndTime(null);
    setCurrentPage(1);
    setCurrentDifficulty(difficulty);
    setQuizResult(null);
    
    // Reset answers
    const initialAnswers = questions.map(question => ({
      questionId: question.id,
      selectedOption: null
    }));
    setAnswers(initialAnswers);
  };

  const submitQuiz = (): void => {
    if (isSubmitted) return;
    
    const now = Date.now();
    setEndTime(now);
    setIsSubmitted(true);
    
    // Calculate result once
    if (startTime) {
      const score = calculateScore(questions, answers);
      const timeTaken = now - startTime;
      const isPassed = score >= 14; // 70% of 20 questions
      
      const result: QuizResult = {
        answers,
        score,
        timeTaken,
        isPassed,
        date: new Date().toISOString(),
        difficulty: currentDifficulty
      };
      
      setQuizResult(result);
      saveQuizResult(result);
    }
  };

  const setAnswer = (questionId: number, selectedOption: number): void => {
    if (isSubmitted) return; // Don't allow changes after submission
    
    setAnswers(prevAnswers => 
      prevAnswers.map(answer => 
        answer.questionId === questionId 
          ? { ...answer, selectedOption } 
          : answer
      )
    );
  };

  const getResult = (): QuizResult | null => {
    if (quizResult) return quizResult;
    if (!isSubmitted || !startTime || !endTime) return null;
    
    const score = calculateScore(questions, answers);
    const timeTaken = endTime - startTime;
    const isPassed = score >= 14; // 70% of 20 questions
    
    const result = {
      answers,
      score,
      timeTaken,
      isPassed,
      date: new Date().toISOString(),
      difficulty: currentDifficulty
    };
    
    return result;
  };

  return (
    <QuizContext.Provider
      value={{
        currentPage,
        questions,
        answers,
        isSubmitted,
        startTime,
        endTime,
        currentDifficulty,
        setCurrentPage,
        startQuiz,
        submitQuiz,
        setAnswer,
        getResult
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
