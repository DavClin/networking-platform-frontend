"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/lib/authService";
import { getAccessToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rehydrate from localStorage on first load (client-side only)
    const token = getAccessToken();
    const storedUser = authService.getStoredUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  async function login(credentials) {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function signup(data) {
    const newUser = await authService.signup(data);
    setUser(newUser);
    return newUser;
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
