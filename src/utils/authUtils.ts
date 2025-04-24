
import { User } from "../types";

const USERS_KEY = 'quiz-app-users';
const CURRENT_USER_KEY = 'quiz-app-current-user';

export const getUsers = (): User[] => {
  const usersString = localStorage.getItem(USERS_KEY);
  return usersString ? JSON.parse(usersString) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const userString = localStorage.getItem(CURRENT_USER_KEY);
  return userString ? JSON.parse(userString) : null;
};

export const saveCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const signupUser = (name: string, email: string, password: string): boolean => {
  const users = getUsers();
  
  // Check if user already exists
  if (users.some(user => user.email === email)) {
    return false;
  }
  
  // Create new user
  const newUser: User = { name, email, password };
  users.push(newUser);
  saveUsers(users);
  saveCurrentUser(newUser);
  
  return true;
};

export const loginUser = (email: string, password: string): boolean => {
  const users = getUsers();
  const user = users.find(user => user.email === email && user.password === password);
  
  if (user) {
    saveCurrentUser(user);
    return true;
  }
  
  return false;
};

export const logoutUser = (): void => {
  saveCurrentUser(null);
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
