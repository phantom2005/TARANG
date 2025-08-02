// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token?: string) => void; // Optional: accept a token
  logout: () => void;
  isLoadingAuth: boolean; // To indicate if auth state is being determined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // In a real app, this would verify a token from a secure cookie or localStorage
  const checkAuthStatus = useCallback(() => {
    // Example: Check for a token in localStorage (less secure for prod)
    // For production, use HttpOnly cookies and server-side session checks.
    const token = localStorage.getItem('user_token');
    if (token) {
      // You might want to validate this token with your backend here
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setIsLoadingAuth(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = (token?: string) => {
    // In a real app, save the token securely (e.g., in HttpOnly cookie set by backend)
    // For this example, we'll use localStorage
    if (token) {
      localStorage.setItem('user_token', token);
    } else {
      // If no token provided, just set a placeholder
      localStorage.setItem('user_token', 'simulated_token');
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isLoadingAuth }}>
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