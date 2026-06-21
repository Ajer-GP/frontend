// src/lib/auth/getTokenOrRefresh.ts

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getTokenOrRefresh(): Promise<string> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (accessToken) return accessToken;

  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) redirect("/auth/login");

  const res = await fetch(`${process.env.API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { Cookie: `refresh_token=${refreshToken}` },
    cache: "no-store",
  });

  if (!res.ok) redirect("/auth/login");

  const data = await res.json();
  if (!data.accessToken) redirect("/auth/login");

  // ✅ بس رجّعي التوكن — مش بنسيت cookies هنا
  return data.accessToken;
}
