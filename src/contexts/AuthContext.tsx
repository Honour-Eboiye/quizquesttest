
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { signupUser, loginUser, logoutUser, getCurrentUser } from '../utils/authUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const success = loginUser(email, password);
    if (success) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    return success;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    const success = signupUser(name, email, password);
    if (success) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    return success;
  };

  const logout = (): void => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
