
import { useQuiz } from "../contexts/QuizContext";
import { Progress } from "@/components/ui/progress";
import { getDifficultyColor } from "../utils/quizUtils";

const ProgressBar = () => {
  const { questions, answers, currentDifficulty } = useQuiz();
  
  const answeredQuestions = answers.filter(answer => answer.selectedOption !== null).length;
  const progress = (answeredQuestions / questions.length) * 100;
  
  const difficultyColorClass = getDifficultyColor(currentDifficulty);
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm mb-1">
        <span className={`${difficultyColorClass} font-medium`}>Progress ({currentDifficulty})</span>
        <span className="font-medium">{answeredQuestions} of {questions.length} questions</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default ProgressBar;
