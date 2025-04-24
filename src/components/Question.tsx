
import { useQuiz } from "../contexts/QuizContext";
import { isQuestionAnswered, getSelectedOption, isCorrectAnswer } from "../utils/quizUtils";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface QuestionProps {
  questionId: number;
}

const Question = ({ questionId }: QuestionProps) => {
  const { questions, answers, setAnswer, isSubmitted } = useQuiz();
  
  const question = questions.find(q => q.id === questionId);
  if (!question) return null;
  
  const selectedOption = getSelectedOption(questionId, answers);
  
  const handleOptionSelect = (optionIndex: number) => {
    if (isSubmitted) return; // Don't allow changes after submission
    setAnswer(questionId, optionIndex);
  };
  
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-xl font-medium mb-4">
        <span className="text-quiz-primary font-bold">Q{questionId}.</span> {question.text}
      </h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = isCorrectAnswer(questionId, index, questions);
          
          let optionClassName = cn(
            "quiz-option",
            isSelected && "selected",
            isSubmitted && isSelected && isCorrect && "correct",
            isSubmitted && isSelected && !isCorrect && "incorrect",
            isSubmitted && !isSelected && isCorrect && "correct opacity-50"
          );
          
          return (
            <div
              key={index}
              className={optionClassName}
              onClick={() => handleOptionSelect(index)}
            >
              <div className="flex-1">{option}</div>
              
              {isSubmitted && isSelected && (
                <div className={`flex items-center justify-center h-6 w-6 rounded-full ml-2 ${isCorrect ? 'bg-quiz-success text-white' : 'bg-quiz-error text-white'}`}>
                  {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </div>
              )}
              
              {isSubmitted && !isSelected && isCorrect && (
                <div className="flex items-center justify-center h-6 w-6 rounded-full ml-2 bg-quiz-success text-white">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Question;
