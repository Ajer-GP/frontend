"use client";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

const hasAuthCookies = () => {
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const hasAccess = cookies.some((c) => c.startsWith("access_token="));
  const hasRefresh = cookies.some((c) => c.startsWith("refresh_token="));
  return hasAccess || hasRefresh;
};

export function UserProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(initialUser === null);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const isAuthenticated = hasAuthCookies();
      setUser(isAuthenticated ? { authenticated: true } : null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, fetchUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
