
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useQuiz } from "../contexts/QuizContext";
import { Button } from "@/components/ui/button";
import { formatTime } from "../utils/quizUtils";
import { Trophy, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Result = () => {
  const { isAuthenticated, user } = useAuth();
  const { getResult, startQuiz } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const result = getResult();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    } 
    
    if (!result) {
      navigate("/quiz");
      return;
    }
    
    // Show toast with result only once when component mounts
    const showResultToast = () => {
      toast({
        title: result.isPassed ? "Congratulations!" : "Quiz Completed",
        description: result.isPassed 
          ? `You passed with a score of ${result.score}/20!` 
          : `You scored ${result.score}/20. Try again to pass!`,
        variant: result.isPassed ? "default" : "destructive",
      });
    };
    
    showResultToast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate]);
  
  const handleRetake = () => {
    startQuiz();
    navigate("/quiz");
  };
  
  const handleViewLeaderboard = () => {
    navigate("/leaderboard");
  };
  
  if (!isAuthenticated || !user || !result) {
    return null;
  }
  
  const { score, timeTaken, isPassed } = result;
  const formattedTime = formatTime(timeTaken);
  const percentage = (score / 20) * 100;
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-heading mb-2">Quiz Results</h1>
            <p className="text-muted-foreground">Great effort, {user.name}!</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-10">
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted rounded-lg text-center">
              <Trophy className="h-10 w-10 text-quiz-primary mb-3" />
              <div className="text-3xl font-bold mb-1">{score}/20</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted rounded-lg text-center">
              <Clock className="h-10 w-10 text-quiz-accent mb-3" />
              <div className="text-3xl font-bold mb-1">{formattedTime}</div>
              <div className="text-sm text-muted-foreground">Time Taken</div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted rounded-lg text-center">
              {isPassed ? (
                <>
                  <CheckCircle className="h-10 w-10 text-quiz-success mb-3" />
                  <div className="text-3xl font-bold mb-1">Passed</div>
                </>
              ) : (
                <>
                  <XCircle className="h-10 w-10 text-quiz-error mb-3" />
                  <div className="text-3xl font-bold mb-1">Failed</div>
                </>
              )}
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-quiz-primary to-quiz-accent h-4 rounded-full mb-8">
            <div 
              className={`h-full rounded-full ${
                percentage >= 70 ? 'bg-quiz-success' : 'bg-quiz-error'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={handleRetake}
              className="flex-1 max-w-xs mx-auto"
            >
              Retake Quiz
            </Button>
            
            <Button
              onClick={handleViewLeaderboard}
              className="flex-1 max-w-xs mx-auto bg-quiz-primary hover:bg-quiz-tertiary"
            >
              View Leaderboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
