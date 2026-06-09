"use client";
import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useState,
} from "react";
type UserContextType = {
  user: any;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  setUser: Dispatch<any>;
};

const UserContext = createContext<UserContextType | null>(null);
// const UserContext = createContext(null);

export function UserProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: any;
}) {
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
    if (initialUser) {
      setUser(initialUser);
      setIsLoading(false);
      return;
    }

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
