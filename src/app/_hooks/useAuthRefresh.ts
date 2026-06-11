// hooks/useAutoRefresh.ts
"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const ACCESS_TOKEN_TTL_MS = 14 * 60 * 1000; // refresh every 14 min (1 min before expiry)

export function useAutoRefresh() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = async () => {
    const res = await fetch("/api/auth/refresh", { method: "POST" });

    if (!res.ok) {
      // Refresh token expired → force logout
      router.push("/login");
      return;
    }

    // Schedule next refresh
    timerRef.current = setTimeout(refresh, ACCESS_TOKEN_TTL_MS);
  };

  useEffect(() => {
    // Kick off the first scheduled refresh
    timerRef.current = setTimeout(refresh, ACCESS_TOKEN_TTL_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}
