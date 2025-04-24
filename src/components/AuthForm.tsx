
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const success = login(email, password);
      if (success) {
        toast({
          title: "Login successful!",
          description: "Welcome back to Quiz App",
        });
      } else {
        toast({
          title: "Login failed!",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } else {
      if (!name || !email || !password) {
        toast({
          title: "Registration failed!",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }
      
      const success = signup(name, email, password);
      if (success) {
        toast({
          title: "Registration successful!",
          description: "Welcome to Quiz App",
        });
      } else {
        toast({
          title: "Registration failed!",
          description: "Email already in use",
          variant: "destructive",
        });
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="auth-card w-full max-w-md mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 gradient-heading">
        {isLogin ? "Login to Quiz App" : "Sign Up for Quiz App"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button type="submit" className="w-full bg-gradient-to-r from-quiz-primary to-quiz-tertiary hover:opacity-90">
          {isLogin ? "Login" : "Sign Up"}
        </Button>
      </form>
      
      <div className="mt-6 text-sm text-center">
        <p className="text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={toggleForm}
            className="ml-1 font-medium text-primary hover:underline focus:outline-none"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
