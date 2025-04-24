
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthForm from "../components/AuthForm";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/quiz");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-quiz-light p-4">
      <div className="w-full max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold gradient-heading mb-3">
          Quiz Quest
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Test your knowledge with our interactive quiz. Answer 20 questions and see how you stack up!
        </p>
      </div>
      
      <AuthForm />
      
      <div className="mt-16 text-center text-sm text-muted-foreground">
        <p>© 2025 Quiz Quest. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Index;
