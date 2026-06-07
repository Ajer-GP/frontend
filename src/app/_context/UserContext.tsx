"use client";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/me", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Always verify auth state with server, even if initialUser exists
    // This ensures tokens haven't been deleted/expired elsewhere
    fetchUser();
  }, [initialUser]);

  return (
    <UserContext.Provider value={{ user, isLoading, fetchUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
