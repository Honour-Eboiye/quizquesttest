
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LeaderboardEntry } from "../types";
import { getLeaderboard, formatTime, getDifficultyColor } from "../utils/quizUtils";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Leaderboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    
    const leaderboardData = getLeaderboard();
    setLeaderboard(leaderboardData);
    
    if (leaderboardData.length === 0) {
      toast({
        title: "No Leaderboard Entries Yet",
        description: "Complete a quiz to be the first on the leaderboard!",
      });
    }
  }, [isAuthenticated, navigate, toast]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const handleBack = () => {
    navigate("/result");
  };
  
  const handleTakeQuiz = () => {
    navigate("/quiz");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold gradient-heading">Leaderboard</h1>
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-6">No entries yet. Be the first to score!</p>
              <Button 
                onClick={handleTakeQuiz} 
                className="bg-quiz-primary hover:bg-quiz-tertiary"
              >
                Take Quiz Now
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Rank</th>
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Difficulty</th>
                    <th className="text-center py-3 px-2">
                      <Trophy className="h-4 w-4 mx-auto text-quiz-accent" />
                    </th>
                    <th className="text-center py-3 px-2">
                      <Clock className="h-4 w-4 mx-auto text-quiz-accent" />
                    </th>
                    <th className="text-right py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr 
                      key={index} 
                      className={`border-b hover:bg-muted/20 transition-colors ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''
                      }`}
                    >
                      <td className="py-3 px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-400 text-white' :
                          index === 1 ? 'bg-gray-300 text-gray-800' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 px-2 font-medium">{entry.name}</td>
                      <td className="py-3 px-2">
                        <span className={`font-medium ${getDifficultyColor(entry.difficulty)}`}>
                          {entry.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">{entry.score}/20</td>
                      <td className="py-3 px-2 text-center">{formatTime(entry.timeTaken)}</td>
                      <td className="py-3 px-2 text-right text-muted-foreground">
                        {formatDate(entry.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Button 
              onClick={handleTakeQuiz} 
              className="bg-quiz-primary hover:bg-quiz-tertiary"
            >
              Take Quiz Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
