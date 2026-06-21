"use client";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  useRef,
} from "react";
import { logoutAction } from "@/Modules/User/Features/Auth/services/actions";

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

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes
const REFRESH_BEFORE_MS = 60 * 1000; // refresh 1 minute before expiry

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    refreshTimerRef.current = setTimeout(async () => {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        scheduleRefresh(); // token refreshed — schedule the next one
      } else {
        dispatch({ type: "CLEAR_USER" });
        await logoutAction();
      }
    }, TOKEN_TTL_MS - REFRESH_BEFORE_MS); // fires after 14 minutes
  }, []);

  const refreshUser = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await fetch("/api/me", {
        cache: "no-store",
        credentials: "include",
      });
      if (!res.ok) {
        dispatch({ type: "CLEAR_USER" });
        return;
      }
      const data = await res.json();
      if (data?.user) {
        dispatch({ type: "SET_USER", payload: data.user });
        scheduleRefresh(); // start the countdown once we confirm the user is authenticated
      } else {
        dispatch({ type: "CLEAR_USER" });
      }
    } catch {
      dispatch({ type: "CLEAR_USER" });
    }
  }, [scheduleRefresh]);

  // Check auth on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  const logout = useCallback(async () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    dispatch({ type: "CLEAR_USER" });
    await logoutAction();
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
