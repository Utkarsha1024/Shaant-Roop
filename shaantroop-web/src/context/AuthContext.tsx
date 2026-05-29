"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { UserDTO } from "@/lib/types";

interface AuthContextValue {
  user: UserDTO | null;
  isLoading: boolean;
  login: (user: UserDTO, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_KEY = "shaantroop_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate user from localStorage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw) as UserDTO);
    } catch {
      // Ignore corrupt storage
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((userData: UserDTO, token: string) => {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem("shaantroop_token", token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("shaantroop_token");
    // Also clear the HttpOnly cookie via a server action / API call if needed
    // For now, redirect to login which will clear state
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
