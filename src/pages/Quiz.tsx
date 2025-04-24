
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useQuiz } from "../contexts/QuizContext";
import { Difficulty } from "../types";
import Question from "../components/Question";
import ProgressBar from "../components/ProgressBar";
import Timer from "../components/Timer";
import QuizNavigation from "../components/QuizNavigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Quiz = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { questions, startQuiz, submitQuiz, currentPage, isSubmitted, currentDifficulty } = useQuiz();
  const navigate = useNavigate();
  const [showDifficultySelector, setShowDifficultySelector] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Questions for the current page (10 per page)
  const questionsPerPage = 10;
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);
  
  // Check authentication when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  // Redirect to results page after submission
  useEffect(() => {
    if (isSubmitted) {
      navigate("/result");
    }
  }, [isSubmitted, navigate]);
  
  const handleSubmit = () => {
    submitQuiz();
    toast({
      title: "Quiz Submitted",
      description: "Processing your answers...",
    });
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    startQuiz(difficulty);
    setShowDifficultySelector(false);
    toast({
      title: `${difficulty} Mode Selected`,
      description: `Good luck with your quiz! ${difficulty === "Easy" ? "3 minutes" : 
                   difficulty === "Intermediate" ? "2 minutes" : "90 seconds"} on the clock.`,
    });
  };
  
  if (!isAuthenticated || !user) {
    return null;
  }

  if (showDifficultySelector) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="container max-w-4xl mx-auto py-4 px-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold gradient-heading">Quiz Quest</h1>
              
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container max-w-4xl mx-auto py-16 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-8">Select Difficulty Level</h2>
            
            <div className="space-y-8">
              <div 
                className="p-6 border rounded-lg hover:border-quiz-primary cursor-pointer transition-all"
                onClick={() => handleDifficultySelect("Easy")}
              >
                <h3 className="text-xl font-medium mb-2">Easy</h3>
                <p className="text-muted-foreground">
                  Recommended for beginners. Basic questions with 3 minutes time limit.
                </p>
              </div>
              
              <div 
                className="p-6 border rounded-lg hover:border-quiz-primary cursor-pointer transition-all"
                onClick={() => handleDifficultySelect("Intermediate")}
              >
                <h3 className="text-xl font-medium mb-2">Intermediate</h3>
                <p className="text-muted-foreground">
                  For those familiar with the subject. Moderate difficulty with 2 minutes time limit.
                </p>
              </div>
              
              <div 
                className="p-6 border rounded-lg hover:border-quiz-primary cursor-pointer transition-all"
                onClick={() => handleDifficultySelect("Professional")}
              >
                <h3 className="text-xl font-medium mb-2">Professional</h3>
                <p className="text-muted-foreground">
                  For experts only. Challenging questions with just 90 seconds time limit.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-heading">Quiz Quest</h1>
            
            <div className="flex items-center gap-4">
              <div className="bg-muted py-1 px-3 rounded-full text-sm font-medium">
                {currentDifficulty}
              </div>
              <Timer />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <ProgressBar />
        </div>
        
        <div className="space-y-12">
          {currentQuestions.map((question) => (
            <Question key={question.id} questionId={question.id} />
          ))}
        </div>
        
        <QuizNavigation onSubmit={handleSubmit} />
      </main>
    </div>
  );
};

export default Quiz;
