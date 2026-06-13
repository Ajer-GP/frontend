"use client";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import { logoutAction } from "@/modules/user/features/Auth/services/actions";

interface User {
  id: string;
  email: string;
  fullName: string;
  [key: string]: unknown;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: "SET_USER"; payload: User }
  | { type: "CLEAR_USER" }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_USER":
      return { user: action.payload, isAuthenticated: true, isLoading: false };
    case "CLEAR_USER":
      return { user: null, isAuthenticated: false, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Reads the httpOnly access_token cookie via /api/me and syncs state
  const refreshUser = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await fetch("/api/me", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!res.ok) {
        dispatch({ type: "CLEAR_USER" });
        return;
      }
      const data = await res.json();
      if (data?.user) {
        dispatch({ type: "SET_USER", payload: data.user });
      } else {
        dispatch({ type: "CLEAR_USER" });
      }
    } catch {
      dispatch({ type: "CLEAR_USER" });
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Silently refresh the access_token every 14 minutes (token TTL is 15 min)
  // This calls /api/me which detects the expired access_token, uses the
  // refresh_token to get a new one from the backend, and sets it as a cookie
  useEffect(() => {
    const FOURTEEN_MINUTES = 14 * 60 * 1000;
    const interval = setInterval(() => {
      refreshUser();
    }, FOURTEEN_MINUTES);
    return () => clearInterval(interval);
  }, [refreshUser]);

  const logout = useCallback(async () => {
    dispatch({ type: "CLEAR_USER" });
    await logoutAction(); // deletes cookies + redirects to /auth/login
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
