'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthToken, clearAuthToken } from '@/lib/api-client';

type User = {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'instructor' | 'admin';
  avatarUrl?: string;
  learnworldsUser_?: string;
  isActive: boolean;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUserData: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Function to read user data from cookies
  const readUserFromCookies = () => {
    try {
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='));

      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        console.log('🔍 AuthContext - User data from cookies:', userData);
        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
    return null;
  };

  // Function to refresh user data
  const refreshUserData = () => {
    console.log('🔄 AuthContext - Refreshing user data...');
    readUserFromCookies();
  };

  useEffect(() => {
    // Check for stored user data on mount
    readUserFromCookies();

    // Check for stored token in localStorage
    const tokenCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      setAuthToken(token);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Call backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Invalid credentials');
    }

    // Store user and token
    const { user, token } = data;
    console.log('🔍 AuthContext - Login successful, user data:', user);
    setUser(user);

    // Store token in localStorage for apiFetch to use
    setAuthToken(token);

    // Set cookie with 7 days expiry
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; expires=${expiryDate.toUTCString()}; path=/`;
    document.cookie = `token=${token}; expires=${expiryDate.toUTCString()}; path=/`;

    // Redirect based on role
    if (user.role === 'admin') {
      router.push('/admin');
    } else if (user.role === 'instructor') {
      router.push('/instructor/dashboard');
    } else {
      router.push('/student/dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    // Clear token from localStorage
    clearAuthToken();
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
