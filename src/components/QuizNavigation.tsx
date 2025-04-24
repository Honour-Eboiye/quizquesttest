
import { Button } from "@/components/ui/button";
import { useQuiz } from "../contexts/QuizContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuizNavigationProps {
  onSubmit?: () => void;
}

const QuizNavigation = ({ onSubmit }: QuizNavigationProps) => {
  const { currentPage, setCurrentPage, isSubmitted, answers } = useQuiz();
  
  const totalPages = 2;
  const questionsPerPage = 10;
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Calculate if all questions on the current page are answered
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentPageAnswers = answers.slice(startIndex, endIndex);
  
  // Check if all questions across all pages are answered
  const allQuestionsAnswered = answers.every(answer => answer.selectedOption !== null);
  
  return (
    <div className="flex justify-between items-center mt-8">
      <Button
        variant="outline"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`${currentPage === 1 ? 'invisible' : ''}`}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      
      {currentPage < totalPages ? (
        <Button onClick={handleNextPage} disabled={isSubmitted}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitted || !allQuestionsAnswered}
          className="bg-quiz-primary hover:bg-quiz-tertiary"
        >
          Submit Quiz
        </Button>
      )}
    </div>
  );
};

export default QuizNavigation;
