"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@/types";
import { saveAuth, clearAuth, getSavedUser, getToken } from "@/lib/auth";
import api from "@/lib/api";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const savedUser = getSavedUser();

      console.log("Initializing auth...");
      console.log("Token exists:", !!token);
      console.log("Saved user:", savedUser);

      // If no token or saved user, we're done
      if (!token || !savedUser) {
        console.log("No token or user found, skipping auth check");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Verifying token with /api/auth/me");
        const response = await api.get("/api/auth/me");
        console.log("Auth verification response:", response.data);
        
        // Check the response structure - your backend might return data differently
        if (response.data && response.data.user) {
          setUser(response.data.user);
          // Update stored user in case anything changed
          saveAuth(token, response.data.user);
        } else if (response.data && response.data.data) {
          // Alternative response structure
          setUser(response.data.data);
          saveAuth(token, response.data.data);
        } else {
          console.error("Unexpected response structure:", response.data);
          clearAuth();
          setUser(null);
        }
      } catch (err: any) {
        console.error("Auth verification failed:", err.response?.status, err.response?.data);
        // Clear invalid auth data
        clearAuth();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    console.log("Logging in user:", userData);
    saveAuth(token, userData);
    setUser(userData);
  };

  const logout = () => {
    console.log("Logging out");
    clearAuth();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role ?? null, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);