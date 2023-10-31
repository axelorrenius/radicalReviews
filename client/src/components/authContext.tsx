import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  authenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authenticated, setAuthenticated] = useState(
    // Initialize with the value from localStorage, if available
    localStorage.getItem('authenticated') === 'true'
  );

  useEffect(() => {
    // Store the authenticated state in localStorage whenever it changes
    localStorage.setItem('authenticated', String(authenticated));
  }, [authenticated]);

  const login = () => {
    setAuthenticated(true);
  };

  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem('authenticated');
  };
  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}