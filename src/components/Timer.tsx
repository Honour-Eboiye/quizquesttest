
import { useState, useEffect } from "react";
import { useQuiz } from "../contexts/QuizContext";
import { formatTime } from "../utils/quizUtils";
import { Clock } from "lucide-react";

const Timer = () => {
  const { startTime, endTime, isSubmitted, submitQuiz, currentDifficulty } = useQuiz();
  const [timeLeft, setTimeLeft] = useState(120000); // 2 minutes in milliseconds
  
  useEffect(() => {
    if (!startTime || isSubmitted) return;
    
    // Set initial time based on difficulty
    let initialTime = 120000; // 2 minutes default
    
    if (currentDifficulty === "Easy") {
      initialTime = 180000; // 3 minutes for Easy
    } else if (currentDifficulty === "Professional") {
      initialTime = 90000; // 1.5 minutes for Professional
    }
    
    setTimeLeft(initialTime); // Set initial time immediately
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = initialTime - elapsed;
      
      if (remaining <= 0) {
        // Time's up, auto-submit
        clearInterval(interval);
        submitQuiz();
        return;
      }
      
      setTimeLeft(remaining);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, isSubmitted, submitQuiz, currentDifficulty]);
  
  // If quiz is submitted, show the final time taken
  const displayTime = isSubmitted && endTime && startTime 
    ? formatTime(endTime - startTime)
    : formatTime(timeLeft);
  
  return (
    <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm py-1 px-3 rounded-full border text-sm">
      <Clock className="h-4 w-4 text-quiz-primary" />
      <span>{displayTime}</span>
    </div>
  );
};

export default Timer;
