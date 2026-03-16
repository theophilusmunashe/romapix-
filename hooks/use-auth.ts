"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuthState, AdminUser } from "@/lib/types";
import { ADMIN_CREDENTIALS } from "@/lib/types";
import { getAuthState, setAuthState, clearAuthState } from "@/lib/storage";

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, user: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getAuthState();
    setAuth(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    const normalizedUsername = username.trim();
    
    // Check if username matches any admin
    const adminUser = Object.keys(ADMIN_CREDENTIALS).find(
      (admin) => admin.toLowerCase() === normalizedUsername.toLowerCase()
    ) as AdminUser | undefined;

    if (!adminUser) {
      return false;
    }

    // Check password
    if (ADMIN_CREDENTIALS[adminUser] !== password) {
      return false;
    }

    const newState: AuthState = {
      isAuthenticated: true,
      user: adminUser,
    };
    setAuthState(newState);
    setAuth(newState);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearAuthState();
    setAuth({ isAuthenticated: false, user: null });
  }, []);

  return {
    ...auth,
    isLoading,
    login,
    logout,
  };
}
